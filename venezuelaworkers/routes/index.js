var express = require('express');
var passport = require('passport')
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index',{user:req.user,message: req.flash('error')})
});

module.exports = router;
