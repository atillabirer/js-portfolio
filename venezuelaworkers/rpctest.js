var config = require('./config')
config.rpc.getInfo().then((response,err) => {
console.log(response)
}).catch((err) => {

console.log(err)
})
