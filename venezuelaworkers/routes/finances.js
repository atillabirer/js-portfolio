const express = require('express')
const router = express.Router()
const config = require('../config')

router.get('/',function(req,res) {
    //show balance, transactions, an address for top up
    if(req.isAuthenticated()) {

        config.rpc.getBalance(req.user.username).then((balance) => {
            config.rpc.command([{method:"getnewaddress",parameters:[req.user.username]}]).then((addresses) => {
                config.db.all("SELECT * FROM transactions WHERE user_id = ?",[req.user.id],function(err,transactions) {
                    res.render('finances/index',{balance,address:addresses[0],user:req.user,transactions})
                })
            }).catch((error) => {
                console.log(error)
            })
        }).catch((error) => {
            console.log(error)
        })

    } else {
        res.sendStatus(403)
    }
})

router.get('/pay/:project_id',function(req,res) {

    //move funds to the wallet of worker, then save the transactions
    if(req.isAuthenticated()) {
        //first check if their balance permits the payment of this project
        config.rpc.getBalance(req.user.username).then((balance) => {

            config.db.get("SELECT projects.user_id, projects.id, projects.title, projects.price, users.username FROM projects INNER JOIN users ON projects.awarded_to = users.id WHERE projects.id = ?",[req.params.project_id],(err,result) => {
                if(balance >= result.price && result.user_id == req.user.user_id) {
                    //go ahead and move the funds
                    config.rpc.command([{"method":"move",parameters:[req.user.username,result.username,result.price]}]).then((response) => {
                        config.db.run("INSERT INTO transactions(user_id,type,amount,details) VALUES(?,?,?,?)",[req.user.id,"payment",result.price,`Payment to ${result.username}`],(err) => {
                            if(err) {
                                res.send(err)
                            } else {
                                res.redirect('/finances')
                            }

                        })
                    }).catch((error) => {
                        console.log(error)
                    })
                } else {
                    res.send('Insufficient balance.')
                }
            })
        })

    } else {
        res.sendStatus(403)
    }

})

router.post('/withdraw',function(req,res) {

    //save the parameters to a file
    if(req.isAuthenticated()) {
        config.db.run("INSERT INTO transactions(type,user_id,amount,details) VALUES(?,?,?,?)",["withdrawal",req.user.id,"0.0",req.body.address],(err) => {
            if(err) {
                res.send(err)
            } else {
                res.send("Withdrawal request received.")
            }

        })
    } else {
        res.sendStatus(403)
    }

})
module.exports = router;
