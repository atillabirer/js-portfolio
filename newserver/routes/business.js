var express = require('express')
var router = express.Router();
const secret = "YvBp0=W^=MFo$]5";
const guard = require('express-jwt')
var sql = require('sql-query'), sqlQuery = sql.Query();

router.get('/',guard({secret: secret}),async (req,res) => {
    //get all business for that user
    try {
        const result = await req.app.locals.db.all("SELECT * FROM business WHERE user_id = ? ORDER BY id DESC",[req.user.id])
        res.json(result)
    } catch(error) {
        res.json(error)
    }
})

router.get('/all',guard({secret: secret}),async (req,res) => {
	try {
		const result = await req.app.locals.db.all("SELECT * FROM business");
		res.json(result)
	} catch(error) {

		res.json(error)
	}
})


router.get('/:id',guard({secret: secret}),async (req,res) => {
    //biz by id
    try {
        const businesses = await req.app.locals.db.get("SELECT * FROM business WHERE id = ?",req.params.id);
        if(businesses.user_id == req.user.id) {
            res.send(businesses)
        } else {
            res.json({error:"You don't have access to this business."})
        }
        res.json(businesses)
    } catch(e) {
        console.log(e)
       // res.json(e)
    }

})

router.post('/',guard({secret:secret}),async (req,res,next) => {
    //add new biz
    try {
        if(req.body.name && req.body.address) {
            const result = await req.app.locals.db.run("INSERT INTO business(name,address,user_id) VALUES(?,?,?)",[req.body.name,req.body.address,req.user.id])
            console.log(result)
            res.json({id: result.lastID})
        } else {
            res.json({error:"Missing parameters."})
            req.app.locals.sockets.forEach((socket) => {
                //for now make it just business
                socket.emit('update',{type:"business"})
            })
        }
    } catch(error) {
        console.log(error)
        res.json(error)
    }
})

router.post('/update/:id',guard({secret:secret}),async (req,res) => {
    //update business details
    try {
        const query = sqlQuery.update().into('business').set(req.body).where({id:req.params.id,user_id:req.user.id}).build()
        const result = await req.app.locals.db.run(query)
        console.log(result)
        socket.emit('update',{type:"business"})
        res.json({status: "ok"})
    } catch(error) {
        console.log(error)
        res.json(error)
    }
     
})

router.get('/delete/:id',guard({secret:secret}),async (req,res) => {
    try {
        const result = await req.app.locals.db.run("DELETE FROM business WHERE id = ? AND user_id = ?",[req.params.id,req.user.id])
        req.app.locals.sockets.forEach((socket) => {
            //for now make it just business
            socket.emit('update',{type:"business"})
        })
        res.json({status: "ok"})
    } catch(error) {
        res.json(error)
    }
})

module.exports = router;
