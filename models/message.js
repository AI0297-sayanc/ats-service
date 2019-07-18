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

  isAuto: { type: Boolean, default: false },

  _organization: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Organization"
  },
  _candidate: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Candidate"
  },
  candidateName: { type: String, default: null }, // redundancy; set in hooks below
  _user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  userName: { type: String, default: null }, // redundancy; set in hooks below

})

// eslint-disable-next-line prefer-arrow-callback
MessageSchema.pre("save", async function (next) {
  try {
    const [user, candidate] = await Promise.all([
    /* eslint-disable newline-per-chained-call */
      mongoose.model("User").findOne({ _id: this._user }).select("name").lean().exec(),
      mongoose.model("Candidate").findOne({ _id: this._candidate }).select("name").lean().exec(),
    ])
    this.userName = (user !== null) ? user.name.full : null
    this.candidateName = (candidate !== null) ? candidate.name.full : null
  } catch (error) {
    console.log("Couldn't set user/candidate name for message!", error);
  }
  return next()
})

MessageSchema.set("toJSON", { virtuals: true })
MessageSchema.set("toObject", { virtuals: true })


module.exports = mongoose.model("Message", MessageSchema)
