const mongoose = require("mongoose")

const Tag = require("./index")

const OpeningTagSchema = new mongoose.Schema({

  _opening: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Opening"
  }

})

OpeningTagSchema.set("toJSON", { virtuals: true })
OpeningTagSchema.set("toObject", { virtuals: true })


module.exports = Tag.discriminator("OpeningTag", OpeningTagSchema)
