var express = require('express');
var config = require('../config')
var bcrypt = require('bcrypt')
var router = express.Router();
var passport = require('passport')
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.sendStatus(404).send('Not found');
});
router.get('/register',function(req,res) {
  res.render('register',{message:req.flash('error')})
})
router.post('/register',function(req,res) {
  //save a hashed password into the database
  //verify if user already exists
  config.db.get("SELECT * FROM users WHERE username = ?",[req.body.username],(err,row) => {
    
    if(row) {
      req.flash('error','User Already exists')
      res.redirect('/')
    } else {
      //create hash
      if(err) {
        console.log(err)
        res.send("An error occured.")
      }
      else {
        bcrypt.hash(req.body.password, 10).then((hash) => {
          //save the user
          config.db.run("INSERT INTO users(username,password,type) VALUES(?,?,?)",[req.body.username,hash,req.body.type],(result,err) => {
            if(err) {
              req.flash('error',err)
              res.redirect('/')
            } else {
              req.flash('error','Success! You can now log in.')
              res.redirect('/')
            }
          })
        },(reason) => console.log(reason));
        
      }
    }
  })
})


router.get('/profile',(req,res) => {

  if(req.isAuthenticated()) {

    res.render('profile',{user:req.user})

  } else {

    req.flash('error','You must log in to access that page.')
    res.redirect('/users/login')

  }

})

router.post('/profile',(req,res) => {
  if(req.isAuthenticated()) {
    config.db.run("UPDATE users SET title = ?, description = ?, skillset = ?, type = ? WHERE id = ?",
    [req.body.title,req.body.description,req.body.skillset,req.body.type,req.user.id],(result,err) => {
      if(err) {
        req.flash('error',err)
        res.redirect('/users/profile')
      } else {
        res.redirect('/users/profile')
      }
    })
  } else {
    res.sendStatus(401).send("Not authorized")
  }
})


router.post('/login',passport.authenticate('local',{failureRedirect:"/",failureFlash:true}),(req,res) => {
    if(req.user.type == "worker") {
        res.redirect('/projects')
    } else {
        res.redirect('/projects/mine')
    }
})

router.get('/logout',(req,res) => {

  req.logout()
  req.flash('error','You logged out.')
  res.redirect('/')

})

router.get('/:id',function(req,res) {
    //show all user details and project feedback
    config.db.get("SELECT * FROM users WHERE id = ?",[req.params.id],function(err,user) {
        console.log(err)
        if(user) {
            if(user.type == "hirer") {
                config.db.all("SELECT * FROM projects WHERE user_id = ?",[req.params.id],function(err,projects) {
                    res.render('users/single',{singleuser:user,user:req.user,projects})
                })
            } else {
                config.db.all("SELECT * FROM projects WHERE awarded_to = ?",[req.params.id],function(err,projects) {
                    res.render('users/single',{singleuser:user,user:req.user,projects})
                })
            }
        } else {
        res.send("No such user.")
        }
    
    })

})
module.exports = router;