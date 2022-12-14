const Mailgun = require("mailgun-js")
const mongoose = require("mongoose")

const Mail = require("../models/message")

const mailgun = Mailgun({
  apiKey: process.env.MAILGUN_API_KEY,
  domain: process.env.MAILGUN_DOMAIN
})

module.exports = {
  async sendMessage({
    user, candidate, mailSubject = "", mailContent = "", replyToMsgId = undefined, isAuto = false
  }) {
    const data = {}
    // data.from = `Recruitech LS<${process.env.MAILGUN_EMAIL_FROM}>`
    data.from = `${user.fullName} <${user.email}>`
    // data.from = `Vineet Harbhajanka <vineet@logic-square.com>`
    data.to = `${candidate.name.full} <${candidate.email}>`
    data.subject = mailSubject || "No Subject" // might be overriden below (in case of replying)
    data.html = mailContent // req.body.html || req.body.text || req.body.content || req.body.body
    data.isOpened = false
    if (replyToMsgId !== undefined) { // exisiting thread (replying)
      // eslint-disable-next-line newline-per-chained-call
      const { threadId, subject } = await Mail.findOne({ mgMsgId: replyToMsgId }).select("threadId subject").lean().exec()
      data.replyToMsgId = replyToMsgId
      data.subject = (subject.startsWith("Re:"))
        ? subject
        : `Re: ${subject}`
      data["h:In-Reply-To"] = replyToMsgId // for mailing only
      data.threadId = threadId // for DB only
    }
    try {
      data["h:Reply-To"] = `${user.fullName} <${user.email}>, ${process.env.MAILGUN_EMAIL_FROM}` // for mailing only
      data["o:tracking-opens"] = "yes" // for mailing only
      const sentMail = await mailgun.messages().send(data)
      data.isQueuedWithMg = true
      data.mgMsgId = sentMail.id
    } catch (mgErr) { // make mailgun errors non-fatal (i.e. DB is still updated)
      console.log("====> MailGun err:", mgErr)
      data.isQueuedWithMg = false
      data.mgMsgId = null
    }
    data.isAuto = isAuto
    data._organization = user._organization
    data._candidate = candidate._id
    data._workflowStage = candidate._currentWorkflowStage
    data._user = user.id
    await Mail.create(data)
    return "OK"
  },

  async fetchMessageThreads(candidateId, user, showMyMailsOnly = false) {
    const matcher = { _organization: mongoose.Types.ObjectId(user._organization), _candidate: mongoose.Types.ObjectId(candidateId) }
    if (showMyMailsOnly === true) matcher._user = mongoose.Types.ObjectId(user.id)
    const threads = await Mail.aggregate([
      { $match: matcher },
      { $sort: { createdAt: 1 } },
      {
        $group: {
          _id: "$threadId",
          messages: { $push: "$$ROOT" },
          messagesCount: { $sum: 1 }
        }
      }
    ]).exec()
    return threads
  }
}
