const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const constant = require("./constants.js")
const _ = require('lodash')

var mongooseUrl = process.env.NODE_ENV == 'dev' ? constant.mongooseUrlDev : constant.mongooseUrlProduction
var port = process.env.NODE_ENV == 'dev' ? constant.portDev : constant.portProd
console.log(mongooseUrl)

mongoose.connect(mongooseUrl, {
    useUnifiedTopology: true,
    useNewUrlParser: true
})

const app = express()
app.all('*', function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild')
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS')

    if (req.method == 'OPTIONS') {
        res.send(200)
    } else {
        next()
    }
})
app.use(bodyParser.urlencoded({
    limit: "50mb",
    extended: true
}))
app.use(bodyParser.json({ limit: "50mb" }))

// routes
setRoutes()

app.listen(port, () => {
    console.log('Server is already setup, port: ' + port);
})

function setRoutes() {
    app.use(require("./routes/novel"))
    app.use(require("./routes/volume"))
    app.use(require("./routes/chapter"))
    app.use(require("./routes/novelVersion"))
}