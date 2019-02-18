const mongoose = require("mongoose")

const Tag = require("./index")

const CandidateTagSchema = new mongoose.Schema({

  _candidate: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Candidate"
  },
  _organization: { // redundancy
    type: mongoose.Schema.Types.ObjectId,
    ref: "Organization"
  },

})

CandidateTagSchema.set("toJSON", { virtuals: true })
CandidateTagSchema.set("toObject", { virtuals: true })


module.exports = Tag.discriminator("CandidateTag", CandidateTagSchema)
