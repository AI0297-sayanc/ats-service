const Mailgun = require("mailgun-js")

const Candidate = require("../../models/candidate")
const Mail = require("../../models/message")

const mailgun = Mailgun({
  apiKey: process.env.MAILGUN_API_KEY,
  domain: process.env.MAILGUN_DOMAIN
})

module.exports = {
  /**
  * @api {POST} /message/send Send a message to a candidate.
  * @apiName sendMessage
  * @apiGroup Messages
  * @apiPermission User
  * @apiParam  {String} subject Mail Subject
  * @apiParam  {String} candidateId _id of candidate
  * @apiParam  {String} subject Mail Subject. Might be overwritten in case of replying.
  * @apiParam  {String} html The html body of the email message
  * @apiParam  {String} [replyToMsgId] Mailgun message ID to reply to. If specified, implies that this is continuation of an existing message thread.
  * @apiSuccessExample {type} Success-Response: 200 OK
  * {
  *     error : false
  * }
  */
  async post(req, res) {
    if (req.body.candidateId === undefined || req.body.html === undefined) return res.status(400).json({ error: true, reason: "Missing mandatory fields 'candidateId' or 'html'" })
    const data = {}
    try {
      const candidate = await Candidate.findOne({ _id: req.body.candidateId }).exec()
      if (candidate === null) return res.status(400).json({ error: true, reason: "No such candidate!" })

      // data.from = `Recruitech LS<${process.env.MAILGUN_EMAIL_FROM}>`
      data.from = `${req.user.name.full} <${req.user.email}>`
      data.to = candidate.email
      data.subject = req.body.subject || "No Subject" // might be overriden below (in case of replying)
      data.html = req.body.html || req.body.text || req.body.content || req.body.body
      data.isOpened = false
      if (req.body.replyToMsgId !== undefined) { // exisiting thread (replying)
        // eslint-disable-next-line newline-per-chained-call
        const { threadId, subject } = await Mail.findOne({ mgMsgId: req.body.replyToMsgId }).select("threadId subject").lean().exec()
        data.replyToMsgId = req.body.replyToMsgId
        data.subject = (subject.startsWith("Re:"))
          ? subject
          : `Re: ${subject}`
        data["h:In-Reply-To"] = req.body.replyToMsgId // for mailing only
        data.threadId = threadId // for DB only
      }
      try {
        data["h:Reply-To"] = req.user.email // process.env.MAILGUN_EMAIL_FROM // for mailing only
        data["o:tracking-opens"] = "yes" // for mailing only
        const sentMail = await mailgun.messages().send(data)
        data.isQueuedWithMg = true
        data.mgMsgId = sentMail.id
      } catch (mgErr) {
        console.log("====> MailGun err:", mgErr)
        data.isQueuedWithMg = false
        data.mgMsgId = null
      }
      data._organization = req.user._organization
      data._candidate = req.body.candidateId
      data._user = req.user.id
      await Mail.create(data)
      return res.json({ error: false })
    } catch (error) {
      console.log(error)
      return res.status(500).json({ error: true, reason: error.message })
    }
  },

  /** Webhook */
  async replyReceived(req, res) {
    const { headers, body } = req
    // console.log("***********", headers, body);
    if (!mailgun.validateWebhook(body.timestamp, body.token, body.signature)) {
      console.error("ERR: Request came, but not from Mailgun")
      return res.status(406).send({ error: { message: "Invalid signature. Are you even Mailgun?" } })
    }
    const data = {}
    data.replyToMsgId = body["In-Reply-To"]
    if (data.replyToMsgId === undefined) return res.status(406).send({ error: { message: "Not a Reply!" } })
    data.mgMsgId = body["Message-Id"]
    data.from = body.from
    data.subject = body.subject
    data.html = body["body-html"]
    try {
      // eslint-disable-next-line newline-per-chained-call
      const {
        threadId, from, _organization, _candidate, _user
      } = await Mail.findOne({ mgMsgId: data.replyToMsgId }).lean().exec()
      data.to = from
      data.threadId = threadId
      data._organization = _organization
      data._candidate = _candidate
      data._user = _user
      await Mail.create(data)
    } catch (error) {
      console.log(error)
      return res.status(500).json({ error: true, reason: error.message })
    }
    return res.json({ headers, body })
  },

  /** Webhook */
  async opened(req, res) {
    const { headers, body } = req
    // console.log("***********", headers, body);
    if (!mailgun.validateWebhook(body.signature.timestamp, body.signature.token, body.signature.signature)) {
      console.error("ERR: Request came, but not from Mailgun")
      return res.status(406).send({ error: { message: "Invalid signature. Are you even Mailgun?" } })
    }
    try {
      const data = body["event-data"]
      const mgMsgId = `<${data.message.headers["message-id"]}>`
      await Mail.updateOne(
        { mgMsgId },
        { isOpened: true, openedAt: Math.ceil(body.signature.timestamp) * 1000 }
      )
      // pub.publish("mail-opened", JSON.stringify({
      //   mgMsgId,
      //   openedAt: Math.ceil(body.signature.timestamp) * 1000
      // }))
      return res.send("OK")
    } catch (error) {
      console.log(error)
      return res.status(500).json({ error: true, reason: error.message })
    }
  },

  /**
  * @api {GET} /messages Get list of all email messages to a candidate, grouped by threads
  * @apiName getMessages
  * @apiGroup Messages
  * @apiPermission User
  * @apiParam  {String} candidateId _id of the candidate
  * @apiParam  {Boolean} [showMyMailsOnly=false] Optionally filter to show emails sent by current user only
  * @apiSuccessExample {type} Success-Response: 200 OK
  * {
  *     error : false,
  *     threads: [{}]
  * }
  */
  async get(req, res) {
    if (req.body.candidateId === undefined) return res.status(400).json({ error: true, reason: "Missing mandatory field 'candidateId'" })
    try {
      const matcher = { _organization: req.user._organization, _candidate: req.body.candidateId }
      if (req.body.showMyMailsOnly === true) matcher._user = req.user.id
      const threads = await Mail.aggregate([
        matcher,
        { $sort: { createdAt: 1 } },
        {
          $group: {
            _id: "$threadId",
            messages: { $push: "$$ROOT" },
            messagesCount: { $sum: 1 }
          }
        }
      ]).exec()
      return res.json({ error: false, threads })
    } catch (error) {
      return res.status(500).json({ error: true, reason: error.message })
    }
  }

}
