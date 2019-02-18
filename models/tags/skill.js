const mongoose = require("mongoose")

const Tag = require("./index")

const SkillTagSchema = new mongoose.Schema({

  _candidate: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Candidate"
  }

})

SkillTagSchema.set("toJSON", { virtuals: true })
SkillTagSchema.set("toObject", { virtuals: true })


module.exports = Tag.discriminator("SkillTag", SkillTagSchema)
