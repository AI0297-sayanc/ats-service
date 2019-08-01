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

  isDelivered: { type: Boolean, default: false },
  deliveredAt: { type: Date },
  isOpened: { type: Boolean, default: false },
  openedAt: { type: Date },

  isAuto: { type: Boolean, default: false },

  _organization: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Organization"
  },
  _candidate: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Candidate"
  },
  fromName: { type: String, default: null }, // redundancy; set in hooks below
  fromEmail: { type: String, default: null }, // redundancy; set in hooks below
  _user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  toName: { type: String, default: null }, // redundancy; set in hooks below
  toEmail: { type: String, default: null }, // redundancy; set in hooks below,

  _workflowStage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "WorkflowStage",
    default: null
  },

})

/* eslint-disable-next-line prefer-arrow-callback */
MessageSchema.pre("save", async function (next) {
  this.fromName = this.from.split("<").shift().trim()
  this.toName = this.to.split("<").shift().trim()
  this.fromEmail = this.from.split("<").pop().replace(">", "").trim()
  this.toEmail = this.to.split("<").pop().replace(">", "").trim()
  return next()
})
/* eslint-disable prefer-arrow-callback */

MessageSchema.set("toJSON", { virtuals: true })
MessageSchema.set("toObject", { virtuals: true })


module.exports = mongoose.model("Message", MessageSchema)
