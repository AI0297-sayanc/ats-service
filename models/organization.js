const mongoose = require("mongoose")
const cuid = require("cuid")

const OrganizationSchema = new mongoose.Schema({

  title: String,

  widgetApiKey: {
    type: String,
    default: cuid,
    unique: true
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

OrganizationSchema.virtual("_openings", {
  ref: "Opening", // The model to use
  localField: "_id", // Find people where `localField`
  foreignField: "_organization", // is equal to `foreignField` (will it work with an array????)
  justOne: false
})

OrganizationSchema.set("toJSON", { virtuals: true })
OrganizationSchema.set("toObject", { virtuals: true })


module.exports = mongoose.model("Organization", OrganizationSchema)
