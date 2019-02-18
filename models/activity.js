const mongoose = require("mongoose")

const ActivitySchema = new mongoose.Schema({

  type: String,

  text: {
    type: String,
    required: true
  },

  _candidate: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Candidate"
  },

  _workflowStage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "WorkflowStage",
    default: null
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

ActivitySchema.set("toJSON", { virtuals: true })
ActivitySchema.set("toObject", { virtuals: true })


module.exports = mongoose.model("Activity", ActivitySchema)
