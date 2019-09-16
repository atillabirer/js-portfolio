var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var sqlite = require('sqlite')
var sock = require('socket.io')();
var methodOverride = require('method-override')

var indexRouter = require('./routes/index');
var businessRouter = require('./routes/business')
var productsRouter = require('./routes/products')

var app = express();

app.use(methodOverride())
app.use(logger('dev'));
app.use(express.json({limit:"50mb"}));
app.use(express.urlencoded({extended: false}))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')));
app.sock = sock;
app.locals.sockets = []

app.sock.on('connection',(socket) => {
    socket.emit('message','welcome')
    app.locals.sockets.push(socket)

})

sqlite.open("./matias.sqlite").then((db) => {
    app.locals.db = db;
}).catch((error) => {
    console.log(error)
})

//for
app.locals.secret = "YvBp0=W^=MFo$]5";

app.use('/', indexRouter);
app.use('/business',businessRouter)
app.use('/products',productsRouter)

app.use(function (err, req, res, next) {
    console.error(err.stack)
    res.status(500).json(err)
  })
  
  
module.exports = app;
