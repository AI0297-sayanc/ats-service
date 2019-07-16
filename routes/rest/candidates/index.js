const Candidate = require("../../../models/candidate")
const Tag = require("../../../models/tag")

module.exports = {

  /**
   * Fetch all the Candidates
   * @api {get} /candidates 1.0 Fetch all the Candidates
   * @apiName fetchCandidates
   * @apiGroup Candidate
   * @apiPermission User
   *
   * @apiHeader {String} Authorization The JWT Token in format "Bearer xxxx.yyyy.zzzz"
   *
   * @apiSuccessExample {type} Success-Response: 200 OK
   * {
   *     error : false,
   *     candidates: [{}]
   * }
   */
  async find(req, res) {
    try {
      const candidates = await Candidate.find({ _organization: req.user._organization }).exec()
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
      const candidate = await Candidate.findOne({ _id: req.params.id, _organization: req.user._organization }).exec()
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
        name, email, altEmail, phone, cvLink, currentEmployer, currentPosition, currentSalary, currentLocation, noticePeriod, availableFrom, yearsOfExperience, highestEducationalQualification, experienceSummary, portfolio, source, expectedSalary, skills, openingId
      } = req.body
      if (openingId === undefined) return res.status(400).json({ error: true, reason: "Missing manadatory field 'openingId'" })
      if (name === undefined) return res.status(400).json({ error: true, reason: "Missing manadatory field 'name'" })
      if (name.first === undefined) return res.status(400).json({ error: true, reason: "Missing manadatory field 'name.first'" })
      if (name.last === undefined) return res.status(400).json({ error: true, reason: "Missing manadatory field 'name.last'" })
      if (email === undefined) return res.status(400).json({ error: true, reason: "Missing manadatory field 'email'" })
      if (phone === undefined) return res.status(400).json({ error: true, reason: "Missing manadatory field 'phone'" })
      const _skills = await Tag.batchUpsert("skill", skills)
      const candidate = await Candidate.create({
        name, email, altEmail, phone, cvLink, currentEmployer, currentPosition, currentSalary, currentLocation, noticePeriod, availableFrom, yearsOfExperience, highestEducationalQualification, experienceSummary, portfolio, source, expectedSalary, _skills, _organization: req.user._organization, _opening: openingId, _createdBy: req.user._id
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
        name, email, altEmail, phone, cvLink, currentEmployer, currentPosition, currentSalary, currentLocation, noticePeriod, availableFrom, yearsOfExperience, highestEducationalQualification, experienceSummary, portfolio, source, expectedSalary, skills
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
      if (skills !== undefined && Array.isArray(skills)) {
        candidate._skills = await Tag.batchUpsert("skill", skills)
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
  }

}
