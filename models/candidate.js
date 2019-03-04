const mongoose = require("mongoose")

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

CandidateSchema.pre("save", async function (next) {
  const now = Date.now()
  if (!this.isNew && this.isModified("decisionStatus")) {
    if (this.decisionStatus === "rejected") {
      this.rejectedAt = now
    } else if (this.decisionStatus === "accepted") {
      this.acceptedAt = now
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

CandidateSchema.set("toJSON", { virtuals: true })
CandidateSchema.set("toObject", { virtuals: true })


module.exports = mongoose.model("Candidate", CandidateSchema)
