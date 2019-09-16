var express = require('express')
var router = express.Router()
var passport = require('passport')
var config = require('../config')


router.get('/',function(req,res) {
    //for now just a list of projects
    config.db.all('SELECT projects.*, users.username AS hirer FROM projects INNER JOIN users ON projects.user_id = users.id ORDER BY id DESC',function(err,rows) {
        console.log(err)
        res.render('projects/index',{projects: rows,user:req.user})
    })

})
router.get('/create',function(req,res) {

    if(req.isAuthenticated()) {
        res.render('projects/create',{user:req.user})
        } else {
         res.sendStatus(403)
        }

})

router.post('/create',function(req,res) {
    if(req.isAuthenticated()) {

        config.db.run("INSERT INTO projects(user_id,title,description,price,deadline) VALUES(?,?,?,?,?)",
            [req.user.id,req.body.title,req.body.description,req.body.price,req.body.deadline],
            function(err) {
                if(err) {
                    console.log(err)
                    res.redirect('/projects/create')
                } else {
                    res.redirect('/projects')
                }


            })
    
    } else {
    res.sendStatus(403)
    }
})

router.get('/edit/:id',function(req,res) {

    //get the project
    if(req.isAuthenticated()) {

    config.db.get("SELECT * FROM projects WHERE id = ?",[req.params.id],function(err,result) {
        if(err) {
            console.log(err)
            res.redirect('/projects')
        } else {
            if(result.user_id == req.user.id) {
                //belongs to user, let them edit
                res.render('projects/edit',{project:result,user:req.user})
            } else {
            res.send("You can't edit this project.")
            }
        }


    })
    } else {
        res.sendStatus(403)
    }
})

router.post('/edit/:id',function(req,res) {
//get the project
    if(req.isAuthenticated()) {
    config.db.get("SELECT * FROM projects WHERE id = ?",[req.params.id],function(err,result) {
        if(err) {
            console.log(err)
            res.redirect('/projects')
        } else {
            if(result.user_id == req.user.id) {
                //belongs to user, let them edit
                config.db.run("UPDATE projects SET title = ?, description = ?, price = ?, deadline = ? WHERE id = ?",
                    [req.body.title,req.body.description,req.body.price,req.body.deadline,result.id],function(err) {

                        if(err) {
                            console.log(err)
                        } else {
                            res.redirect(`/projects/${result.id}`)
                        } 
                    })
            } else {
            res.send('You cant edit that project.')
            }
        }


    })
    } else {
        res.sendStatus(403)
    }

})

router.get('/mine',function(req,res) {

    //if client, show a list of projects, who they hired, and actions like edit, delete, fire, end
    //if worker, all the projects they got hired on
    if(req.isAuthenticated()) {
        if(req.user.type == "worker") {
            config.db.all("SELECT projects.title, projects.id FROM projects INNER JOIN bids ON bids.project_id = projects.id INNER JOIN users ON bids.user_id = users.id WHERE users.id = ? AND bids.awarded = 1",[req.user.id],(err,projects) => {
                console.log(projects)
                res.render('projects/mine',{projects,user:req.user,message:req.flash('error')})
            })
        } else {
            config.db.all("SELECT projects.*, users.username FROM projects LEFT JOIN users on users.id = projects.awarded_to WHERE projects.user_id = ?",[req.user.id],(err,projects) => {
                console.log(projects)
                console.log(err)
                res.render('projects/mine',{projects,user:req.user,message:req.flash('error')})
            })
        }

    } else {
    res.sendStatus(403)
    }

})
router.get('/:id',function(req,res) {

    config.db.get("SELECT * FROM projects WHERE id = ?",[req.params.id],function(err, project) {

        config.db.all("SELECT bids.id,bids.user_id, users.username, bids.bid, bids.project_id FROM bids LEFT JOIN users ON bids.user_id = users.id WHERE bids.project_id = ? ORDER BY bids.id DESC",[req.params.id],function(err,bids) {

            var owner = false;
            if((req.user) && (project.user_id == req.user.id)) {

                owner = true;
            }
            res.render('projects/single',{project,bids,user:req.user,owner})
        
        })
    })

})


router.get('/delete/:id',function(req,res) {
 if(req.isAuthenticated()) {
    config.db.get("SELECT * FROM projects WHERE id = ?",[req.params.id],function(err,result) {
        if(err) {
            console.log(err)
            res.redirect('/projects')
        } else {
            if(result.user_id == req.user.id) {
                //belongs to user, let them edit
                config.db.run("DELETE FROM projects WHERE id = ?",
                    [req.params.id],function(err) {

                        if(err) {
                            console.log(err)
                        } else {
                            res.redirect(`/projects/mine`)
                        }
                    })
            } else {
            res.send('You cant delete that project.')
            }
        }


    })
    } else {
        res.sendStatus(403)
    }

})
router.get('/complete/:id',function(req,res) {

    if(req.isAuthenticated()) {

        config.db.get("SELECT * FROM projects WHERE id = ?",[req.params.id],function(err,project) {

            if(project.user_id == req.user.id) {
                config.db.run("UPDATE projects SET status = 'completed' WHERE id = ?",[req.params.id],function(err) {
                    if(err) {
                    res.send(err)
                    } else {
                        res.redirect(`/feedback/${req.params.id}`)
                    }
                })
            } else {
            res.sendStatus(403)
            }
        
        })

    } else {
    
    }


})
router.get('/fire/:projectid',function(req,res) {
    if(req.isAuthenticated()) {

        config.db.get("SELECT * FROM projects WHERE id = ?",[req.params.projectid],(err,result) => {

            if(result.user_id == req.user.id) {
                config.db.run("UPDATE projects SET awarded_to = NULL WHERE user_id = ?",[req.user.id],(err) => {

                    if(err) {
                     console.log(err)
                    } else {

                        res.redirect('/projects/mine')
                    }
                
                })
            }
        
        })
    
    }

})
module.exports = router;
