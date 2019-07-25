const cuid = require("cuid")

const Org = require("../../models/organization")
const Opening = require("../../models/opening")
const Candidate = require("../../models/candidate")

const mailer = require("../../lib/mail")

module.exports = {
  /**
   * @api {GET} /widget/openings/:apikey 1.0 Get all openings (for which direct application is allowed) for an organization by widget api key
   * @apiName getOpenings
   * @apiGroup Widget
   * @apiPermission Public
   * @apiParam  {String} apikey Api key for the organization to find openings for `URL Param`
   * @apiSuccessExample {type} Success-Response: 200 OK
   * {
   *     error : false,
   *     openings: [{}]
   * }
   */
  async get(req, res) {
    try {
      const apiKey = req.params.apikey
      if (apiKey === undefined) return res.status(400).json({ error: true, reason: "Missing API Key!" })
      const org = await Org.findOne({ apiKey }).populate("_openings").exec()
      if (org === null) return res.status(400).json({ error: true, reason: "No Organization!" })
      return res.json({ error: false, openings: org._openings.filter(op => op.allowDirectApplication !== false) })
    } catch (err) {
      return res.json({ error: true, reason: err.message })
    }
  },

  // async post(req, res) {
  //   try {

  //   } catch (err) {

  //   }
  // },

  /**
  * @api {GET} /widget/organization/apikey 2.0. Get the widget Api Key for your organization
  * @apiName getApiKey
  * @apiGroup Widget
  * @apiPermission User
  * @apiSuccessExample {type} Success-Response: 200 OK
   * {
   *     error : false,
   *     apiKey: "cjxu21t3y00007ev20zqi63s6"
   * }
  */
  async getApiKey(req, res) {
    try {
      const org = await Org.findOne({ _id: req.user._organization }).select("apiKey").exec()
      if (org === null) return res.status(400).json({ error: true, reason: "No Organization!" })
      return res.json({ error: false, apiKey: org.widgetApiKey })
    } catch (err) {
      return res.json({ error: true, reason: err.message })
    }
  },

  /**
  * @api {PUT} /widget/organization/apikey 2.1. Regenerate the widget Api Key for your organization
  * @apiName regenerateApiKey
  * @apiGroup Widget
  * @apiPermission User
  * @apiSuccessExample {type} Success-Response: 200 OK
  * {
  *     error : false,
  *     apiKey: "cjxu21t3y00007ev20zqi63s6"
  * }
  */
  async put(req, res) {
    try {
      const org = await Org.findOne({ _id: req.user._organization }).select("apiKey").exec()
      if (org === null) return res.status(400).json({ error: true, reason: "No Organization!" })
      org.widgetApiKey = cuid()
      org.lastModifiedAt = Date.now()
      await org.save()
      return res.json({ error: false, apiKey: org.widgetApiKey })
    } catch (err) {
      return res.json({ error: true, reason: err.message })
    }
  },

  /**
  * @api {GET} /widget/organization/code 2.2. Get embeddable/shareable script code for your organization
  * @apiName getCode
  * @apiGroup Widget
  * @apiPermission User
  * @apiSuccessExample {type} Success-Response: 200 OK
  * {
  *     error : false,
  *     apiKey: "cjxu21t3y00007ev20zqi63s6",
  *     script: ""
  * }
  */
  async getWidgetCode(req, res) {
    try {
      const org = await Org.findOne({ _id: req.user._organization }).select("apiKey").exec()
      if (org === null) return res.status(400).json({ error: true, reason: "No Organization!" })
      const script = `<script type="text/javascript">(function(){var s=document,t=s.getElementsByTagName("head")[0],e=s.createElement("script");l=s.createElement("link");w=s.createElement("${process.env.WIDGET_CUSTOM_ELEMENT || "vue-widget"}");cs=s.currentScript;e.type="text/javascript";e.async=true;e.src="${process.env.WIDGET_SRC_URL}/js/app.js";l.rel="stylesheet";l.href="${process.env.WIDGET_SRC_URL}/css/app.css";w.setAttribute("api-key", "${org.widgetApiKey}");t.appendChild(l);t.appendChild(e);cs.parentNode.insertBefore(w,cs)})();</script>`
      return res.json({ error: false, apiKey: org.widgetApiKey, script })
    } catch (err) {
      return res.json({ error: true, reason: err.message })
    }
  },

  /**
    * Let a candidate apply for a job
    * @api {post} /applyforjob/:openingid 3.0. Let a candidate directly apply for a job
    * @apiName applyForJob
    * @apiGroup Widget
    * @apiPermission Public
    *
    * @apiParam  {String} openingid `URL Param` _id of opening to apply for
    * @apiParam  {Object} name Name of candidate applying
    * @apiParam  {String} name.first First Name of candidate applying
    * @apiParam  {String} [name.middle] Middle Name of candidate applying
    * @apiParam  {String} name.last Last Name of candidate applying
    * @apiParam  {String} email email of candidate applying
    * @apiParam  {String} phone phone of candidate applying
    * @apiParam  {String} cvLink URL to uploaded resume/cv file of candidate applying
    */
  async applyForJob(req, res) {
    const {
      name, email, phone, cvLink
    } = req.body
    if (name === undefined || name.first === undefined || name.last === undefined) return res.status(400).json({ error: true, reason: "Missing mandatory fields 'name' or 'name.first' or 'name.last'" })
    if (phone === undefined) return res.status(400).json({ error: true, reason: "Missing mandatory field 'phone'" })
    if (email === undefined) return res.status(400).json({ error: true, reason: "Missing mandatory field 'email'" })
    if (cvLink === undefined) return res.status(400).json({ error: true, reason: "Missing mandatory field 'cvLink'" })
    try {
      const opening = await Opening.findOne({ _id: req.params.openingid, allowDirectApplication: { $ne: false } }).populate("_organization _createdBy").exec()
      if (opening === null) throw new Error("No such opening for direct application!")
      const candidate = await Candidate.create({
        name, email, phone, cvLink, isDirectApplicant: true, _opening: opening._id, _organization: opening._organization._id
      })
      // send emails:
      await Promise.all([
        mailer("application-received-to-candidate", {
          to: [email],
          subject: "Your Application has been Submitted",
          locals: { candidate: name, position: opening.title, company: opening._organization.title }
        }),
        mailer("application-received-to-company", {
          to: [opening._createdBy.email],
          subject: "New candidate applied directly",
          locals: { candidate: name, position: opening.title, company: opening._organization.title }
        })
      ])
      return res.json({ error: false, candidate })
    } catch (err) {
      return res.json({ error: true, reason: err.message })
    }
  },
}
