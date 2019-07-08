const cuid = require("cuid")

const Org = require("../../models/organization")

module.exports = {
  /**
   * @api {GET} /widget/openings/:apikey Get all openings for an organization by widget api key
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
      return res.json({ error: false, openings: org._openings })
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
  * @api {GET} /widget/organization/apikey Get the widget Api Key for your organization
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
  * @api {PUT} /widget/organization/apikey Regenerate the widget Api Key for your organization
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
      await org.save()
      return res.json({ error: false, apiKey: org.widgetApiKey })
    } catch (err) {
      return res.json({ error: true, reason: err.message })
    }
  },

  /**
  * @api {GET} /widget/organization/code Get embeddable/shareable script code for your organization
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

}
