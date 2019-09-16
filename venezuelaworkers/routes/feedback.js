var express = require('express')
var router = express.Router()
var config = require('../config')

router.get('/:project_id',function(req,res) {

    if(req.isAuthenticated()) {
        //find out if they're involved in the project
        config.db.get("SELECT * FROM projects WHERE id = ?",[req.params.project_id],function(err,project) {
            if((project.user_id == req.user.id) || (project.awarded_to == req.user.id)) {
                //render
                res.render('feedback',{project,user:req.user})
            }
            else {
                //nope
                res.send("You can't leave feedback on this project.")
            }
        })
    } else {
        res.sendStatus(403)
    }

})

router.post('/:project_id',function(req,res) {

    if(req.isAuthenticated()) {
        //find out if they're involved in the project
        config.db.get("SELECT * FROM projects WHERE id = ?",[req.params.project_id],function(err,project) {
            if(project.user_id == req.user.id)  {
                //update hirer feedback and redirect
                config.db.run("UPDATE projects SET hirer_feedback = ?, hirer_rating = ?",[req.body.feedback,req.body.rating],function(err) {
                    if(err) {
                        res.send(err)
                    } else {
                        res.redirect(`/feedback/${req.params.project_id}`)
                    }
                })
            } else if(project.awarded_to == req.user.id) {
                config.db.run("UPDATE projects SET worker_feedback = ?, worker_rating = ?",[req.body.feedback,req.body.rating],function(err) {
                    if(err) {
                        res.send(err)
                    } else {
                        res.redirect(`/feedback/${req.params.project_id}`)
                    }
                })
            }
            else {
                //nope
                res.send("You can't leave feedback on this project.")
            }
        })
    } else {
        res.sendStatus(403)
    }




})

module.exports = router;
