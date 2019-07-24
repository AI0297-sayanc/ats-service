const Mailgun = require("mailgun-js")
const Pusher = require("pusher")

const Candidate = require("../../models/candidate")
const Mail = require("../../models/message")

const mailgun = Mailgun({
  apiKey: process.env.MAILGUN_API_KEY,
  domain: process.env.MAILGUN_DOMAIN
})

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.PUSHER_KEY,
  secret: process.env.PUSHER_SECRET,
  cluster: process.env.PUSHER_CLUSTER,
  encrypted: true
})

const { sendMessage, fetchMessageThreads } = require("../../lib/message")

module.exports = {
  /**
  * @api {POST} /message/send Send a message to a candidate.
  * @apiName sendMessage
  * @apiGroup CandidateMessage
  * @apiPermission User
  * @apiParam  {String} subject Mail Subject
  * @apiParam  {String} candidateId _id of candidate
  * @apiParam  {String} subject Mail Subject. Might be overwritten in case of replying.
  * @apiParam  {String} html The html body of the email message
  * @apiParam  {String} [replyToMsgId] Mailgun message ID to reply to. If specified, implies that this is continuation of an existing message thread.
  * @apiSuccessExample {type} Success-Response: 200 OK
  * {
  *     error : false,
  *     threads: [{}]
  * }
  */
  async post(req, res) {
    if (req.body.candidateId === undefined || req.body.html === undefined) return res.status(400).json({ error: true, reason: "Missing mandatory fields 'candidateId' or 'html'" })
    try {
      const candidate = await Candidate.findOne({ _id: req.body.candidateId, _organization: req.user._organization }).exec()
      if (candidate === null) return res.status(400).json({ error: true, reason: "No such candidate in your organization!" })

      await sendMessage({
        user: req.user,
        candidate,
        mailSubject: req.body.subject,
        mailContent: req.body.html || req.body.text || req.body.content || req.body.body,
        replyToMsgId: req.body.replyToMsgId
      })

      candidate.activities.push({ text: `${req.user.fullName} sent an Email`, _workflowStage: candidate._currentWorkflowStage, when: Date.now() })

      const [threads, __c] = await Promise.all([
        fetchMessageThreads(candidate._id, req.user, false),
        candidate.save()
      ])

      return res.json({ error: false, threads })
    } catch (error) {
      console.log(error)
      return res.status(500).json({ error: true, reason: error.message })
    }
  },

  /** Mailgun Routes Handler */
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

      const candidate = await Candidate.findOne({ _id: _candidate }).select("_currentWorkflowStage activities").exec()
      candidate.activities.push({ text: "Candidate replied to an Email", _workflowStage: candidate._currentWorkflowStage, when: Date.now() })

      await Promise.all([
        Mail.create(data),
        candidate.save()
      ])
    } catch (error) {
      console.log(error)
      return res.status(500).json({ error: true, reason: error.message })
    }
    return res.json({ headers, body })
  },

  /** Mailgun Webhook Handler */
  async delivered(req, res) {
    const { body } = req
    // console.log("***********", headers, body);
    if (!mailgun.validateWebhook(body.signature.timestamp, body.signature.token, body.signature.signature)) {
      console.error("ERR: Request came, but not from Mailgun")
      return res.status(406).send({ error: { message: "Invalid signature. Are you even Mailgun?" } })
    }
    try {
      const data = body["event-data"]
      if (data.event !== "delivered") return res.status(200).send("WRONG EVENT") // fail gracefully!
      const mgMsgId = `<${data.message.headers["message-id"]}>`
      const deliveredAt = Math.ceil(body.signature.timestamp) * 1000
      await Mail.updateOne(
        { mgMsgId },
        { isDelivered: true, deliveredAt }
      ).exec()
      // real time notif:
      pusher.trigger("email-messages", "delivered", { mgMsgId, deliveredAt })

      return res.send("OK")
    } catch (error) {
      console.log(error)
      return res.status(500).json({ error: true, reason: error.message })
    }
  },

  /** Mailgun Webhook Handler */
  async opened(req, res) {
    const { body } = req
    // console.log("***********", headers, body);
    if (!mailgun.validateWebhook(body.signature.timestamp, body.signature.token, body.signature.signature)) {
      console.error("ERR: Request came, but not from Mailgun")
      return res.status(406).send({ error: { message: "Invalid signature. Are you even Mailgun?" } })
    }
    try {
      const data = body["event-data"]
      if (data.event !== "opened") return res.status(200).send("WRONG EVENT") // fail gracefully!
      const mgMsgId = `<${data.message.headers["message-id"]}>`
      const openedAt = Math.ceil(body.signature.timestamp) * 1000
      await Mail.updateOne(
        { mgMsgId },
        { isOpened: true, openedAt }
      ).exec()
      // real time notif:
      pusher.trigger("email-messages", "opened", { mgMsgId, openedAt })

      return res.send("OK")
    } catch (error) {
      console.log(error)
      return res.status(500).json({ error: true, reason: error.message })
    }
  },

  /**
  * @api {POST} /messages Get list of all email messages to a candidate, grouped by threads
  * @apiName getMessages
  * @apiGroup CandidateMessage
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
      const threads = await fetchMessageThreads(req.body.candidateId, req.user, req.body.showMyMailsOnly)
      return res.json({ error: false, threads })
    } catch (error) {
      return res.status(500).json({ error: true, reason: error.message })
    }
  }

}
