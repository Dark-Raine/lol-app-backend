const beginApp = () => {
    const express = require('express')
    const app = express()
    const cors = require('cors')
    const bodyParser = require('body-parser')
    require('dotenv').config()
    app.use(cors())
    app.use(bodyParser.json())
    return app
}

module.exports = {
    config: beginApp
}