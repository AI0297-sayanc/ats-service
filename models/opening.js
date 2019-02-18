const mongoose = require("mongoose")

const OpeningSchema = new mongoose.Schema({

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

// eslint-disable-next-line prefer-arrow-callback
OpeningSchema.virtual("_candidates", {
  ref: "Candidate", // The model to use
  localField: "_id", // Find people where `localField`
  foreignField: "_opening", // is equal to `foreignField` (will it work with an array????)
  justOne: false
})

OpeningSchema.set("toJSON", { virtuals: true })
OpeningSchema.set("toObject", { virtuals: true })


module.exports = mongoose.model("Opening", OpeningSchema)
