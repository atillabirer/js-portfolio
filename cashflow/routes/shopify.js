var nonce = require('nonce')()
var express = require('express')
var request = require('request-promise')
var router = express.Router()
var sendmail = require('sendmail')()


var secret = "jtmNM2KcFh"
var jwt = require('express-jwt')({ secret: secret })
var jsonparser = bodyParser.json()
var jsonwebtoken = require('jsonwebtoken')
var json = jsonparser

router.get('/', (req, res) => {
    const shop = req.query.shop;
    if (shop) {
        const state = nonce();
        const redirectUri = forwardingAddress + '/shopify/callback';
        const installUrl = 'https://' + shop +
            '/admin/oauth/authorize?client_id=' + apiKey +
            '&scope=' + scopes +
            '&state=' + state +
            '&redirect_uri=' + redirectUri;

        res.cookie('state', state);
        res.redirect(installUrl);
    } else {
        return res.status(400).send('Missing shop parameter. Please add ?shop=your-development-shop.myshopify.com to your request');
    }
});

router.post('/ordercb', json, (req, res) => {
    //create a transaction with product description + qty plus price in BCH,set the posturl as paidcb
    //and postdata the fields of shop, order id
    console.log(req.body)
    console.log(req.headers)
    var price = 0;
    request.get("https://api.bitfinex.com/v2/tickers?symbols=tBCHUSD").then((response) => {
        let bfnx = JSON.parse(response)[0][1] //bch price from bitfinex
        console.log(bfnx)
        let pct = bfnx / 1000 //get the value of 0.001
        console.log(pct)
        let ppc = req.body.total_price_usd //product price
        console.log(ppc)
        price = (ppc / pct * 0.001).toFixed(8)
        console.log(price)
        request.post("https://cashflow.fm/transactions", {
        headers: {
            Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InNob3BpZnlAY2FzaGZsb3cuZm0iLCJwYXNzd29yZCI6Ik5pZ2dlcnMxLEAiLCJpYXQiOjE1Mjk2MzkwOTQsImV4cCI6MTUzMDI0Mzg5NH0.for8bDFS68f4vSgROyIYjn9rDnNFtg_v4Rn7bsIRBSo"
        },
        body: {
            price: price,
            itemdesc: "Order with No " + req.body.name,
            returnaddr: returnaddr,
            postdata: JSON.stringify({ order_id: req.body.id, shop: req.headers["x-shopify-shop-domain"] }),
            posturl: forwardingAddress + "/paidcb"
        },
        json: true
    }).then(function (response) {
        if (!response.address) {
            console.log(response)
            res.end()
        } else {
            //send an invoice email to that address
            sendmail({
                to: req.body.email,
                from: "invoice@cashflow.fm",
                subject: "Your Bitcoin Cash Invoice",
                html: `<a href='https://cashflow.fm/invoice/${response.address}'>Invoice Here</a>`
            }, function (err, reply) {
                if (err) console.log(err)
                if (reply) console.log(reply)
            })
            res.end()
        }
    }).catch(function (error) {
        console.log(error)
        res.end()
    })
    }).catch((error) => {
        console.log("Error getting Bitfinex price to calculate price, exiting...");
        return
    })

    
})

router.get('/callback', (req, res) => {
    const { shop, hmac, code, state } = req.query;
    const stateCookie = cookie.parse(req.headers.cookie).state;

    if (state !== stateCookie) {
        return res.status(403).send('Request origin cannot be verified');
    }

    if (shop && hmac && code) {
        // DONE: Validate request is from Shopify
        const map = Object.assign({}, req.query);
        delete map['signature'];
        delete map['hmac'];
        const message = querystring.stringify(map);
        const providedHmac = Buffer.from(hmac, 'utf-8');
        const generatedHash = Buffer.from(
            crypto
                .createHmac('sha256', apiSecret)
                .update(message)
                .digest('hex'),
            'utf-8'
        );
        let hashEquals = false;

        try {
            hashEquals = crypto.timingSafeEqual(generatedHash, providedHmac)
        } catch (e) {
            hashEquals = false;
        };

        if (!hashEquals) {
            return res.status(400).send('HMAC validation failed');
        }

        const accessTokenRequestUrl = 'https://' + shop + '/admin/oauth/access_token';
        const accessTokenPayload = {
            client_id: apiKey,
            client_secret: apiSecret,
            code,
        };

        request.post(accessTokenRequestUrl, { json: accessTokenPayload })
            .then((accessTokenResponse) => {
                const accessToken = accessTokenResponse.access_token;
                //register the order webhook
                const shopRequestUrl = 'https://' + shop + '/admin/webhooks.json';
                const shopRequestHeaders = {
                    'X-Shopify-Access-Token': accessToken,
                };
                request.post(shopRequestUrl, {
                    headers: shopRequestHeaders,
                    body: {
                        "webhook": {
                            topic: "orders/create",
                            address: forwardingAddress + "/ordercb",
                            format: "json"
                        }
                    },
                    json: true
                }).then(function (response) {
                    console.log(response)
                    res.redirect("https://" + shop + "/admin")

                }).catch(function (error) {
                    console.log(error)
                    res.end()
                })
            })
            .catch((error) => {
                console.log(error)
                res.status(error.statusCode).send(error.error_description);
            });

    } else {
        res.status(400).send('Required parameters missing');
    }
});

module.exports = router;