const mongoose = require("mongoose")

const EventSchema = new mongoose.Schema({

  title: {
    type: String,
    required: true
  },
  description: String,
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

  _organization: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Organization"
  },

})

EventSchema.set("toJSON", { virtuals: true })
EventSchema.set("toObject", { virtuals: true })


module.exports = mongoose.model("Event", EventSchema)
