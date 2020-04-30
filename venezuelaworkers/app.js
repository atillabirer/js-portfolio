var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var config = require('./config')
var passport = require('passport')
var flash = require('express-flash')
var bcrypt = require('bcrypt')

var Strategy = require('passport-local').Strategy

passport.use(new Strategy(
  (username,password,cb) => {
    //check if user exists then if password and hash match
    config.db.get("SELECT * FROM users WHERE username = ?",[username],(err,row) => {
      //if user exists, check hash
      if(err) {
        return cb(err,false)
      }
      if(row) {
        bcrypt.compare(password,row.password).then((hash) => {
          if(hash) {
            return cb(null,row)
          } else {
            return cb(null,false,{message:"Wrong username or password."})
          }
        })
      } else {
        return cb(null,false,{message:"No such user."})
      }
    })
  }
));
passport.serializeUser(function(user, cb) {
  cb(null, user.id);
});

passport.deserializeUser(function(id, cb) {

  config.db.get("SELECT * FROM users WHERE id = ?",[id],(err,row) => {

    if(err) { return cb(err,false) }
    if(!row) { return cb(null,false)}
    return cb(null,row)
  
  })

});


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var projectsRouter = require('./routes/projects')
var bidsRouter = require('./routes/bids')
var conversationsRouter = require('./routes/conversations')
var financesRouter = require('./routes/finances')
var feedbackRouter = require('./routes/feedback')
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(require('express-session')({ secret: '', resave: false, saveUninitialized: true }));
app.use(flash())

// Initialize Passport and restore authentication state, if any, from the
// session.
app.use(passport.initialize());
app.use(passport.session());

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/projects',projectsRouter)
app.use('/bids',bidsRouter)
app.use('/conversations',conversationsRouter)
app.use('/finances',financesRouter)
app.use('/feedback',feedbackRouter)
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
