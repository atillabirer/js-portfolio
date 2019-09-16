var express = require('express')
var router = express.Router()
var config = require('../config')
var passport = require('passport')
router.get('/mine',function(req,res) {

    if(req.isAuthenticated()) {

        
    config.db.all("SELECT projects.title, bids.bid, bids.awarded, bids.id FROM bids INNER JOIN projects ON bids.project_id = projects.id WHERE bids.user_id = ?",[req.user.id],function(err,bids) {
        
        res.render('bids/mine',{bids,user:req.user})
    })
    
    } else {
    res.sendStatus(403)
    }

})


router.get('/edit/:id',function(req,res) {

    if(req.isAuthenticated()) {

        config.db.get("SELECT * FROM bids WHERE id = ?",[req.params.id],function(err,bid) {
            if(bid.user_id == req.user.id) {

                res.render('bids/edit',{bid,user:req.user})
            } else {

                res.send('You cant edit this bid')
            
            }

        })
    
    } else {
        res.sendStatus(403)
    }

})

router.get('/award/:id',function(req,res) {

    if(req.isAuthenticated()) {


        config.db.get("SELECT projects.id, projects.user_id AS ownerid, bids.user_id FROM bids INNER JOIN projects ON projects.id = bids.project_id WHERE bids.id = ?",[req.params.id],(err,result) => {
            
            if(result.ownerid == req.user.id) {
                config.db.run("UPDATE projects SET awarded_to = ? WHERE id = ?",[result.user_id, result.id],(err) => {
                    if(err) {
                    console.log(err)
                    }
                    res.redirect('/projects/mine');
                })
            } else {
            res.send('You cant award a bid on this project')
            }

    
    })
    } else {
    res.sendStatus(403)
    }

})

router.post('/',function(req,res) {

    //create a bid with project_id and user_id assigned
    if(req.isAuthenticated()) {

        config.db.get("SELECT * FROM bids WHERE project_id = ? AND user_id = ?",[req.body.project_id,req.user.id],function(err,result) {

            if(result) {
            res.send('You can only bid once on a project.')
            } else {
            
        //check if he already has bid
        config.db.run("INSERT INTO bids(user_id,project_id,bid) VALUES(?,?,?)",[req.user.id,req.body.project_id,req.body.bid],function(err) {
            if(err) {
                console.log(err)
                res.redirect('/')
            } else {
                res.redirect(`/projects/${req.body.project_id}`)
            } 
        })
            }
        
        })

    } else {
    res.sendStatus(403)
    }
})

router.post('/edit/:id',function(req,res) {

    if(req.isAuthenticated()) {

        config.db.get("SELECT * FROM bids WHERE id = ?",[req.params.id],function(err,bid) {
            if(bid.user_id == req.user.id) {
            
                config.db.run("UPDATE bids SET bid = ? WHERE id = ?",[req.body.bid,req.params.id],function(err) {

                    if(err) {
                    console.log(err)
                    } else {
                        res.redirect(`/bids/edit/${req.params.id}`)
                    }

                })
            
            } else {

                res.send('You cant edit this bid')
            
            }

        })
    
    } else {
        res.sendStatus(403)
    }



})

router.get('/delete/:id',function(req,res) {

    //delete if worker owns this bid and wasn't hired yet
    if(req.isAuthenticated()) {
        config.db.get("SELECT * FROM bids WHERE id = ?",[req.params.id],function(err,result) {

            if(result.user_id == req.user.id) {

                config.db.run("DELETE FROM bids WHERE id = ?",[req.params.id],(err) => {
                 if(err) {
                 console.log(err)
                 } else {
                     res.redirect('/bids/mine')
                 }
                })
            } else {
                //pound sand
                res.send("This bid isn't yours to delete")
            }
        })
    } else {
    res.sendStatus(403)
    }
})

module.exports = router;
