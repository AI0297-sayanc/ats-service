const mongoose = require("mongoose")

const TagSchema = new mongoose.Schema({

  type: {
    type: String,
    enum: ["skill", "opening", "candidate"]
  },

  text: {
    type: String,
    required: true
  },

  _createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Tag"
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

TagSchema.set("toJSON", { virtuals: true })
TagSchema.set("toObject", { virtuals: true })

TagSchema.set("discriminatorKey", "type")

module.exports = mongoose.model("Tag", TagSchema)
