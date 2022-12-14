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

  _candidate: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Candidate",
    default: null
  },
  _organization: { // redundancy
    type: mongoose.Schema.Types.ObjectId,
    ref: "Organization",
    default: null
  },
  _opening: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Opening",
    default: null
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

TagSchema.statics.batchUpsert = async function (data) {
  const writeQueries = data.map(doc => ({
    updateOne: {
      filter: { text: doc.text, type: doc.type },
      update: doc,
      upsert: true
    }
  }))
  await this.bulkWrite(writeQueries)
}

module.exports = mongoose.model("Tag", TagSchema)
