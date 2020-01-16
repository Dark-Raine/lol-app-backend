const mongoose = require('mongoose')

const riotApiConfigSchema = mongoose.Schema({
    patchVersion:{
        type: String,
        required: true
    },
    marker:{
        type: Boolean,
        required: true
    }
})

module.exports = mongoose.model('riot_api_config',riotApiConfigSchema)