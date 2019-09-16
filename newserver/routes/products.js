var express = require('express')
var router = express.Router();
var sql = require('sql-query'), sqlQuery = sql.Query();
const guard = require('express-jwt')
const secret = "YvBp0=W^=MFo$]5";


router.get('/',function(req,res) {
    res.json({error:"You must specify a business id. Check documentation of /products/business/:id  route for details"})
})

router.get('/business/:id',guard({secret:secret}),async (req,res) => {
    //get all products by business id
    try {
        const products = await req.app.locals.db.all("SELECT * FROM products WHERE business_id = ? ORDER BY id DESC",req.params.id)
        res.json(products)
    } catch(error) {
        res.json(error)
    }
})

router.get('/:id',guard({secret:secret}),async (req,res) => {
    try {
        const product = await req.app.locals.db.get("SELECT business.name,products.* FROM products INNER JOIN business ON business_id = products.business_id WHERE products.id = ?",req.params.id)
        console.log(product)
        res.json(product)
    } catch(error) {
	    console.log(error)
        res.json(error)
    }

})

router.post('/',guard({secret:secret}),async (req,res) => {
    //post a product under business id
    try {
        const result = await req.app.locals.db.run("INSERT INTO products(business_id, price, description, picture,processing_time) VALUES(?,?,?,?,?)",[
            req.body.business_id,
            req.body.price,
            req.body.description,
            req.body.picture,
		req.body.processing_time
        ])
        req.app.locals.sockets.forEach((socket) => {
            //for now make it just products
            socket.emit('create',{type:"products",id:result.lastID})
        })
        res.json({id: result.lastID})

    } catch(error) {
        
        res.json(error)
    
    }
})

router.post('/update/:id',guard({secret:secret}),async (req,res) => {
    
    var query = sqlQuery.update().into('products').set(req.body).where({id:req.params.id}).build()

    try {
        console.log(query)
        const result = await req.app.locals.db.run(query)
        req.app.locals.sockets.forEach((socket) => {
            //for now make it just products
            socket.emit('update',{type:"products",id:req.params.id})
        })
        res.json(result)
    } catch(error) {
        console.log(error)
        res.json({error})
    }

})

router.post('/process/:id',guard({secret:secret}),async (req,res) => {
    //add processing date
        req.app.locals.sockets.forEach((socket) => {
            //for now make it just products
            socket.emit('processing',{id:req.params.id})
        })
	res.json({result:"ok"})

})

router.post('/endprocess/:id',guard({secret:secret}),async (req,res) => {
	//insert todays date as the processing date and emit signal
	try {
		const result = await req.app.locals.db.run("UPDATE products SET processing_date = ?,active = 1 WHERE id = ?",[Math.floor(Date.now() / 1000),req.params.id])
		res.json({result:"ok"})
		req.app.locals.sockets.forEach((socket) => {
			socket.emit('endprocessing',{id:req.params.id})
		})

	}
	catch(error) {
		console.log(error)
		res.json({error})
	}
})

router.get('/delete/:id',guard({secret:secret}),async (req,res) => {

    try {
        const result = await req.app.locals.db.run("DELETE FROM products WHERE id = ?",[req.params.id])
        res.json({result: "ok"})
	req.app.locals.sockets.forEach((socket) => {
            //for now make it just products
            socket.emit('delete',{id:req.params.id})
        })
    } catch(error) {
        console.log(error)
        res.json(error)
    }
})

router.get('/shelf/:id',guard({secret:secret}),async(req,res) => {
	try {
		const result = await req.app.locals.db.run("UPDATE products set shelf=1 where id=?",[req.params.id])
		res.json({result:"ok"})
		req.app.locals.sockets.forEach((socket) => {
			socket.emit('update',{id:req.params.id})
		})
	} catch(error) {
		console.log(error)
		res.json(error)
	}
})

router.get('/unshelf/:id',guard({secret:secret}),async(req,res) => {
        try {
                const result = await req.app.locals.db.run("UPDATE products set shelf=0 where id=?",[req.params.id])
                res.json({result:"ok"})
                req.app.locals.sockets.forEach((socket) => {
                        socket.emit('update',{id:req.params.id})
                })
        } catch(error) {
                console.log(error)
                res.json(error)
        }
})

module.exports = router;
