
const Opening = require("../../models/opening.js")
const Tag = require("../../models/tag")

module.exports = {

  /**
   * Fetch all the Openings
   * @api {get} /openings 1.0 Fetch all the Openings
   * @apiName fetchOpenings
   * @apiGroup Opening
   * @apiPermission Public
   *
   * @apiHeader {String} Authorization The JWT Token in format "Bearer xxxx.yyyy.zzzz"
   *
   * @apiSuccessExample {type} Success-Response: 200 OK
   * {
   *     error : false,
   *     openings: [{}]
   * }
   */
  async find(req, res) {
    try {
      const openings = await Opening.find({ _organization: req.user._organization }).populate("_createdBy _skillsRequired").exec()
      return res.json({ error: false, openings })
    } catch (err) {
      return res.status(500).json({ error: true, reason: err.message })
    }
  },

  /**
   * Find a Opening by _id
   * @api {get} /opening/:id 2.0 Find a Opening by _id
   * @apiName getOpening
   * @apiGroup Opening
   * @apiPermission Public
   *
   * @apiHeader {String} Authorization The JWT Token in format "Bearer xxxx.yyyy.zzzz"
   *
   * @apiParam {String} id `URL Param` The _id of the Opening to find
   *
   * @apiSuccessExample {type} Success-Response: 200 OK
   * {
   *     error : false,
   *     opening: {}
   * }
   */
  async get(req, res) {
    try {
      const opening = await Opening.findOne({ _id: req.params.id, _organization: req.user._organization }).populate("_createdBy _skillsRequired").exec()
      return res.json({ error: false, opening })
    } catch (err) {
      return res.status(500).json({ error: true, reason: err.message })
    }
  },

  /**
   * Create a new Opening
   * @api {post} /opening 3.0 Create a new Opening
   * @apiName createOpening
   * @apiGroup Opening
   * @apiPermission Public
   *
   * @apiHeader {String} Authorization The JWT Token in format "Bearer xxxx.yyyy.zzzz"
   *
   * @apiParam  {String} title Opening title
   * @apiParam  {String[]} [locations] Opening locations
   * @apiParam  {Number} [noOfOpenings=1] Opening noOfOpenings
   * @apiParam  {Boolean} [isActive=true] Opening isActive
   * @apiParam  {Boolean} [isRemoteAllowed=false] Opening isRemoteAllowed
   * @apiParam  {String} [positionType=fulltime] Opening positionType `enum=["fulltime", "contract", "freelance", "internship"]`
   * @apiParam  {String} [jobFunction] Opening jobFunction `enum=["HR", "Marketing", "IT", "Finance"]`
   * @apiParam  {String[]} [skillsRequired] Array of skills required
   * @apiParam  {Number} [minExpRequired] Opening minExpRequired
   * @apiParam  {Number} [maxExpRequired] Opening maxExpRequired
   * @apiParam  {Number} [minCompensation] Opening minCompensation
   * @apiParam  {Number} [maxCompensation] Opening maxCompensation
   * @apiParam  {Boolean} [hideCompensationDetails=false] Opening hideCompensationDetails
   * @apiParam  {String} [minEducationalQualification] Opening minEducationalQualification
   * @apiParam  {String} [jobLevel] Opening jobLevel `enum=["Entry", "Associate", "Middle", "Senior", "Director & Above"]`
   * @apiParam  {String} [jobCode] Opening jobCode
   * @apiParam  {String} [decisionStatus=pending] Opening decisionStatus `enum=["pending", "rejected", "accepted"]`
   * @apiParam  {String} [rejectionReason] Opening rejectionReason
   *
   * @apiSuccessExample {type} Success-Response: 200 OK
   * {
   *     error : false,
   *     opening: {}
   * }
   */
  async post(req, res) {
    try {
      const {
        title, locations, noOfOpenings, isActive, isRemoteAllowed, positionType, jobFunction, minExpRequired, maxExpRequired, minCompensation, maxCompensation, hideCompensationDetails, minEducationalQualification, jobLevel, jobCode, decisionStatus, rejectionReason, skillsRequired
      } = req.body
      if (title === undefined) return res.status(400).json({ error: true, reason: "Missing manadatory field 'title'" })
      const _skillsRequired = await Tag.batchUpsert("skill", skillsRequired)
      const opening = await Opening.create({
        title, locations, noOfOpenings, isActive, isRemoteAllowed, positionType, jobFunction, minExpRequired, maxExpRequired, minCompensation, maxCompensation, hideCompensationDetails, minEducationalQualification, jobLevel, jobCode, decisionStatus, rejectionReason, _skillsRequired, _organization: req.user._organization, _createdBy: req.user._id
      })
      return res.json({ error: false, opening })
    } catch (err) {
      return res.status(500).json({ error: true, reason: err.message })
    }
  },

  /**
   * Edit a Opening by _id
   * @api {put} /opening/:id 4.0 Edit a Opening by _id
   * @apiName editOpening
   * @apiGroup Opening
   * @apiPermission Public
   *
   * @apiHeader {String} Authorization The JWT Token in format "Bearer xxxx.yyyy.zzzz"
   *
   * @apiParam {String} id `URL Param` The _id of the Opening to edit

   * @apiParam  {String[]} [locations] Opening locations
   * @apiParam  {Number} [noOfOpenings=1] Opening noOfOpenings
   * @apiParam  {Boolean} [isActive=true] Opening isActive
   * @apiParam  {Boolean} [isRemoteAllowed=false] Opening isRemoteAllowed
   * @apiParam  {String} [positionType=fulltime] Opening positionType `enum=["fulltime", "contract", "freelance", "internship"]`
   * @apiParam  {String} [jobFunction] Opening jobFunction `enum=["HR", "Marketing", "IT", "Finance"]`
   * @apiParam  {String[]} [skillsRequired] Array of skills required
   * @apiParam  {Number} [minExpRequired] Opening minExpRequired
   * @apiParam  {Number} [maxExpRequired] Opening maxExpRequired
   * @apiParam  {Number} [minCompensation] Opening minCompensation
   * @apiParam  {Number} [maxCompensation] Opening maxCompensation
   * @apiParam  {Boolean} [hideCompensationDetails=false] Opening hideCompensationDetails
   * @apiParam  {String} [minEducationalQualification] Opening minEducationalQualification
   * @apiParam  {String} [jobLevel] Opening jobLevel `enum=["Entry", "Associate", "Middle", "Senior", "Director & Above"]`
   * @apiParam  {String} [jobCode] Opening jobCode
   * @apiParam  {String} [decisionStatus=pending] Opening decisionStatus `enum=["pending", "rejected", "accepted"]`
   * @apiParam  {String} [rejectionReason] Opening rejectionReason
   *
   * @apiSuccessExample {type} Success-Response: 200 OK
   * {
   *     error : false,
   *     opening: {}
   * }
   */
  async put(req, res) {
    try {
      const {
        title, locations, noOfOpenings, isActive, isRemoteAllowed, positionType, jobFunction, minExpRequired, maxExpRequired, minCompensation, maxCompensation, hideCompensationDetails, minEducationalQualification, jobLevel, jobCode, decisionStatus, rejectionReason, skillsRequired
      } = req.body
      const opening = await Opening.findOne({ _id: req.params.id }).exec()
      if (opening === null) return res.status(400).json({ error: true, reason: "No such Opening!" })
      if (String(opening._organization) !== String(req.use._organization)) return res.status(403).json({ error: true, reason: "Not your Opening!" })

      if (title !== undefined) opening.title = title
      if (locations !== undefined) opening.locations = locations
      if (noOfOpenings !== undefined) opening.noOfOpenings = noOfOpenings
      if (isActive !== undefined) opening.isActive = isActive
      if (isRemoteAllowed !== undefined) opening.isRemoteAllowed = isRemoteAllowed
      if (positionType !== undefined) opening.positionType = positionType
      if (jobFunction !== undefined) opening.jobFunction = jobFunction
      if (minExpRequired !== undefined) opening.minExpRequired = minExpRequired
      if (maxExpRequired !== undefined) opening.maxExpRequired = maxExpRequired
      if (minCompensation !== undefined) opening.minCompensation = minCompensation
      if (maxCompensation !== undefined) opening.maxCompensation = maxCompensation
      if (hideCompensationDetails !== undefined) opening.hideCompensationDetails = hideCompensationDetails
      if (minEducationalQualification !== undefined) opening.minEducationalQualification = minEducationalQualification
      if (jobLevel !== undefined) opening.jobLevel = jobLevel
      if (jobCode !== undefined) opening.jobCode = jobCode
      if (decisionStatus !== undefined) opening.decisionStatus = decisionStatus
      if (rejectionReason !== undefined) opening.rejectionReason = rejectionReason
      if (skillsRequired !== undefined && Array.isArray(skillsRequired)) {
        opening._skillsRequired = await Tag.batchUpsert("skill", skillsRequired)
      }

      await opening.save()
      return res.json({ error: false, opening })
    } catch (err) {
      return res.status(500).json({ error: true, reason: err.message })
    }
  },

  /**
   * Delete a Opening by _id
   * @api {delete} /opening/:id 4.0 Delete a Opening by _id
   * @apiName deleteOpening
   * @apiGroup Opening
   * @apiPermission Public
   *
   * @apiHeader {String} Authorization The JWT Token in format "Bearer xxxx.yyyy.zzzz"
   *
   * @apiParam {String} id `URL Param` The _id of the Opening to delete
   *
   * @apiSuccessExample {type} Success-Response:
   * {
   *     error : false,
   * }
   */
  async delete(req, res) {
    try {
      await Opening.deleteOne({ _id: req.params.id, _organization: req.user._organization })
      return res.json({ error: false })
    } catch (err) {
      return res.status(500).json({ error: true, reason: err.message })
    }
  }

}
