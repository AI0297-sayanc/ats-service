const request = require("request")
const jwt = require("jsonwebtoken")

const Candidate = require("../../../models/candidate")
const Tag = require("../../../models/tag")
const Opening = require("../../../models/opening")

module.exports = {

  /**
   * Fetch all the Candidates
   * @api {post} /candidates 1.0 Fetch all the Candidates
   * @apiName fetchCandidates
   * @apiGroup Candidate
   * @apiPermission User
   *
   * @apiHeader {String} Authorization The JWT Token in format "Bearer xxxx.yyyy.zzzz"
   *
   * @apiParam  {String}  [openingId] Optionally filter by Opening
   * @apiParam  {String}  [email] Optionally filter by email/altEmail (N.B.: email/phone filtering is OR based)
   * @apiParam  {String}  [phone] Optionally filter by phone (N.B.: email/phone filtering is OR based)
   *
   * @apiSuccessExample {type} Success-Response: 200 OK
   * {
   *     error : false,
   *     candidates: [{}]
   * }
   */
  async find(req, res) {
    const { openingId, email, phone } = req.body
    const queryObj = { _organization: req.user._organization }
    if (openingId !== undefined) queryObj._opening = openingId
    const orClauses = []
    if (email !== undefined) {
      orClauses.push({ email: email.toLowerCase() })
      orClauses.push({ altEmail: email.toLowerCase() })
    }
    if (phone !== undefined) {
      orClauses.push({
        phone: new RegExp(phone)
      })
    }
    if (orClauses.length > 0) {
      queryObj.$or = orClauses
    }
    try {
      const candidates = await Candidate
        .find(queryObj)
        .populate("_skills _tags _currentWorkflowStage _organization _createdBy")
        .populate({
          path: "_opening",
          populate: {
            path: "_workflowStages"
          }
        })
        .exec()
      return res.json({ error: false, candidates })
    } catch (err) {
      return res.status(500).json({ error: true, reason: err.message })
    }
  },

  /**
   * Find a Candidate by _id
   * @api {get} /candidate/:id 2.0 Find a Candidate by _id
   * @apiName getCandidate
   * @apiGroup Candidate
   * @apiPermission User
   *
   * @apiHeader {String} Authorization The JWT Token in format "Bearer xxxx.yyyy.zzzz"
   *
   * @apiParam {String} id `URL Param` The _id of the Candidate to find
   *
   * @apiSuccessExample {type} Success-Response: 200 OK
   * {
   *     error : false,
   *     candidate: {}
   * }
   */
  async get(req, res) {
    try {
      const candidate = await Candidate
        .findOne({ _id: req.params.id, _organization: req.user._organization })
        .populate("_skills _tags _currentWorkflowStage _organization _createdBy")
        .populate({
          path: "_opening",
          populate: {
            path: "_workflowStages"
          }
        })
        .exec()
      if (candidate === null) throw new Error("You don't have any such candidate")
      return res.json({ error: false, candidate })
    } catch (err) {
      return res.status(500).json({ error: true, reason: err.message })
    }
  },

  /**
   * Create a new Candidate
   * @api {post} /candidate 3.0 Create a new Candidate
   * @apiName createCandidate
   * @apiGroup Candidate
   * @apiPermission User
   *
   * @apiHeader {String} Authorization The JWT Token in format "Bearer xxxx.yyyy.zzzz"
   *
   * @apiParam  {Object} name Candidate name
   * @apiParam  {String} name.first Candidate name.first
   * @apiParam  {String} name.last Candidate name.last
   * @apiParam  {String} email Candidate email
   * @apiParam  {String} phone Candidate phone
   * @apiParam  {String} openingId _id of the opening to create candidate for
   * @apiParam  {String} [name.middle] Candidate name.middle
   * @apiParam  {String} [altEmail] Candidate altEmail
   * @apiParam  {String} [cvLink] Candidate cvLink
   * @apiParam  {String} [currentEmployer] Candidate currentEmployer
   * @apiParam  {String} [currentPosition] Candidate currentPosition
   * @apiParam  {String} [currentSalary] Candidate currentSalary
   * @apiParam  {String} [currentLocation] Candidate currentLocation
   * @apiParam  {String} [noticePeriod] Candidate noticePeriod
   * @apiParam  {Date} [availableFrom] Candidate availableFrom
   * @apiParam  {Number} [yearsOfExperience=0] Candidate yearsOfExperience
   * @apiParam  {String} [highestEducationalQualification] Candidate highestEducationalQualification
   * @apiParam  {String} [experienceSummary] Candidate experienceSummary
   * @apiParam  {String} [portfolio] Candidate portfolio
   * @apiParam  {String} [source] Candidate source
   * @apiParam  {String} [expectedSalary] Candidate expectedSalary
   * @apiParam  {String[]} [skills] Array of skills
   * @apiParam  {String[]} [tags] Array of candidate tags
   *
   * @apiSuccessExample {type} Success-Response: 200 OK
   * {
   *     error : false,
   *     candidate: {}
   * }
   */
  async post(req, res) {
    try {
      const {
        name, email, altEmail, phone, cvLink, currentEmployer, currentPosition, currentSalary, currentLocation, noticePeriod, availableFrom, yearsOfExperience, highestEducationalQualification, experienceSummary, portfolio, source, expectedSalary, skills, tags, openingId
      } = req.body
      if (openingId === undefined) return res.status(400).json({ error: true, reason: "Missing manadatory field 'openingId'" })

      const opening = await Opening.findOne({ _id: openingId, _organization: req.user._organization }).select("isActive").lean().exec()
      if (opening === null) throw new Error("You don't have any such opening!")
      if (opening.isActive !== true) throw new Error("Opening is not active!")

      if (name === undefined) return res.status(400).json({ error: true, reason: "Missing manadatory field 'name'" })
      if (name.first === undefined) return res.status(400).json({ error: true, reason: "Missing manadatory field 'name.first'" })
      if (name.last === undefined) return res.status(400).json({ error: true, reason: "Missing manadatory field 'name.last'" })
      if (email === undefined) return res.status(400).json({ error: true, reason: "Missing manadatory field 'email'" })
      if (phone === undefined) return res.status(400).json({ error: true, reason: "Missing manadatory field 'phone'" })
      const [_skills, _tags] = await Promise.all([
        Tag.batchUpsert("skill", skills),
        Tag.batchUpsert("candidate", tags)
      ])
      const candidate = await Candidate.create({
        name, email, altEmail, phone, cvLink, currentEmployer, currentPosition, currentSalary, currentLocation, noticePeriod, availableFrom, yearsOfExperience, highestEducationalQualification, experienceSummary, portfolio, source, expectedSalary, _skills, _tags, _organization: req.user._organization, _opening: openingId, _createdBy: req.user._id
      })
      return res.json({ error: false, candidate })
    } catch (err) {
      return res.status(500).json({ error: true, reason: err.message })
    }
  },

  /**
   * Edit a Candidate by _id
   * @api {put} /candidate/:id 4.0 Edit a Candidate by _id
   * @apiName editCandidate
   * @apiGroup Candidate
   * @apiPermission User
   *
   * @apiHeader {String} Authorization The JWT Token in format "Bearer xxxx.yyyy.zzzz"
   *
   * @apiParam {String} id `URL Param` The _id of the Candidate to edit

   * @apiParam  {String} [name.middle] Candidate name.middle
   * @apiParam  {String} [altEmail] Candidate altEmail
   * @apiParam  {String} [cvLink] Candidate cvLink
   * @apiParam  {String} [currentEmployer] Candidate currentEmployer
   * @apiParam  {String} [currentPosition] Candidate currentPosition
   * @apiParam  {String} [currentSalary] Candidate currentSalary
   * @apiParam  {String} [currentLocation] Candidate currentLocation
   * @apiParam  {String} [noticePeriod] Candidate noticePeriod
   * @apiParam  {Date} [availableFrom] Candidate availableFrom
   * @apiParam  {Number} [yearsOfExperience=0] Candidate yearsOfExperience
   * @apiParam  {String} [highestEducationalQualification] Candidate highestEducationalQualification
   * @apiParam  {String} [experienceSummary] Candidate experienceSummary
   * @apiParam  {String} [portfolio] Candidate portfolio
   * @apiParam  {String} [source] Candidate source
   * @apiParam  {String} [expectedSalary] Candidate expectedSalary
   * @apiParam  {String[]} [skills] Array of skills
   * @apiParam  {String[]} [tags] Array of candidate tags
   *
   * @apiSuccessExample {type} Success-Response: 200 OK
   * {
   *     error : false,
   *     candidate: {}
   * }
   */
  async put(req, res) {
    try {
      const {
        name, email, altEmail, phone, cvLink, currentEmployer, currentPosition, currentSalary, currentLocation, noticePeriod, availableFrom, yearsOfExperience, highestEducationalQualification, experienceSummary, portfolio, source, expectedSalary, skills, tags
      } = req.body
      const candidate = await Candidate.findOne({ _id: req.params.id, _organization: req.user._organization }).exec()
      if (candidate === null) return res.status(400).json({ error: true, reason: "You don't have any such candidate!" })

      if (name !== undefined && name.first !== undefined) candidate.name.first = name.first
      if (name !== undefined && name.middle !== undefined) candidate.name.middle = name.middle
      if (name !== undefined && name.last !== undefined) candidate.name.last = name.last
      if (email !== undefined) candidate.email = email
      if (altEmail !== undefined) candidate.altEmail = altEmail
      if (phone !== undefined) candidate.phone = phone
      if (cvLink !== undefined) candidate.cvLink = cvLink
      if (currentEmployer !== undefined) candidate.currentEmployer = currentEmployer
      if (currentPosition !== undefined) candidate.currentPosition = currentPosition
      if (currentSalary !== undefined) candidate.currentSalary = currentSalary
      if (currentLocation !== undefined) candidate.currentLocation = currentLocation
      if (noticePeriod !== undefined) candidate.noticePeriod = noticePeriod
      if (availableFrom !== undefined) candidate.availableFrom = availableFrom
      if (yearsOfExperience !== undefined) candidate.yearsOfExperience = yearsOfExperience
      if (highestEducationalQualification !== undefined) candidate.highestEducationalQualification = highestEducationalQualification
      if (experienceSummary !== undefined) candidate.experienceSummary = experienceSummary
      if (portfolio !== undefined) candidate.portfolio = portfolio
      if (source !== undefined) candidate.source = source
      if (expectedSalary !== undefined) candidate.expectedSalary = expectedSalary
      if (Array.isArray(skills)) {
        candidate._skills = await Tag.batchUpsert("skill", skills)
      }
      if (Array.isArray(tags)) {
        candidate._tags = await Tag.batchUpsert("candidate", tags)
      }

      candidate.lastModifiedAt = Date.now()

      await candidate.save()
      return res.json({ error: false, candidate })
    } catch (err) {
      return res.status(500).json({ error: true, reason: err.message })
    }
  },

  /**
   * Delete a Candidate by _id
   * @api {delete} /candidate/:id 5.0 Delete a Candidate by _id
   * @apiName deleteCandidate
   * @apiGroup Candidate
   * @apiPermission User
   *
   * @apiHeader {String} Authorization The JWT Token in format "Bearer xxxx.yyyy.zzzz"
   *
   * @apiParam {String} id `URL Param` The _id of the Candidate to delete
   *
   * @apiSuccessExample {type} Success-Response:
   * {
   *     error : false,
   * }
   */
  async delete(req, res) {
    try {
      await Candidate.deleteOne({ _id: req.params.id, _organization: req.user._organization }).exec()
      return res.json({ error: false })
    } catch (err) {
      return res.status(500).json({ error: true, reason: err.message })
    }
  },

  /**
   * Download a candidate's CV file
   * @api {GET} /downloadcv/:id/:token 7.0 Download a candidate's CV file
   * @apiName downloadCV
   * @apiGroup Candidate
   * @apiPermission User
   *
   * @apiParam {String} id `URL Param` The _id of the Candidate whose CV to download
   * @apiParam {String} token `URL Param` The Auth JWT Token in format "Bearer xxxx.yyyy.zzzz"
   */
  async downloadCV(req, res) {
    const { token, id } = req.params
    try {
      const user = jwt.verify(token, process.env.SECRET)
      const candidate = await Candidate.findOne({ _id: id, _organization: user._organization }).exec()
      if (candidate === null || candidate.cvLink === undefined) return res.status(404).send("NOT FOUND!!!")
      const ffullname = candidate.cvLink.replace(/\/$/, "").split("/").pop()
      const fext = ffullname.split(".").pop()
      const fname = candidate.name.full.replace(" ", "_")
      res.set("Content-Disposition", `attachment;filename=${fname}.${fext}`)
      request(candidate.cvLink).pipe(res)
      return "OK" // redundant; just to appease the linter!!
    } catch (err) {
      console.log("==> Download CV ERR: ", err);
      return res.status(500).send("NOT OK!!!")
    }
  }

}
