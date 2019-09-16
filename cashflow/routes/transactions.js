const express = require('express')
const router = express.Router()
var jwt = require('express-jwt')({ secret: secret })
var jsonparser = bodyParser.json()
var jsonwebtoken = require('jsonwebtoken')
var json = jsonparser

router.get('/', jwt, function (req, res, next) {
    //return all transactions for that merchant
    req.app.locals.db.all("SELECT * FROM transactions WHERE merchant = ? ORDER BY id DESC", [req.user.email], function (err, row) {
        //TODO:make sure returns empty array on no result
        res.json(row)
        res.end()
    })
})

router.post('/', jsonparser, jwt, function (req, res, next) {
    console.log(req.body)
    if (req.body.price && req.body.itemdesc && req.body.returnaddr && req.body.posturl && req.body.postdata) {
        req.app.locals.db.client.command([{ method: "getnewaddress", parameters: [req.user.email] }])
            .then(function (responses) {
                res.json({ address: responses[0] })
                req.app.locals.transactions.push({
                    price: req.body.price,
                    itemdesc: req.body.itemdesc,
                    merchant: req.user.email,
                    returnaddr: req.body.returnaddr,
                    address: responses[0],
                    posturl: req.body.posturl,
                    postdata: req.body.postdata

                })
                console.log(req.app.locals.transactions)
                res.end()
            })
    } else {
        res.json({ error: "Missing parameters" })
        res.end()
    }
})

router.get('/balance', jwt, function (req, res, next) {
    req.app.locals.client.command([{ method: "getbalance", parameters: [req.user.email] }]).then(function (responses) {
        res.json(responses)
        res.end()
    }).catch(function (error) {
        res.json({ error: error.message })
        res.end()
    })
})

router.get('/:txid', jwt, function (req, res, next) {
    //return transaction with that txid
    req.app.locals.db.get("SELECT * FROM transactions WHERE txid = ?", [req.params.txid], function (err, row) {
        res.json(row[0])
        res.end()
    })

})

router.post('/withdraw', jsonparser, jwt, function (req, res, next) {
    console.log(req.body.address)
    if (req.body.address === undefined) {
        res.send({ error: "address parameter is required." })
        res.end()
        return
    }
    req.app.locals.client.command([{ method: "getbalance", parameters: [req.user.email] }]).then(function (response) {
        if (response[0] > 0.001) {
            let balance = response[0], fee = (balance / 100).toFixed(8), remaining = (balance - fee).toFixed(8);
            console.log(balance)
            console.log(remaining)
            console.log(fee)
            client.command([{ method: "sendmany", parameters: [req.user.email, { [req.body.address]: remaining, [mainaddr]: fee }, 1, "", [req.body.address]] }]).then(function (response) {
                res.json({ txid: response[0] })
                res.end()
            }).catch(function (error) {
                console.log(error)
            })
        } else {
            res.json({ error: "You need at least 0.001 BCH in your wallet to withdraw." })
            res.end()
        }
    })
})

router.post('/shopbalance', json, (req, res) => {
    req.app.locals.db.get(`SELECT SUM(price) FROM transactions WHERE postdata LIKE '%${req.body.shop}%'`, (err, rows) => {
        console.log(req.body.shop)
        if (err) {
            console.log(err)
            res.json({ error: err })
            res.end()
        }
        if (rows) {
            res.json(rows)
            res.end()
        }
    })
})
router.post('/request', json, (req, res) => {
    if (req.body.address && req.body.shop) {
        console.log("Withdrawal request received from" + req.body.shop + "to address" + req.body.address)
        res.json({ success: "Request received. We will deposit your earnings shortly" })
        const fs = require('fs');

        fs.appendFile('requests.txt', JSON.stringify(req.body) + "\n", function (err) {
            if (err) throw err;
            console.log('Saved!');
        });
    } else {
        res.json({ error: "Error receiving your request. Please try again later." })
        res.end()
    }
})

