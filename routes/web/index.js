const express = require("express")
const router = express.Router()

const User = require("../../models/user")
const Opening = require("../../models/opening")

/* GET home page. */
router.get("/resetpassword/:token", async (req, res) => {
  try {
    const { token } = req.params
    const now = new Date()
    const user = await User
      .findOne({
        isActive: true,
        "forgotpassword.token": token,
        "forgotpassword.expiresAt": { $gte: now },
      })
      .select("email")
      .lean()
      .exec()
    if (user === null) throw new Error("INVALID OR EXPIRED LINK")
    return res.render("resetpassword", { handle: user.email, token })
  } catch (error) {
    return res.status(500).send(error.message)
  }
})

router.get("/opening/:openingid", async (req, res) => {
  try {
    const opening = await Opening.findOne({ _id: req.params.openingid }).populate("_organization").exec()
    if (opening === null || opening._organization === null) return res.status(404).send("Not Found!")
    return res.render("opening", { opening })
  } catch (err) {
    return res.status(500).send(err.message)
  }
})

module.exports = router
