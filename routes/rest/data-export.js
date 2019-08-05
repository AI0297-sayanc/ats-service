const jwt = require("jsonwebtoken")
const moment = require("moment")
const jsonexport = require("jsonexport")
const { promisify } = require("util")

const jsonExport = promisify(jsonexport)

const Opening = require("../../models/opening")
const Candidate = require("../../models/candidate")

module.exports = {
  /**
  * Bulk export a list of openings as CSV file
  * @api {get} /export/openings/ 2.0. Bulk export openings as CSV file
  * @apiName exportOpenings
  * @apiGroup ExportImport
  * @apiPermission User
  *
  * @apiParam  {String} token `URL Param` The Auth JWT Token in format "Bearer xxxx.yyyy.zzzz"
  * */
  async openings(req, res) {
    try {
      const user = jwt.verify(req.params.token, process.env.SECRET)
      const openings = await Opening.find({ _organization: user._organization }).populate("_createdBy _skillsRequired _tags").exec()
      const csvString = await jsonExport(openings.map(opening => ({
        title: opening.title,
        description: opening.description,
        locations: opening.locations,
        noOfOpenings: opening.noOfOpenings,
        isActive: opening.isActive,
        isRemoteAllowed: opening.isRemoteAllowed,
        positionType: opening.positionType,
        jobFunction: opening.jobFunction,
        minExpRequired: opening.minExpRequired,
        maxExpRequired: opening.maxExpRequired,
        minCompensation: opening.minCompensation,
        maxCompensation: opening.maxCompensation,
        hideCompensationDetails: opening.hideCompensationDetails,
        minEducationalQualification: opening.minEducationalQualification,
        jobLevel: opening.jobLevel,
        jobCode: opening.jobCode,
        skills: opening._skillsRequired.map(s => s.text),
        tags: opening._tags.map(t => t.text),
        createdBy: (opening._createdBy) ? opening._createdBy.name.full : "N/A"
      })), { arrayPathString: "|" })

      res.set("Content-Disposition", "attachment;filename=openings.csv")
      res.set("Content-Type", "text/csv")
      return res.send(csvString)
    } catch (err) {
      return res.status(500).json({ error: true, reason: err.message })
    }
  },

  /**
  * Bulk export a list of candidates as CSV file
  * @api {get} /export/candidates 2.1. Bulk export candidates for a particular opening as CSV file
  * @apiName exportCandidates
  * @apiGroup ExportImport
  * @apiPermission User
  *
  * @apiParam  {String} token `URL Param` The Auth JWT Token in format "Bearer xxxx.yyyy.zzzz"
  * @apiParam  {String} openingid `URL Param` _id of the opening to export candidates from
  * */
  async candidates(req, res) {
    const { token, openingid } = req.params
    // if (req.body.openingId === undefined) return res.status(400).json({ error: true, reason: "Missing mandatory field 'openingId'" })
    try {
      const user = jwt.verify(token, process.env.SECRET)
      const candidates = await Candidate.find({ _opening: openingid, _organization: user._organization }).populate("_createdBy _skills _tags").exec()
      const csvString = await jsonExport(candidates.map(candidate => ({
        name: candidate.name,
        email: candidate.email,
        altEmail: candidate.altEmail,
        phone: candidate.phone,
        cvLink: candidate.cvLink,
        currentEmployer: candidate.currentEmployer,
        currentPosition: candidate.currentPosition,
        currentSalary: candidate.currentSalary,
        currentLocation: candidate.currentLocation,
        noticePeriod: candidate.noticePeriod,
        availableFrom: moment(candidate.availableFrom).format("llll"),
        yearsOfExperience: candidate.yearsOfExperience,
        highestEducationalQualification: candidate.highestEducationalQualification,
        experienceSummary: candidate.experienceSummary,
        portfolio: candidate.portfolio,
        source: candidate.source,
        expectedSalary: candidate.expectedSalary,
        decisionStatus: candidate.decisionStatus,
        rejectedAt: candidate.rejectedAt ? moment(candidate.rejectedAt).format("llll") : "N/A",
        rejectionReason: candidate.rejectionReason || "N/A",
        acceptedAt: candidate.acceptedAt ? moment(candidate.acceptedAt).format("llll") : "N/A",
        skills: candidate._skills.map(s => s.text),
        tags: candidate._tags.map(s => s.text),
        createdBy: (candidate._createdBy) ? candidate._createdBy.name.full : "N/A"
      })), { arrayPathString: "|" })

      res.set("Content-Disposition", `attachment;filename=candidates-${openingid}.csv`)
      res.set("Content-Type", "text/csv")
      return res.send(csvString)
    } catch (err) {
      return res.status(500).json({ error: true, reason: err.message })
    }
  }
}