router.post('/notify', rawparser, function (req, res, next) {
    res.end()
    //get transaction details
    req.app.locals.client.command([{ method: "gettransaction", "parameters": [req.body] }]).then(function (responses) {
        if (responses[0].confirmations === 0 && lasttx == req.body) {
            //duplicate, skip
        } else {
            lasttx = req.body
            //not a duplicate, check what it is
            //find the receive detail
            responses[0].details.forEach(function (detail) {
                if (detail.category == "receive") {
                    console.log("received amount: " + detail.amount)
                    //is it an overcharge refund?
                    req.app.locals.overpaid.forEach(function (overpay, index) {
                        if (overpay.transaction.address == detail.address) {
                            req.app.locals.client.command([{ method: "sendfrom", parameters: [overpay.transaction.merchant, overpay.transaction.returnaddr, overpay.amount] }])
                                .then(function (responses) {
                                    console.log("overpayment refunded")
                                    delete req.app.locals.overpaid[index]
                                    console.log(req.app.locals.overpaid)
                                }).catch(function (error) {
                                    console.log(error)

                                })
                        }
                    })
                    req.app.locals.underpaid.forEach(function (underpay, index) {
                        if (underpay.transaction.address == detail.address && underpay.amount >= detail.amount) {
                            //broadcast success, post callback, delete tx
                            console.log("underpayment fixed")
                            sockets.forEach(function (socket) {
                                socket.emit('event', { address: underpay.transaction.address, event: "success" })
                            })
                            request({
                                method: "POST",
                                uri: underpay.transaction.posturl,
                                json: true,
                                body: underpay.transaction.postdata
                            }).then(function (response) {

                            }).catch(function (err) {
                                console.log("underpaid post error:")
                                console.log(err)

                            })
                            req.app.locals.db.run(
                                "INSERT INTO transactions(txid,merchant,itemdesc,price,address,returnaddr,posturl,postdata) VALUES(?,?,?,?,?,?,?,?)",
                                [req.body, underpay.transaction.merchant, underpay.transaction.itemdesc, underpay.transaction.price, underpay.transaction.address,
                                underpay.transaction.returnaddr, underpay.transaction.posturl, underpay.transaction.postdata],
                                function (error) {
                                    console.log(error)
                                })
                            delete req.app.locals.underpaid[index]
                            console.log(req.app.locals.underpaid)

                        }
                    })
                    req.app.locals.transactions.forEach(function (transaction, index) {
                        if (transaction.address == detail.address) {
                            if (transaction.price == detail.amount) {
                                console.log("equal amount")
                                //save, post callback, broadcast, delete
                                sockets.forEach(function (socket) {
                                    socket.emit('event', { address: transaction.address, event: "success" })
                                })
                                request.post(transaction.posturl, {
                                    method: "POST",
                                    body: JSON.parse(transaction.postdata),
                                    json: true


                                }).then(function (response) {
                                }).catch(function (err) {
                                    console.log(err)
                                })
                                req.app.locals.db.run(
                                    "INSERT INTO transactions(txid,merchant,itemdesc,price,address,returnaddr,posturl,postdata) VALUES(?,?,?,?,?,?,?,?)",
                                    [req.body, transaction.merchant, transaction.itemdesc, transaction.price, transaction.address, transaction.returnaddr, transaction.posturl,
                                    transaction.postdata],
                                    function (error) {
                                        console.log(error)
                                    })

                                delete req.app.locals.transactions[index]
                                console.log(req.app.locals.transactions)
                            } else if (transaction.price > detail.amount) {
                                console.log("underpaid, sending to underpaid queue")
                                //broadcast underpaid
                                sockets.forEach(function (socket) {
                                    socket.emit('event', { address: transaction.address, event: "underpaid", amount: (transaction.price - detail.amount).toFixed(8) })
                                })
                                req.app.locals.underpaid.push({ transaction: transaction, amount: (transaction.price - detail.amount).toFixed(8) })
                                console.log("needed amount for underpay: " + (transaction.price - detail.amount).toFixed(8))
                                delete req.app.locals.transactions[index]
                                console.log(transactions)
                            } else {
                                console.log("overpaid, sending to overpaid queue")
                                //broadcast overpaid, post callback, broadcast, delete
                                sockets.forEach(function (socket) {
                                    socket.emit('event', { address: transaction.address, event: "overpaid", amount: (detail.amount - transaction.price).toFixed(8) })
                                })
                                req.app.locals.overpaid.push({ transaction: transaction, amount: (detail.amount - transaction.price).toFixed(8) })
                                request({
                                    method: "POST",
                                    uri: transaction.posturl,
                                    body: transaction.postdata,
                                    json: true
                                }).then(function (response) { }).catch(function (err) {
                                    console.log(err)
                                })
                                req.app.locals.db.run("INSERT INTO transactions(txid,merchant,itemdesc,price,address,returnaddr,posturl,postdata) VALUES(?,?,?,?,?,?,?,?)",
                                    [req.body, transaction.merchant, transaction.itemdesc, transaction.price, transaction.address, transaction.returnaddr, transaction.posturl, transaction.postdata],
                                    function (error) {
                                        console.log(error)
                                    })
                                delete req.app.locals.transactions[index]
                                console.log(req.app.locals.transactions)
                            }
                        }
                    })
                }
            })
        }


    }).catch(function (error) {
        console.log(error)
    })
})

module.exports = router;