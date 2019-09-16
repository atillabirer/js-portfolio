const express = require('express')
const router = express.Router()

var secret = "jtmNM2KcFh"
var jwt = require('express-jwt')({ secret: secret })
var jsonparser = bodyParser.json()
var jsonwebtoken = require('jsonwebtoken')
var json = jsonparser

router.post('/register', jsonparser, function (req, res, next) {
    if (req.body.email && req.body.password) {
        //save and send success message
        req.app.locals.db.run("INSERT INTO users(email,password) VALUES(?,?)", [req.body.email, req.body.password], function (err) {
            if (err) {
                res.json({ error: err })

            } else {
                res.json({ success: "Registration succesful" })
            }
            res.end()
        })
    } else {
        res.json({ error: "missing parameters" })
        res.end()
    }
})

router.post('/login', jsonparser, function (req, res, next) {
    if (req.body.email && req.body.password) {
        req.app.locals.db.get("SELECT * FROM users WHERE email = ? AND password = ?", [req.body.email, req.body.password], function (err, rows) {
            console.log(err)
            console.log(rows)
            if (rows !== undefined) {
                res.json({ token: jsonwebtoken.sign(req.body, secret, { expiresIn: "7d" }) })
                res.end()
            } else {
                res.json({ error: "Invalid username or password" })
                res.end()
            }
        })
    }

})

router.get('/login', function (req, res, next) {
    res.sendFile(__dirname + "../login.html")

})

router.get('/terms', function (req, res) {
    res.sendFile(__dirname + "../terms.html")
})
router.get('/dashboard', function (req, res, next) {
    //no valid JWT cookie: redirect to login
    jsonwebtoken.verify(req.cookies._token, secret, function (err, decoded) {
        if (err) {
            res.redirect('/login')
        } else {
            res.sendFile(__dirname + "../public/dashboard.html")
        }
    })
})
router.get('/register', function (req, res, next) {
    res.sendFile(__dirname + '../register.html')
})
router.get('/doc', function (req, res, next) {
    res.sendFile(__dirname + '../doc.html')
})

router.get('/preferences', (req, res) => {
    res.sendFile('../preferences.html', { root: __dirname });
})


router.get('/install', function (req, res) {
    res.sendFile(__dirname + "../public/install.html")
})
//shopify routes end
router.get('/stats', function (req, res) {
    req.app.locals.client.command([{ method: "listtransactions", params: [] }]).then((response) => {
        res.send(response)
        res.end()
    }).catch((error) => {
        res.send(error)
        res.end()
    })
})
router.get('/hitcount', function (req, res) {
    res.send(hitcount + " visitors")
    res.end()
})

module.exports = router;