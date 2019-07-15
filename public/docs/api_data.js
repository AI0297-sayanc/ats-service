define({ "api": [
  {
    "type": "POST",
    "url": "/forgotpassword",
    "title": "3. Start the change/forgot password workflow",
    "name": "ForgotPassword",
    "group": "Auth",
    "version": "1.0.0",
    "permission": [
      {
        "name": "Public"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "handle",
            "description": "<p>The email or phone for whom the password will be changed</p>"
          }
        ]
      }
    },
    "filename": "routes/rest/auth/password.js",
    "groupTitle": "Auth"
  },
  {
    "type": "POST",
    "url": "/login",
    "title": "2. Authenticate an user and get a JWT on success",
    "name": "Login",
    "group": "Auth",
    "version": "1.0.0",
    "permission": [
      {
        "name": "Public"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "handle",
            "description": "<p>User email/mobile to login with</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "password",
            "description": "<p>User password (plaintext)</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "expiry",
            "defaultValue": "720",
            "description": "<p>Life of the JWT in hours</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response: 200 OK",
          "content": "{\n     error: false,\n     isAdmin: false,\n     handle: 'foo@bar.com',\n     token: 'XXX.YYYYY.ZZZZZZZ'\n   }",
          "type": "JSON"
        }
      ]
    },
    "filename": "routes/rest/auth/index.js",
    "groupTitle": "Auth"
  },
  {
    "type": "post",
    "url": "/signup",
    "title": "1. User signup",
    "name": "signup",
    "group": "Auth",
    "permission": [
      {
        "name": "Public"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>User email</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "organization",
            "description": "<p>Organization Name</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "name",
            "description": "<p>User name</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "name.first",
            "description": "<p>User first name</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "name.last",
            "description": "<p>User last name</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "password",
            "description": "<p>User password (plaintext). If not specified, one will be randomly generated &amp; emailed</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "phone",
            "description": "<p>User phone</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "purpose",
            "description": "<p>Purpose</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "role",
            "description": "<p>User Role</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "website",
            "description": "<p>Website</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": true,
            "field": "location",
            "description": "<p>Location</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "location.city",
            "description": "<p>Location City</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "location.country",
            "description": "<p>Location Country</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response: 200 OK",
          "content": "{\n    error : false,\n    user: {}\n}",
          "type": "type"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/rest/auth/signup.js",
    "groupTitle": "Auth"
  },
  {
    "type": "post",
    "url": "/candidate",
    "title": "3.0 Create a new Candidate",
    "name": "createCandidate",
    "group": "Candidate",
    "permission": [
      {
        "name": "User"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>The JWT Token in format &quot;Bearer xxxx.yyyy.zzzz&quot;</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "name",
            "description": "<p>Candidate name</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "name.first",
            "description": "<p>Candidate name.first</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "name.last",
            "description": "<p>Candidate name.last</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>Candidate email</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "phone",
            "description": "<p>Candidate phone</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "openingId",
            "description": "<p>_id of the opening to create candidate for</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "name.middle",
            "description": "<p>Candidate name.middle</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "altEmail",
            "description": "<p>Candidate altEmail</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "cvLink",
            "description": "<p>Candidate cvLink</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "currentEmployer",
            "description": "<p>Candidate currentEmployer</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "currentPosition",
            "description": "<p>Candidate currentPosition</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "currentSalary",
            "description": "<p>Candidate currentSalary</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "currentLocation",
            "description": "<p>Candidate currentLocation</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "noticePeriod",
            "description": "<p>Candidate noticePeriod</p>"
          },
          {
            "group": "Parameter",
            "type": "Date",
            "optional": true,
            "field": "availableFrom",
            "description": "<p>Candidate availableFrom</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": true,
            "field": "yearsOfExperience",
            "defaultValue": "0",
            "description": "<p>Candidate yearsOfExperience</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "highestEducationalQualification",
            "description": "<p>Candidate highestEducationalQualification</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "experienceSummary",
            "description": "<p>Candidate experienceSummary</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "portfolio",
            "description": "<p>Candidate portfolio</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "source",
            "description": "<p>Candidate source</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "expectedSalary",
            "description": "<p>Candidate expectedSalary</p>"
          },
          {
            "group": "Parameter",
            "type": "String[]",
            "optional": true,
            "field": "skills",
            "description": "<p>Array of skills</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response: 200 OK",
          "content": "{\n    error : false,\n    candidate: {}\n}",
          "type": "type"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/rest/candidates.js",
    "groupTitle": "Candidate"
  },
  {
    "type": "delete",
    "url": "/candidate/:id",
    "title": "4.0 Delete a Candidate by _id",
    "name": "deleteCandidate",
    "group": "Candidate",
    "permission": [
      {
        "name": "User"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>The JWT Token in format &quot;Bearer xxxx.yyyy.zzzz&quot;</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p><code>URL Param</code> The _id of the Candidate to delete</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "{\n    error : false,\n}",
          "type": "type"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/rest/candidates.js",
    "groupTitle": "Candidate"
  },
  {
    "type": "put",
    "url": "/candidate/:id",
    "title": "4.0 Edit a Candidate by _id",
    "name": "editCandidate",
    "group": "Candidate",
    "permission": [
      {
        "name": "User"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>The JWT Token in format &quot;Bearer xxxx.yyyy.zzzz&quot;</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p><code>URL Param</code> The _id of the Candidate to edit</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "name.middle",
            "description": "<p>Candidate name.middle</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "altEmail",
            "description": "<p>Candidate altEmail</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "cvLink",
            "description": "<p>Candidate cvLink</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "currentEmployer",
            "description": "<p>Candidate currentEmployer</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "currentPosition",
            "description": "<p>Candidate currentPosition</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "currentSalary",
            "description": "<p>Candidate currentSalary</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "currentLocation",
            "description": "<p>Candidate currentLocation</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "noticePeriod",
            "description": "<p>Candidate noticePeriod</p>"
          },
          {
            "group": "Parameter",
            "type": "Date",
            "optional": true,
            "field": "availableFrom",
            "description": "<p>Candidate availableFrom</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": true,
            "field": "yearsOfExperience",
            "defaultValue": "0",
            "description": "<p>Candidate yearsOfExperience</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "highestEducationalQualification",
            "description": "<p>Candidate highestEducationalQualification</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "experienceSummary",
            "description": "<p>Candidate experienceSummary</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "portfolio",
            "description": "<p>Candidate portfolio</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "source",
            "description": "<p>Candidate source</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "expectedSalary",
            "description": "<p>Candidate expectedSalary</p>"
          },
          {
            "group": "Parameter",
            "type": "String[]",
            "optional": true,
            "field": "skills",
            "description": "<p>Array of skills</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response: 200 OK",
          "content": "{\n    error : false,\n    candidate: {}\n}",
          "type": "type"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/rest/candidates.js",
    "groupTitle": "Candidate"
  },
  {
    "type": "get",
    "url": "/candidates",
    "title": "1.0 Fetch all the Candidates",
    "name": "fetchCandidates",
    "group": "Candidate",
    "permission": [
      {
        "name": "User"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>The JWT Token in format &quot;Bearer xxxx.yyyy.zzzz&quot;</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response: 200 OK",
          "content": "{\n    error : false,\n    candidates: [{}]\n}",
          "type": "type"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/rest/candidates.js",
    "groupTitle": "Candidate"
  },
  {
    "type": "get",
    "url": "/candidate/:id",
    "title": "2.0 Find a Candidate by _id",
    "name": "getCandidate",
    "group": "Candidate",
    "permission": [
      {
        "name": "User"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>The JWT Token in format &quot;Bearer xxxx.yyyy.zzzz&quot;</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p><code>URL Param</code> The _id of the Candidate to find</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response: 200 OK",
          "content": "{\n    error : false,\n    candidate: {}\n}",
          "type": "type"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/rest/candidates.js",
    "groupTitle": "Candidate"
  },
  {
    "type": "post",
    "url": "/event",
    "title": "3.0 Create a new Event",
    "name": "createEvent",
    "group": "Event",
    "permission": [
      {
        "name": "Public"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>The JWT Token in format &quot;Bearer xxxx.yyyy.zzzz&quot;</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "title",
            "description": "<p>Event title</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "description",
            "description": "<p>Event description</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "location",
            "description": "<p>Event location</p>"
          },
          {
            "group": "Parameter",
            "type": "Date",
            "optional": true,
            "field": "start",
            "description": "<p>Event start</p>"
          },
          {
            "group": "Parameter",
            "type": "Date",
            "optional": true,
            "field": "end",
            "description": "<p>Event end</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "url",
            "description": "<p>Event url</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": true,
            "field": "geo",
            "description": "<p>Event geo</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": true,
            "field": "geo.lat",
            "description": "<p>Event geo.lat</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": true,
            "field": "geo.lon",
            "description": "<p>Event geo.lon</p>"
          },
          {
            "group": "Parameter",
            "type": "String[]",
            "optional": true,
            "field": "categories",
            "description": "<p>Event categories</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "status",
            "description": "<p>Event status</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": true,
            "field": "organizer",
            "description": "<p>Event organizer</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "organizer.name",
            "description": "<p>Event organizer.name</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "organizer.email",
            "description": "<p>Event organizer.email</p>"
          },
          {
            "group": "Parameter",
            "type": "undefined[]",
            "optional": true,
            "field": "attendees",
            "description": "<p>Event attendees</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response: 200 OK",
          "content": "{\n    error : false,\n    event: {}\n}",
          "type": "type"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/rest/events.js",
    "groupTitle": "Event"
  },
  {
    "type": "delete",
    "url": "/event/:id",
    "title": "4.0 Delete a Event by _id",
    "name": "deleteEvent",
    "group": "Event",
    "permission": [
      {
        "name": "Public"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>The JWT Token in format &quot;Bearer xxxx.yyyy.zzzz&quot;</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p><code>URL Param</code> The _id of the Event to delete</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "{\n    error : false,\n}",
          "type": "type"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/rest/events.js",
    "groupTitle": "Event"
  },
  {
    "type": "put",
    "url": "/event/:id",
    "title": "4.0 Edit a Event by _id",
    "name": "editEvent",
    "group": "Event",
    "permission": [
      {
        "name": "Public"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>The JWT Token in format &quot;Bearer xxxx.yyyy.zzzz&quot;</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p><code>URL Param</code> The _id of the Event to edit</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "location",
            "description": "<p>Event location</p>"
          },
          {
            "group": "Parameter",
            "type": "Date",
            "optional": true,
            "field": "start",
            "description": "<p>Event start</p>"
          },
          {
            "group": "Parameter",
            "type": "Date",
            "optional": true,
            "field": "end",
            "description": "<p>Event end</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "url",
            "description": "<p>Event url</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": true,
            "field": "geo",
            "description": "<p>Event geo</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": true,
            "field": "geo.lat",
            "description": "<p>Event geo.lat</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": true,
            "field": "geo.lon",
            "description": "<p>Event geo.lon</p>"
          },
          {
            "group": "Parameter",
            "type": "String[]",
            "optional": true,
            "field": "categories",
            "description": "<p>Event categories</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "status",
            "description": "<p>Event status</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": true,
            "field": "organizer",
            "description": "<p>Event organizer</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "organizer.name",
            "description": "<p>Event organizer.name</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "organizer.email",
            "description": "<p>Event organizer.email</p>"
          },
          {
            "group": "Parameter",
            "type": "undefined[]",
            "optional": true,
            "field": "attendees",
            "description": "<p>Event attendees</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response: 200 OK",
          "content": "{\n    error : false,\n    event: {}\n}",
          "type": "type"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/rest/events.js",
    "groupTitle": "Event"
  },
  {
    "type": "get",
    "url": "/events",
    "title": "1.0 Fetch all the Events",
    "name": "fetchEvents",
    "group": "Event",
    "permission": [
      {
        "name": "Public"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>The JWT Token in format &quot;Bearer xxxx.yyyy.zzzz&quot;</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response: 200 OK",
          "content": "{\n    error : false,\n    events: [{}]\n}",
          "type": "type"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/rest/events.js",
    "groupTitle": "Event"
  },
  {
    "type": "get",
    "url": "/event/:id",
    "title": "2.0 Find a Event by _id",
    "name": "getEvent",
    "group": "Event",
    "permission": [
      {
        "name": "Public"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>The JWT Token in format &quot;Bearer xxxx.yyyy.zzzz&quot;</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p><code>URL Param</code> The _id of the Event to find</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response: 200 OK",
          "content": "{\n    error : false,\n    event: {}\n}",
          "type": "type"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/rest/events.js",
    "groupTitle": "Event"
  },
  {
    "type": "post",
    "url": "/import/candidates",
    "title": "1.2. Bulk import a list of candidates for a particular Opening from CSV file",
    "name": "importCandidates",
    "group": "ExportImport",
    "permission": [
      {
        "name": "User"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>The JWT Token in format &quot;Bearer xxxx.yyyy.zzzz&quot;</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "openingId",
            "description": "<p>The _id of the Opening to add these customers to</p>"
          },
          {
            "group": "Parameter",
            "type": "BinaryFile",
            "optional": false,
            "field": "csv-file",
            "description": "<p>The CSV file to upload containing the Candidates details. <code>N.B.:</code> It must have the <em>first row/line</em> as the headings, viz. <code>name.first,name.last,phone,email</code> title</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/rest/data-import.js",
    "groupTitle": "ExportImport"
  },
  {
    "type": "post",
    "url": "/import/openings",
    "title": "1.1. Bulk import a list of openings from CSV file",
    "name": "importOpenings",
    "group": "ExportImport",
    "permission": [
      {
        "name": "User"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>The JWT Token in format &quot;Bearer xxxx.yyyy.zzzz&quot;</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "BinaryFile",
            "optional": false,
            "field": "csv-file",
            "description": "<p>The CSV file to upload containing the Openings details. <code>N.B.:</code> It must have the <em>first row/line</em> as the headings, viz. <code>name.first,name.last,phone,email</code> title</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/rest/data-import.js",
    "groupTitle": "ExportImport"
  },
  {
    "type": "GET",
    "url": "/messages",
    "title": "Get list of all email messages to a candidate, grouped by threads",
    "name": "getMessages",
    "group": "Messages",
    "permission": [
      {
        "name": "User"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "candidateId",
            "description": "<p>_id of the candidate</p>"
          },
          {
            "group": "Parameter",
            "type": "Boolean",
            "optional": true,
            "field": "showMyMailsOnly",
            "defaultValue": "false",
            "description": "<p>Optionally filter to show emails sent by current user only</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response: 200 OK",
          "content": "{\n    error : false,\n    threads: [{}]\n}",
          "type": "type"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/rest/messages.js",
    "groupTitle": "Messages"
  },
  {
    "type": "POST",
    "url": "/message/send",
    "title": "Send a message to a candidate.",
    "name": "sendMessage",
    "group": "Messages",
    "permission": [
      {
        "name": "User"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "subject",
            "description": "<p>Mail Subject</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "candidateId",
            "description": "<p>_id of candidate</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "html",
            "description": "<p>The html body of the email message</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "replyToMsgId",
            "description": "<p>Mailgun message ID to reply to. If specified, implies that this is continuation of an existing message thread.</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response: 200 OK",
          "content": "{\n    error : false\n}",
          "type": "type"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/rest/messages.js",
    "groupTitle": "Messages"
  },
  {
    "type": "post",
    "url": "/opening",
    "title": "3.0 Create a new Opening",
    "name": "createOpening",
    "group": "Opening",
    "permission": [
      {
        "name": "User"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>The JWT Token in format &quot;Bearer xxxx.yyyy.zzzz&quot;</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "title",
            "description": "<p>Opening title</p>"
          },
          {
            "group": "Parameter",
            "type": "String[]",
            "optional": false,
            "field": "workflowStages",
            "description": "<p>Array of workflow stage Ids in desired order. Must have at least one element.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "description",
            "description": "<p>Opening description</p>"
          },
          {
            "group": "Parameter",
            "type": "String[]",
            "optional": true,
            "field": "locations",
            "description": "<p>Opening locations</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": true,
            "field": "noOfOpenings",
            "defaultValue": "1",
            "description": "<p>Opening noOfOpenings</p>"
          },
          {
            "group": "Parameter",
            "type": "Boolean",
            "optional": true,
            "field": "isActive",
            "defaultValue": "true",
            "description": "<p>Opening isActive</p>"
          },
          {
            "group": "Parameter",
            "type": "Boolean",
            "optional": true,
            "field": "isRemoteAllowed",
            "defaultValue": "false",
            "description": "<p>Opening isRemoteAllowed</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "positionType",
            "defaultValue": "fulltime",
            "description": "<p>Opening positionType <code>enum=[&quot;fulltime&quot;, &quot;contract&quot;, &quot;freelance&quot;, &quot;internship&quot;]</code></p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "jobFunction",
            "description": "<p>Opening jobFunction <code>enum=[&quot;HR&quot;, &quot;Marketing&quot;, &quot;IT&quot;, &quot;Finance&quot;]</code></p>"
          },
          {
            "group": "Parameter",
            "type": "String[]",
            "optional": true,
            "field": "skillsRequired",
            "description": "<p>Array of skills required</p>"
          },
          {
            "group": "Parameter",
            "type": "String[]",
            "optional": true,
            "field": "tags",
            "description": "<p>Array of tags</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": true,
            "field": "minExpRequired",
            "description": "<p>Opening minExpRequired</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": true,
            "field": "maxExpRequired",
            "description": "<p>Opening maxExpRequired</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": true,
            "field": "minCompensation",
            "description": "<p>Opening minCompensation</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": true,
            "field": "maxCompensation",
            "description": "<p>Opening maxCompensation</p>"
          },
          {
            "group": "Parameter",
            "type": "Boolean",
            "optional": true,
            "field": "hideCompensationDetails",
            "defaultValue": "false",
            "description": "<p>Opening hideCompensationDetails</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "minEducationalQualification",
            "description": "<p>Opening minEducationalQualification</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "jobLevel",
            "description": "<p>Opening jobLevel <code>enum=[&quot;Entry&quot;, &quot;Associate&quot;, &quot;Middle&quot;, &quot;Senior&quot;, &quot;Director &amp; Above&quot;]</code></p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "jobCode",
            "description": "<p>Opening jobCode</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response: 200 OK",
          "content": "{\n    error : false,\n    opening: {}\n}",
          "type": "type"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/rest/openings.js",
    "groupTitle": "Opening"
  },
  {
    "type": "delete",
    "url": "/opening/:id",
    "title": "4.0 Delete a Opening by _id",
    "name": "deleteOpening",
    "group": "Opening",
    "permission": [
      {
        "name": "User"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>The JWT Token in format &quot;Bearer xxxx.yyyy.zzzz&quot;</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p><code>URL Param</code> The _id of the Opening to delete</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "{\n    error : false,\n}",
          "type": "type"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/rest/openings.js",
    "groupTitle": "Opening"
  },
  {
    "type": "put",
    "url": "/opening/:id",
    "title": "4.0 Edit a Opening by _id",
    "name": "editOpening",
    "group": "Opening",
    "permission": [
      {
        "name": "User"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>The JWT Token in format &quot;Bearer xxxx.yyyy.zzzz&quot;</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p><code>URL Param</code> The _id of the Opening to edit</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "description",
            "description": "<p>Opening description</p>"
          },
          {
            "group": "Parameter",
            "type": "String[]",
            "optional": true,
            "field": "workflowStages",
            "description": "<p>Array of workflow stage Ids in desired order. Note that setting this field OVERWRITES existing array completely.</p>"
          },
          {
            "group": "Parameter",
            "type": "String[]",
            "optional": true,
            "field": "locations",
            "description": "<p>Opening locations</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": true,
            "field": "noOfOpenings",
            "description": "<p>Opening noOfOpenings</p>"
          },
          {
            "group": "Parameter",
            "type": "Boolean",
            "optional": true,
            "field": "isActive",
            "description": "<p>Opening isActive</p>"
          },
          {
            "group": "Parameter",
            "type": "Boolean",
            "optional": true,
            "field": "isRemoteAllowed",
            "description": "<p>Opening isRemoteAllowed</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "positionType",
            "description": "<p>Opening positionType <code>enum=[&quot;fulltime&quot;, &quot;contract&quot;, &quot;freelance&quot;, &quot;internship&quot;]</code></p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "jobFunction",
            "description": "<p>Opening jobFunction <code>enum=[&quot;HR&quot;, &quot;Marketing&quot;, &quot;IT&quot;, &quot;Finance&quot;]</code></p>"
          },
          {
            "group": "Parameter",
            "type": "String[]",
            "optional": true,
            "field": "skillsRequired",
            "description": "<p>Array of skills required</p>"
          },
          {
            "group": "Parameter",
            "type": "String[]",
            "optional": true,
            "field": "tags",
            "description": "<p>Array of tags</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": true,
            "field": "minExpRequired",
            "description": "<p>Opening minExpRequired</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": true,
            "field": "maxExpRequired",
            "description": "<p>Opening maxExpRequired</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": true,
            "field": "minCompensation",
            "description": "<p>Opening minCompensation</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": true,
            "field": "maxCompensation",
            "description": "<p>Opening maxCompensation</p>"
          },
          {
            "group": "Parameter",
            "type": "Boolean",
            "optional": true,
            "field": "hideCompensationDetails",
            "description": "<p>Opening hideCompensationDetails</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "minEducationalQualification",
            "description": "<p>Opening minEducationalQualification</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "jobLevel",
            "description": "<p>Opening jobLevel <code>enum=[&quot;Entry&quot;, &quot;Associate&quot;, &quot;Middle&quot;, &quot;Senior&quot;, &quot;Director &amp; Above&quot;]</code></p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "jobCode",
            "description": "<p>Opening jobCode</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response: 200 OK",
          "content": "{\n    error : false,\n    opening: {}\n}",
          "type": "type"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/rest/openings.js",
    "groupTitle": "Opening"
  },
  {
    "type": "get",
    "url": "/openings",
    "title": "1.0 Fetch all the Openings",
    "name": "fetchOpenings",
    "group": "Opening",
    "permission": [
      {
        "name": "User"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>The JWT Token in format &quot;Bearer xxxx.yyyy.zzzz&quot;</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response: 200 OK",
          "content": "{\n    error : false,\n    openings: [{}]\n}",
          "type": "type"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/rest/openings.js",
    "groupTitle": "Opening"
  },
  {
    "type": "get",
    "url": "/opening/:id",
    "title": "2.0 Find a Opening by _id",
    "name": "getOpening",
    "group": "Opening",
    "permission": [
      {
        "name": "User"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>The JWT Token in format &quot;Bearer xxxx.yyyy.zzzz&quot;</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p><code>URL Param</code> The _id of the Opening to find</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response: 200 OK",
          "content": "{\n    error : false,\n    opening: {}\n}",
          "type": "type"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/rest/openings.js",
    "groupTitle": "Opening"
  },
  {
    "type": "get",
    "url": "/tags/:type",
    "title": "1.0 Fetch all the Tags (pan organization) of specified type",
    "name": "fetchTags",
    "group": "Tag",
    "permission": [
      {
        "name": "Public"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>The JWT Token in format &quot;Bearer xxxx.yyyy.zzzz&quot;</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p><code>type</code> The type of tag <code>enum[&quot;skill&quot;, &quot;opening&quot;, &quot;candidate&quot;]</code></p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response: 200 OK",
          "content": "{\n    error : false,\n    users: [{}]\n}",
          "type": "type"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/rest/tags.js",
    "groupTitle": "Tag"
  },
  {
    "type": "post",
    "url": "/user",
    "title": "3.0 Create a new User",
    "name": "createUser",
    "group": "User",
    "permission": [
      {
        "name": "Public"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>The JWT Token in format &quot;Bearer xxxx.yyyy.zzzz&quot;</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Date",
            "optional": true,
            "field": "createdAt",
            "description": "<p>User createdAt</p>"
          },
          {
            "group": "Parameter",
            "type": "Date",
            "optional": true,
            "field": "lastModifiedAt",
            "description": "<p>User lastModifiedAt</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response: 200 OK",
          "content": "{\n    error : false,\n    user: {}\n}",
          "type": "type"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/rest/users.js",
    "groupTitle": "User"
  },
  {
    "type": "delete",
    "url": "/user/:id",
    "title": "4.0 Delete a User by _id",
    "name": "deleteUser",
    "group": "User",
    "permission": [
      {
        "name": "Public"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>The JWT Token in format &quot;Bearer xxxx.yyyy.zzzz&quot;</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p><code>URL Param</code> The _id of the User to delete</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "{\n    error : false,\n}",
          "type": "type"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/rest/users.js",
    "groupTitle": "User"
  },
  {
    "type": "put",
    "url": "/user/:id",
    "title": "4.0 Edit a User by _id",
    "name": "editUser",
    "group": "User",
    "permission": [
      {
        "name": "Public"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>The JWT Token in format &quot;Bearer xxxx.yyyy.zzzz&quot;</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p><code>URL Param</code> The _id of the User to edit</p>"
          },
          {
            "group": "Parameter",
            "type": "Date",
            "optional": true,
            "field": "createdAt",
            "description": "<p>User createdAt</p>"
          },
          {
            "group": "Parameter",
            "type": "Date",
            "optional": true,
            "field": "lastModifiedAt",
            "description": "<p>User lastModifiedAt</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response: 200 OK",
          "content": "{\n    error : false,\n    user: {}\n}",
          "type": "type"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/rest/users.js",
    "groupTitle": "User"
  },
  {
    "type": "get",
    "url": "/users",
    "title": "1.0 Fetch all the Users",
    "name": "fetchUsers",
    "group": "User",
    "permission": [
      {
        "name": "Public"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>The JWT Token in format &quot;Bearer xxxx.yyyy.zzzz&quot;</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response: 200 OK",
          "content": "{\n    error : false,\n    users: [{}]\n}",
          "type": "type"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/rest/users.js",
    "groupTitle": "User"
  },
  {
    "type": "get",
    "url": "/user/:id",
    "title": "2.0 Find a User by _id",
    "name": "getUser",
    "group": "User",
    "permission": [
      {
        "name": "Public"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>The JWT Token in format &quot;Bearer xxxx.yyyy.zzzz&quot;</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p><code>URL Param</code> The _id of the User to find</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response: 200 OK",
          "content": "{\n    error : false,\n    user: {}\n}",
          "type": "type"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/rest/users.js",
    "groupTitle": "User"
  },
  {
    "type": "GET",
    "url": "/widget/organization/apikey",
    "title": "Get the widget Api Key for your organization",
    "name": "getApiKey",
    "group": "Widget",
    "permission": [
      {
        "name": "User"
      }
    ],
    "success": {
      "examples": [
        {
          "title": "Success-Response: 200 OK",
          "content": "{\n    error : false,\n    apiKey: \"cjxu21t3y00007ev20zqi63s6\"\n}",
          "type": "type"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/rest/widgets.js",
    "groupTitle": "Widget"
  },
  {
    "type": "GET",
    "url": "/widget/organization/code",
    "title": "Get embeddable/shareable script code for your organization",
    "name": "getCode",
    "group": "Widget",
    "permission": [
      {
        "name": "User"
      }
    ],
    "success": {
      "examples": [
        {
          "title": "Success-Response: 200 OK",
          "content": "{\n    error : false,\n    apiKey: \"cjxu21t3y00007ev20zqi63s6\",\n    script: \"\"\n}",
          "type": "type"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/rest/widgets.js",
    "groupTitle": "Widget"
  },
  {
    "type": "GET",
    "url": "/widget/openings/:apikey",
    "title": "Get all openings for an organization by widget api key",
    "name": "getOpenings",
    "group": "Widget",
    "permission": [
      {
        "name": "Public"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "apikey",
            "description": "<p>Api key for the organization to find openings for <code>URL Param</code></p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response: 200 OK",
          "content": "{\n    error : false,\n    openings: [{}]\n}",
          "type": "type"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/rest/widgets.js",
    "groupTitle": "Widget"
  },
  {
    "type": "PUT",
    "url": "/widget/organization/apikey",
    "title": "Regenerate the widget Api Key for your organization",
    "name": "regenerateApiKey",
    "group": "Widget",
    "permission": [
      {
        "name": "User"
      }
    ],
    "success": {
      "examples": [
        {
          "title": "Success-Response: 200 OK",
          "content": "{\n    error : false,\n    apiKey: \"cjxu21t3y00007ev20zqi63s6\"\n}",
          "type": "type"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/rest/widgets.js",
    "groupTitle": "Widget"
  },
  {
    "type": "post",
    "url": "/workflowStage",
    "title": "3.0 Create a new WorkflowStage",
    "name": "createWorkflowStage",
    "group": "WorkflowStage",
    "permission": [
      {
        "name": "User"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>The JWT Token in format &quot;Bearer xxxx.yyyy.zzzz&quot;</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "text",
            "description": "<p>WorkflowStage text</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "type",
            "description": "<p>WorkflowStage type <code>enum=[&quot;screening&quot;, &quot;remote&quot;, &quot;onsite&quot;]</code></p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response: 200 OK",
          "content": "{\n    error : false,\n    workflowStage: {}\n}",
          "type": "type"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/rest/workflowStages.js",
    "groupTitle": "WorkflowStage"
  },
  {
    "type": "delete",
    "url": "/workflowStage/:id",
    "title": "4.0 Delete a WorkflowStage by _id",
    "name": "deleteWorkflowStage",
    "group": "WorkflowStage",
    "permission": [
      {
        "name": "User"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>The JWT Token in format &quot;Bearer xxxx.yyyy.zzzz&quot;</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p><code>URL Param</code> The _id of the WorkflowStage to delete</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "{\n    error : false,\n}",
          "type": "type"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/rest/workflowStages.js",
    "groupTitle": "WorkflowStage"
  },
  {
    "type": "put",
    "url": "/workflowStage/:id",
    "title": "4.0 Edit a WorkflowStage by _id",
    "name": "editWorkflowStage",
    "group": "WorkflowStage",
    "permission": [
      {
        "name": "User"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>The JWT Token in format &quot;Bearer xxxx.yyyy.zzzz&quot;</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p><code>URL Param</code> The _id of the WorkflowStage to edit</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "text",
            "description": "<p>WorkflowStage text</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "type",
            "description": "<p>WorkflowStage type <code>enum=[&quot;screening&quot;, &quot;remote&quot;, &quot;onsite&quot;]</code></p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response: 200 OK",
          "content": "{\n    error : false,\n    workflowStage: {}\n}",
          "type": "type"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/rest/workflowStages.js",
    "groupTitle": "WorkflowStage"
  },
  {
    "type": "get",
    "url": "/workflowStages",
    "title": "1.0 Fetch all the WorkflowStages",
    "name": "fetchWorkflowStages",
    "group": "WorkflowStage",
    "permission": [
      {
        "name": "User"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>The JWT Token in format &quot;Bearer xxxx.yyyy.zzzz&quot;</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response: 200 OK",
          "content": "{\n    error : false,\n    workflowStages: [{}]\n}",
          "type": "type"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/rest/workflowStages.js",
    "groupTitle": "WorkflowStage"
  },
  {
    "type": "get",
    "url": "/workflowStage/:id",
    "title": "2.0 Find a WorkflowStage by _id",
    "name": "getWorkflowStage",
    "group": "WorkflowStage",
    "permission": [
      {
        "name": "User"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>The JWT Token in format &quot;Bearer xxxx.yyyy.zzzz&quot;</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p><code>URL Param</code> The _id of the WorkflowStage to find</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response: 200 OK",
          "content": "{\n    error : false,\n    workflowStage: {}\n}",
          "type": "type"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/rest/workflowStages.js",
    "groupTitle": "WorkflowStage"
  }
] });
