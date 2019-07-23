const mongoose = require("mongoose")

const ActivitySchema = new mongoose.Schema({

  type: String,

  text: {
    type: String,
    required: true
  },

  _candidate: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Candidate",
    required: true
  },

  _opening: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Opening"
  },

  _organization: { // redundancy
    type: mongoose.Schema.Types.ObjectId,
    ref: "Organization"
  },

  _workflowStage: { // set to current workflow stage of _candidate in hooks below
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

// eslint-disable-next-line prefer-arrow-callback
ActivitySchema.pre("save", async function (next) {
  try {
    // eslint-disable-next-line newline-per-chained-call
    const candidate = await mongoose.model("Candidate").findOne({ _id: this._candidate }).select("_currentWorkflowStage").exec()
    if (candidate === null) throw new Error("No such candidate!")
    this._workflowStage = candidate._currentWorkflowStage
  } catch (err) {
    console.log("==> ERR in activity post save hook ", err);
  }
  return next()
})

ActivitySchema.set("toJSON", { virtuals: true })
ActivitySchema.set("toObject", { virtuals: true })


module.exports = mongoose.model("Activity", ActivitySchema)
