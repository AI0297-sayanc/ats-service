const Tag = require("../../models/tag.js")

module.exports = {

  /**
   * Fetch all the Tags of specified type
   * @api {get} /tags/:type 1.0 Fetch all the Tags (pan organization) of specified type
   * @apiName fetchTags
   * @apiGroup Tag
   * @apiPermission Public
   *
   * @apiHeader {String} Authorization The JWT Token in format "Bearer xxxx.yyyy.zzzz"
   *
   * @apiParam {String} id `type` The type of tag `enum["skill", "opening", "candidate"]`
   *
   * @apiSuccessExample {type} Success-Response: 200 OK
   * {
   *     error : false,
   *     users: [{}]
   * }
   */
  async find(req, res) {
    try {
      const tags = await Tag.find({ type: req.params.type }).exec()
      return res.json({ error: false, tags })
    } catch (err) {
      return res.status(500).json({ error: true, reason: err.message })
    }
  },

}
