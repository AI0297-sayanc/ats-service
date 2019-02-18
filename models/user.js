const mongoose = require("mongoose")

const UserSchema = new mongoose.Schema({

  _organization: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Organization"
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

UserSchema.set("toJSON", { virtuals: true })
UserSchema.set("toObject", { virtuals: true })


module.exports = mongoose.model("User", UserSchema)
