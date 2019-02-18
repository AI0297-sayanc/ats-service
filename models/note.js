const mongoose = require("mongoose")

const NoteSchema = new mongoose.Schema({

  text: {
    type: String,
    required: true
  },

  _candidate: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Candidate"
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
  }
})

NoteSchema.set("toJSON", { virtuals: true })
NoteSchema.set("toObject", { virtuals: true })


module.exports = mongoose.model("Note", NoteSchema)
