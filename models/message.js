const mongoose = require("mongoose")
const cuid = require("cuid")

const MessageSchema = new mongoose.Schema({
  mgMsgId: { type: String, required: true, default: null }, // mailgun msg id
  from: { type: String, required: true },
  to: { type: String, required: true },
  subject: { type: String },
  html: { type: String, required: true },
  replyToMsgId: { type: String, default: null },
  threadId: { type: String, default: cuid },
  isQueuedWithMg: { type: Boolean },
  createdAt: { type: Date, default: Date.now },
  isOpened: { type: Boolean },
  openedAt: { type: Date },

  _organization: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Organization"
  },
  _candidate: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Candidate"
  },
  _user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

})

MessageSchema.set("toJSON", { virtuals: true })
MessageSchema.set("toObject", { virtuals: true })


module.exports = mongoose.model("Message", MessageSchema)
