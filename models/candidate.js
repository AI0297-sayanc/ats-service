const mongoose = require("mongoose")

const { sendMessage } = require("../lib/message")

const CandidateSchema = new mongoose.Schema({

  name: {
    first: {
      type: String,
      required: true
    },
    middle: {
      type: String
    },
    last: {
      type: String,
      required: true
    },
  },

  email: {
    type: String,
    lowercase: true,
    // unique: true,
    required: true,
    index: true,
  },
  altEmail: {
    type: String,
    lowercase: true
  },

  phone: {
    type: String,
    // unique: true,
    required: true,
    index: true
  },

  cvLink: String,

  currentEmployer: String,
  currentPosition: String,
  currentSalary: String,
  currentLocation: String,

  noticePeriod: String,
  availableFrom: Date,

  _skills: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Tag"
  }],

  yearsOfExperience: {
    type: Number,
    min: 0,
    default: 0
  },

  highestEducationalQualification: String,
  experienceSummary: String,
  portfolio: String,

  source: String,
  expectedSalary: String,

  _organization: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Organization"
  },

  _opening: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Opening",
    required: true
  },

  _currentWorkflowStage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "WorkflowStage"
  },

  decisionStatus: {
    type: String,
    enum: ["pending", "rejected", "accepted"],
    default: "pending"
  },

  rejectedAt: {
    type: Date,
    default: null
  },

  rejectionReason: String,

  acceptedAt: {
    type: Date,
    default: null
  },

  _createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  createdAt: {
    type: Date,
    default: Date.now
  },

  lastModifiedAt: {
    type: Date,
    default: Date.now
  },

  activities: [{
    text: { type: String, required: true },
    _workflowStage: { type: mongoose.Schema.Types.ObjectId, ref: "WorkflowStage" },
    when: { type: Date, default: Date.now }
  }]

})

CandidateSchema.virtual("name.full").get(function () {
  const first = (this.name.first === undefined || this.name.first === null)
    ? ""
    : this.name.first
  const middle = (this.name.middle === undefined || this.name.middle === null)
    ? ""
    : ` ${this.name.middle}`
  const last = (this.name.last === undefined || this.name.last === null)
    ? ""
    : ` ${this.name.last}`
  return `${first}${middle}${last}`
})

CandidateSchema.virtual("messageCount", {
  ref: "Message",
  localField: "_id",
  foreignField: "_candidate",
  count: true
})
CandidateSchema.virtual("noteCount", {
  localField: "_id",
  foreignField: "_candidate",
  ref: "Note",
  count: true
})

CandidateSchema.pre("save", async function (next) {
  const now = Date.now()
  if (!this.isNew && this.isModified("decisionStatus")) {
    if (this.decisionStatus === "rejected") {
      this.wasRejected = true // for usage in post hooks below
      this.rejectedAt = now
      this.activities.push({ text: "Candidate Accepted", _workflowStage: this._currentWorkflowStage, when: Date.now() })
    } else if (this.decisionStatus === "accepted") {
      this.wasAccepted = true // for usage in post hooks below
      this.acceptedAt = now
      this.activities.push({ text: "Candidate Rejected", _workflowStage: this._currentWorkflowStage, when: Date.now() })
    }
  }
  this.lastModifiedAt = now
  return next()
})
// CandidateSchema.methods.findSimilar = function (query = {}, projection = null, opts = {}) {
//   return this.model("Candidate").find({
//     $or: [
//       { phone: this.phone },
//       { email: { $in: [this.email, this.altEmail] } },
//       { altEmail: { $in: [this.email, this.altEmail] } },
//     ],
//     ...query
//   }, projection, opts)
// }

CandidateSchema.statics.findSimilarTo = function ({ phone = null, email = null }) {
  const orClause = []
  if (phone !== null) orClause.push({ phone: this.phone })
  if (email !== null) {
    orClause.push({ email: { $in: [this.email, this.altEmail] } })
    orClause.push({ altEmail: { $in: [this.email, this.altEmail] } })
  }
  return this.find({ $or: orClause }).exec()
}

/* always populate message & note counts and activities: */
CandidateSchema.post("find", async (docs) => {
  // eslint-disable-next-line no-restricted-syntax
  for (const doc of docs) {
    // eslint-disable-next-line no-await-in-loop
    await doc.populate("messageCount noteCount").execPopulate()
  }
})
/* always populate message & note counts and activities: */
CandidateSchema.post("findOne", async (doc) => {
  await doc.populate("messageCount noteCount").execPopulate()
})
CandidateSchema.post("save", async (doc) => {
  try {
    /* always populate message & note counts and activities: */
    await doc.populate("messageCount noteCount").execPopulate()
    // eslint-disable-next-line newline-per-chained-call
    const [user, opening] = await Promise.all([
      mongoose.model("User").findOne({ _id: doc._user }).populate("_organization").exec(),
      mongoose.model("Opening").findOne({ _id: doc._opening }).lean().exec()
    ])
    let subject
    let content
    if (doc.wasAccepted) {
      subject = "Congrats! You are accepted!"
      content = `<p>Congrats ${doc.name.first},</p><p>Your application for <b>${opening.title}</b> was Accepted.</p><p>You may reply to this email for further details.</p><br/><p>--Thanks,<br/>${user.name.full}<br/>(${user._organization.title})</p>`
      // promises.push(mongoose.model("Activity").create({ text: "Candidate Accepted", _candidate: doc._id }))
    } else if (doc.wasRejected) {
      subject = "Sorry! You were rejected!"
      content = `<p>Sorry ${doc.name.first},</p><p>Your application for <b>${opening.title}</b> was Rejected.</p><p>You may reply to this email for further details.</p><br/><p>--Thanks,<br/>${user.name.full}<br/>(${user._organization.title})</p>`
      // promises.push(mongoose.model("Activity").create({ text: "Candidate Rejected", _candidate: doc._id }))
    }

    await sendMessage({
      user,
      candidate: doc,
      mailSubject: subject,
      mailContent: content,
      isAuto: true
    })
  } catch (error) {
    console.log("==> ERR sending automated accept/reject mail: ", error);
  }
})

CandidateSchema.set("toJSON", { virtuals: true })
CandidateSchema.set("toObject", { virtuals: true })


module.exports = mongoose.model("Candidate", CandidateSchema)
