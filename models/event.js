const mongoose = require("mongoose")
const moment = require("moment")
const ics = require("ics")

const mailer = require("../lib/mail")

const EventSchema = new mongoose.Schema({

  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  location: String,
  start: Date,
  end: Date,
  // duration: { hours: 6, minutes: 30 },
  url: String,
  geo: { lat: Number, lon: Number },
  categories: [String],
  status: String,
  organizer: { name: String, email: String },
  attendees: [
    { name: String, email: String }
  ],

  _candidate: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Candidate"
  },

  _createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  _organization: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Organization"
  },

  _opening: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Opening"
  },

  _workflowStage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "WorkflowStage"
  },

})

// eslint-disable-next-line prefer-arrow-callback
EventSchema.post("save", async function (doc) {
  try {
    const event = {
      start: moment.utc(doc.start).format("YYYY-M-D-H-m").split("-"),
      duration: { hours: moment.utc(doc.end).diff(moment.utc(doc.start), "hours") },
      title: doc.title,
      description: doc.description,
      location: doc.location,
      url: doc.url,
      geo: doc.geo,
      categories: doc.categories,
      status: doc.status || "CONFIRMED",
      organizer: doc.organizer,
      attendees: doc.attendees.map(a => ({ name: a.name, email: a.email }))
    }
    const { error, value } = ics.createEvent(event)
    if (error) throw error

    console.log(doc.organizer);

    mailer("interview-schedule", {
      to: [doc.organizer.email, ...doc.attendees.map(a => a.email).filter(a => a !== undefined)],
      subject: event.title,
      locals: { event },
      attachments: [
        {
          filename: "invite.ics",
          content: value
        }
      ]
    })
  } catch (error) {
    console.log("==> ERR sending interview invites:", error.message)
  }
})

EventSchema.set("toJSON", { virtuals: true })
EventSchema.set("toObject", { virtuals: true })


module.exports = mongoose.model("Event", EventSchema)
