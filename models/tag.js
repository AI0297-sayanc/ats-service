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

TagSchema.index({ text: 1, type: 1 })

TagSchema.set("toJSON", { virtuals: true })
TagSchema.set("toObject", { virtuals: true })

TagSchema.statics.batchUpsert = async function (type, tagStrings = []) {
  const writeQueries = tagStrings.map(text => ({
    updateOne: {
      filter: { text, type }, // this combo will be unique ("compound index")
      update: { text, type }, // if matched, basically replace by itself, i.e. no modif
      upsert: true // else, create a new doc
    }
  }))
  const res = await this.bulkWrite(writeQueries)
  console.log('***************', res);
  const tags = await this.find({ text: { $in: tagStrings }, type }).select("_id").lean().exec()
  return tags.map(t => t._id)
}

module.exports = mongoose.model("Tag", TagSchema)
