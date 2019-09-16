var express = require('express')
var app = express()
var bodyParser = require('body-parser')
const Client = require('bitcoin-core');
const dotenv = require('dotenv').config();
const https = require('https');
const fs = require('fs');
const crypto = require('crypto')
const cookie = require('cookie')
const querystring = require('querystring')
var sqlite3 = require('sqlite3').verbose()
var rawparser = bodyParser.text({ type: "*/*" })
var jsonparser = bodyParser.json()
var json = jsonparser
var cookieParser = require('cookie-parser')
var cors = require('cors')
// Redirect from http port 80 to https
var http = require('http');
http.createServer(function (req, res) {
    res.writeHead(301, { "Location": "https://" + req.headers['host'] + req.url });
    res.end();
}).listen(80);

const options = {
    cert: fs.readFileSync('/etc/letsencrypt/live/cashflow.fm/fullchain.pem'),
    key: fs.readFileSync('/etc/letsencrypt/live/cashflow.fm/privkey.pem')
};
//routes
var indexRouter = require('./routes/index')
var invoiceRouter = require('./routes/invoice')
var shopifyRouter = require('./routes/shopify')
var transactionsRouter = require('./routes/transactions')


//locals
app.locals.hitcount = 0;
app.locals.db = new sqlite3.Database("gateway.db")
app.locals.secret = secret

app.locals.client = new Client({
    host: "localhost",
    password: 'DDyt3CIQtu7zrXwd7GGHU3yiSzlFW6Eu72PjH/Yol4U=',
    username: "cashflow",
    port: 8332
})
app.locals.transactions = []
app.locals.lasttx = ""
app.locals.overpaid = []
app.locals.underpaid = []
app.locals.sockets = []
app.locals.mainaddr = "1Fviwkxhh9xnFM3wQKnm62qqGdNodYM6ur"

app.use(cookieParser())
app.use(express.static('public'))

app.set('view engine', 'ejs');
app.use(cors())
app.use((req, res, next) => {
    ++hitcount;
    next()
})

app.use('/',indexRouter)
app.use('/invoice',invoiceRouter)
app.use('/shopify',shopifyRouter)
app.use('/transactions',transactionsRouter)

var server = https.createServer(options, app);
var io = require('socket.io').listen(server);



io.on('connection', function (socket) {
    sockets.push(socket)
})
//create user sqlite table if it doesnt exist, fails silently if they do exist
db.run('CREATE TABLE users(id INTEGER PRIMARY KEY, email TEXT NOT NULL, password TEXT NOT NULL)', function (err) {
    console.log(err)
})
db.run('CREATE TABLE transactions(id INTEGER PRIMARY KEY, txid TEXT NOT NULL, merchant TEXT NOT NULL,itemdesc TEXT NOT NULL, price REAL NOT NULL, address TEXT NOT NULL, returnaddr TEXT NOT NULL, posturl TEXT NOT NULL, postdata TEXT NOT NULL)', function (err) {
    console.log(err)
})
server.listen(443)
