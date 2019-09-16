var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken')
var guard = require('express-jwt')
var bcrypt = require('bcrypt')
const secret = "YvBp0=W^=MFo$]5";

/* GET home page. */
router.get('/',(req,res) => {
  res.json({error: "See API documentation for more"})
})

router.get('/register',(req,res) => {
  res.json({error:"Use a POST request on /register with the username and password parameters to register an account."})
})

router.post('/register',async (req,res) => {
  //add user in the database
  if(req.body.username && req.body.password && req.body.type) {
    if((req.body.type == "client") || (req.body.type == "business")) {
      
      bcrypt.hash(req.body.password,10,async (err,hash) => {
        const result = await req.app.locals.db.run("INSERT INTO user(username,password,type) VALUES(?,?,?)",[req.body.username,hash,req.body.type])
        res.json({result:"ok"})
      })
      
    } else {
      res.json({error:"Invalid Type"})
      res.end()
    }
  } else {
    res.json({error:"Missing parameters"})
  }
})
router.post('/token',async (req,res) => {
  //get token or rejection based on credentials
  if(req.body.username && req.body.password) {
    const result = await req.app.locals.db.get("SELECT * FROM user WHERE username = ?",[req.body.username])
    bcrypt.compare(req.body.password,result.password).then((result) => {
      if(result) {
        //send token here
        res.json({token:jwt.sign({id: result.id},req.app.locals.secret)})
      } else {
        //fail
        res.json({error:"Username or password incorrect"})
      }  
    })
    
  } else {
    res.json({error:"Missing parameters"})
    res.end()
  }
})

router.post('/test',guard({secret:secret}),async (req,res) => {
  res.json(req.user)
})

module.exports = router;
