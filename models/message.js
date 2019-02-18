const mongoose = require("mongoose")

const MessageSchema = new mongoose.Schema({

  _organization: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Organization"
  },

})

MessageSchema.set("toJSON", { virtuals: true })
MessageSchema.set("toObject", { virtuals: true })


module.exports = mongoose.model("Message", MessageSchema)
