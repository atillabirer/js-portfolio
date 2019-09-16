var sqlite3 = require('sqlite3').verbose()
var bcrypt = require('bcrypt')
var db = new sqlite3.Database("venezuelaworkers")
var Client = require('bitcoin-core')
var rpc = new Client({username:"user",password:"carlosmatos123"})
module.exports = {
    db,
    password: "gqNjhpakzL",
    rpc
}