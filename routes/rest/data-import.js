const csv = require("csvtojson")
const rmf = require("rmf")

const Opening = require("../../models/opening")
const Candidate = require("../../models/candidate")
const Tag = require("../../models/tag")


module.exports = {
  /**
   * Bulk import a list of openings from CSV file
   * @api {post} /import/openings 1.1. Bulk import a list of openings from CSV file
   * @apiName importOpenings
   * @apiGroup ExportImport
   * @apiPermission User
   *
   * @apiHeader {String} Authorization The JWT Token in format "Bearer xxxx.yyyy.zzzz"
   *
   * @apiParam  {BinaryFile} csv-file The CSV file to upload containing the Openings details. `N.B.:` It must have the *first row/line* as the headings, viz. `name.first,name.last,phone,email` title
   * */
  async openings(req, res) {
    // Validate uploaded file
    const {
      fieldname, originalname, encoding, mimetype, destination, filename, path, size
    } = req.file
    try {
      if (originalname.split(".").pop().toLowerCase() !== "csv") throw new Error("Extension of uploaded file must be csv!")
      if (!["text/plain", "text/x-csv", "application/vnd.ms-excel", "application/csv", "application/x-csv", "text/csv", "text/comma-separated-values", "text/x-comma-separated-values", "text/tab-separated-values"].includes(mimetype)) throw new Error(`Invalid mimetype ${mimetype} for uploaded file!`)

      const data = await csv({
        colParser: {
          skillsRequired(item) { return item.split("|").map(c => c.trim()) },
          tags(item) { return item.split("|").map(c => c.trim()) },
        }
      }).fromFile(path)

      const openings = await Promise.all([
        Opening.create(data.map(async el => ({
          ...el,
          _skillsRequired: await Tag.batchUpsert("skill", el.skillsRequired),
          _tags: await Tag.batchUpsert("opening", el.tags),
          _organization: req.user._organization,
          _createdBy: req.user._id,
          _workflowStages: []
        }))),
        rmf(path) // Del the uploaded file to save some server space
      ])

      return res.json({ error: false, openings })
    } catch (err) {
      await rmf(path)
      return res.status(500).json({ error: true, reason: err.message })
    }
  },

  /**
 * Bulk import a list of candidates for a particular Opening from CSV file
 * @api {post} /import/candidates 1.2. Bulk import a list of candidates for a particular Opening from CSV file
 * @apiName importCandidates
 * @apiGroup ExportImport
 * @apiPermission User
 *
 * @apiHeader {String} Authorization The JWT Token in format "Bearer xxxx.yyyy.zzzz"
 *
 * @apiParam  {String} openingId The _id of the Opening to add these customers to
 * @apiParam  {BinaryFile} csv-file The CSV file to upload containing the Candidates details. `N.B.:` It must have the *first row/line* as the headings, viz. `name.first,name.last,phone,email` title
 * */
  async candidates(req, res) {
    if (req.body.openingId === undefined) return res.status(400).json({ error: true, reason: "Missing mandatory field 'openingId'" })
    // Validate uploaded file
    const {
      fieldname, originalname, encoding, mimetype, destination, filename, path, size
    } = req.file
    try {
      if (originalname.split(".").pop().toLowerCase() !== "csv") throw new Error("Extension of uploaded file must be csv!")
      if (!["text/plain", "text/x-csv", "application/vnd.ms-excel", "application/csv", "application/x-csv", "text/csv", "text/comma-separated-values", "text/x-comma-separated-values", "text/tab-separated-values"].includes(mimetype)) throw new Error(`Invalid mimetype ${mimetype} for uploaded file!`)

      const data = await csv({
        colParser: {
          skills(item) { return item.split("|").map(c => c.trim()) }
        }
      }).fromFile(path)

      const candidates = await Promise.all([
        Candidate.create(data.map(async el => ({
          ...el,
          _skills: await Tag.batchUpsert("skill", el.skills),
          _opening: req.body.openingId,
          _organization: req.user._organization,
          _createdBy: req.user._id
        }))),
        rmf(path) // Del the uploaded file to save some server space
      ])

      return res.json({ error: false, candidates })
    } catch (err) {
      await rmf(path)
      return res.status(500).json({ error: true, reason: err.message })
    }
  },
}
