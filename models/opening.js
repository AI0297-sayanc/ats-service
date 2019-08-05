const mongoose = require("mongoose")
const cuid = require("cuid")
const tinyurl = require("tinyurl")

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

  allowDirectApplication: { // basically, whether public job
    type: Boolean,
    default: true
  },

  shareableText: { // set in hooks below
    type: String,
    default: null
  },
  shareableUrl: { // set in hooks below
    type: String,
    default: null
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
  if ((this.isNew || this.isModified("title")) && this.allowDirectApplication !== false) this.updateShareables = true // for usage in post hooks below
  return next()
})
// eslint-disable-next-line prefer-arrow-callback
OpeningSchema.post("save", async function (doc) {
  if (doc.updateShareables === true) {
    try {
      const shareableUrl = `${process.env.SHARE_OPENING_BASE_URL}/opening/${doc._id}`
      const [shortUrl, org] = await Promise.all([
        tinyurl.shorten(shareableUrl),
        mongoose.model("Organization").findOne({ _id: doc._organization }).select("title").exec()
      ])
      const shareableText = `Opening for ${doc.title} at ${org.title}: ${shortUrl}`
      await mongoose.model("Opening").updateOne({ _id: doc._id }, { shareableText, shareableUrl, lastModifiedAt: Date.now() }).exec()
    } catch (error) {
      console.log("==> ERR updating shareableText: ", error);
    }
  }
})

OpeningSchema.set("toJSON", { virtuals: true })
OpeningSchema.set("toObject", { virtuals: true })


module.exports = mongoose.model("Opening", OpeningSchema)
