var express = require('express')
var router = express.Router()
var config = require('../config')

//list all conversations
router.get('/',(req,res) => {
    
    if(req.isAuthenticated()) {
        if(req.user.type == "worker") {

            config.db.all("SELECT conversations.id, projects.title from conversations INNER JOIN projects on projects.id = conversations.project_id WHERE conversations.worker_id = ?",[req.user.id],(err,conversations) => {
                res.render('conversations/index',{conversations,user: req.user})
            
            })


        } else {
 
            config.db.all("SELECT conversations.id, projects.title from conversations INNER JOIN projects on projects.id = conversations.project_id WHERE conversations.hirer_id = ?",[req.user.id],(err,conversations) => {
                res.render('conversations/index',{conversations,user: req.user})
            
            })

       
        }
    } else {
    res.sendStatus(403)
    }
})

router.get('/create/:projectid/:workerid',(req,res) => {

    if(req.isAuthenticated() && req.user.type == "hirer") {

        //create a new thread and redirect user there
        config.db.run("INSERT INTO conversations(project_id, hirer_id, worker_id) VALUES(?,?,?)",[req.params.projectid,req.user.id, req.params.workerid],function(err) {
            if(err) {
            console.log(err)
            } else {
                console.log(this.lastID)
                res.redirect(`/conversations/${this.lastID}`)
            }
        
        })
    
    } else {

        //you can't do this
        //
        res.sendStatus(403)
    
    }

})


//get all messages and send message form
router.get('/:id',function(req,res) {

    if(req.isAuthenticated()) {

        config.db.all("SELECT projects.title, users.username, messages.message FROM messages INNER JOIN conversations ON messages.conversation_id = conversations.id INNER JOIN projects ON projects.id = conversations.project_id INNER JOIN users ON messages.user_id = users.id WHERE conversation_id = ? ORDER BY messages.id DESC",[req.params.id],function(err,messages) {
            console.log(err)
            console.log(messages)
         res.render('conversations/single',{messages,user:req.user,conversation_id:req.params.id})
        })
    } else {
    res.sendStatus(403)
    }
})

router.post('/:id',(req,res) => {

    //post a message to this thread
    if(req.isAuthenticated()) {
        config.db.run("INSERT INTO messages(conversation_id,user_id,message) VALUES(?,?,?)",[req.params.id,req.user.id,req.body.message],(err) => {
            if(err) {
            res.send(err)
            } else {
                res.redirect(`/conversations/${req.params.id}`)
            }
        })
    } else {
    res.sendStatus(403)
    }

})
module.exports = router;
