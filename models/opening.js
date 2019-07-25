const mongoose = require("mongoose")
const cuid = require("cuid")

const OpeningSchema = new mongoose.Schema({

  title: {
    type: String,
    required: true
  },

  description: String,

  locations: [String],

  noOfOpenings: {
    type: Number,
    min: 1,
    default: 1
  },

  isActive: {
    type: Boolean,
    default: true
  },

  allowDirectApplication: {
    type: Boolean,
    default: true
  },

  isRemoteAllowed: {
    type: Boolean,
    default: false
  },

  positionType: {
    type: String,
    enum: ["fulltime", "contract", "freelance", "internship"],
    default: "fulltime"
  },

  jobFunction: {
    type: String,
    enum: ["HR", "Marketing", "IT", "Finance"]
  },

  minExpRequired: {
    type: Number,
    min: 0
  },

  maxExpRequired: {
    type: Number,
    min: 0,
    validate: {
      validator(v) {
        return this.minExpRequired <= v
      },
      message: "Max Experience Required cannot be less than Min Experience Required!"
    }
  },

  minCompensation: {
    type: Number,
    min: 0
  },

  maxCompensation: {
    type: Number,
    min: 0,
    validate: {
      validator(v) {
        return this.minCompensation <= v
      },
      message: "Max Compensation cannot be less than Min Compensation!"
    }
  },

  hideCompensationDetails: {
    type: Boolean,
    default: false
  },

  minEducationalQualification: String,

  jobLevel: {
    type: String,
    enum: ["Entry", "Associate", "Middle", "Senior", "Director & Above"]
  },

  jobCode: {
    type: String,
    default: cuid.slug,
    unique: true
  },

  _skillsRequired: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Tag"
  }],

  _tags: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Tag"
  }],

  _workflowStages: [{ // in desired order
    type: mongoose.Schema.Types.ObjectId,
    ref: "WorkflowStage"
  }],

  _organization: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Organization",
    required: true
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

// eslint-disable-next-line prefer-arrow-callback
// OpeningSchema.virtual("_workflowStages", {
//   ref: "WorkflowStage", // The model to use
//   localField: "_id", // Find people where `localField`
//   foreignField: "_opening", // is equal to `foreignField` (will it work with an array????)
//   justOne: false
// })

OpeningSchema.pre("save", function (next) {
  this.lastModifiedAt = Date.now()
  return next()
})

OpeningSchema.set("toJSON", { virtuals: true })
OpeningSchema.set("toObject", { virtuals: true })


module.exports = mongoose.model("Opening", OpeningSchema)
