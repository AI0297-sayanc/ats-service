const mongoose = require("mongoose")

const OrganizationSchema = new mongoose.Schema({


  createdAt: {
    type: Date,
    default: Date.now
  },

  lastModifiedAt: {
    type: Date,
    default: Date.now
  },
})

OrganizationSchema.set("toJSON", { virtuals: true })
OrganizationSchema.set("toObject", { virtuals: true })


module.exports = mongoose.model("Organization", OrganizationSchema)
