const mongoose = require("mongoose")

const WorkflowStageSchema = new mongoose.Schema({

  _opening: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Opening"
  },

  _organization: { // redundancy
    type: mongoose.Schema.Types.ObjectId,
    ref: "Organization"
  },

  text: {
    type: String,
    required: true
  },

  type: {
    type: String,
    enum: ["intro", "interview", "phone"]
  },

  sortOrder: {
    type: Number,
    min: 0
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
WorkflowStageSchema.pre("save", async function (next) {
  if (this.isNew) {
    const existing = await mongoose.model("WorkflowStageSchema")
      .find({ _opening: this._opening })
      .lean()
      .exec()
    if (this.sortOrder !== undefined) { // if sortOrder is supplied, check uniqueness
      if (existing.find(w => Number(w.sortOrder) === Number(this.sortOrder)) !== undefined) return next(new Error(`Sort Order ${this.sortOrder} already exists for given Opening!`))
    } else { // auto increment sortOrder
      this.sortOrder = existing.length + 1
    }
  }
  return next()
})

WorkflowStageSchema.set("toJSON", { virtuals: true })
WorkflowStageSchema.set("toObject", { virtuals: true })


module.exports = mongoose.model("WorkflowStage", WorkflowStageSchema)
