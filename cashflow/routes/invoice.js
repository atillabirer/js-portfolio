const express = require('express')
const router = express.Router()


var secret = "jtmNM2KcFh"
var jwt = require('express-jwt')({ secret: secret })
var jsonparser = bodyParser.json()
var jsonwebtoken = require('jsonwebtoken')
var json = jsonparser

const apiKey = process.env.SHOPIFY_API_KEY;
const apiSecret = process.env.SHOPIFY_API_SECRET;
const scopes = 'read_products,read_customers,read_orders,write_orders';
const forwardingAddress = "https://cashflow.fm"; // Replace this with your HTTPS Forwarding address
const returnaddr = "15wWxgfqhCLBaCAJTZYHMgeiUXMK8h7WyQ";

router.get('/:address', function (req, res, next) {
    var obj = { address: req.params.address }
    var found = false;
    transactions.forEach((tx) => {
        if (tx.address == req.params.address) {
            obj.tx = tx
            obj.status = "unpaid"
            res.render('invoice', obj)
            found = true;
        }
    })
    if (found) {
        return;
    }
    req.app.locals.db.get("SELECT * FROM transactions WHERE address = ?", [req.params.address], function (err, rows) {
        console.log("Rows:" + rows)
        console.log(err)
        if (rows === undefined || rows.length < 1) {
            res.json({ error: "No such invoice" })
            res.end()
        } else {
            obj.tx = rows
            obj.status = "paid"
            res.render("invoice", obj)

        }
    })

})

module.exports = router;