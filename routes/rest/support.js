const mail = require("../../lib/mail")

const Org = require("../../models/organization")

module.exports = {
  /**
  * Send a support query to Recruitech
  * @api {post} /support 6.0 Send a support query to Recruitech
  * @apiName supportQuery
  * @apiGroup User
  * @apiPermission User
  *
  * @apiHeader {String} Authorization The JWT Token in format "Bearer xxxx.yyyy.zzzz"
  *
  * @apiParam  {String} topic Topic of support query
  * @apiParam  {String} message Body/message of support query
  */
  async supportQuery(req, res) {
    const { topic, message } = req.body
    if (topic === undefined || message === undefined) return res.status(400).json({ error: true, reason: "Fields topic & message are both mandatory!" })
    try {
      const org = await Org.findOne({ _id: req.user._organization }).exec()
      if (org === null) throw new Error("No such Organization!")
      console.log("=========", req.user);
      await mail("support-query", {
        to: process.env.PRODUCT_SUPPORT_EMAIL,
        subject: "[[Support Query]]",
        locals: {
          user: req.user,
          org,
          topic,
          message
        }
      })
      return res.json({ error: false })
    } catch (err) {
      return res.status(500).json({ error: true, reason: err.message })
    }
  }
}