const mongoose = require("mongoose")

const CandidateSchema = new mongoose.Schema({

  _organization: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Organization"
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

CandidateSchema.set("toJSON", { virtuals: true })
CandidateSchema.set("toObject", { virtuals: true })


module.exports = mongoose.model("Candidate", CandidateSchema)
