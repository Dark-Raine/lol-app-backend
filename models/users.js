const mongoose = require('mongoose')

const CMO = {
    championId:{
        type: Number,
        required: true
    },
    championData:{
        type: {},
        required: true
    }
}

const users = mongoose.Schema({
    summonerId:{ 
        type: String,
        required: true
    },
    date_created:{ 
        type: Date, 
        default: Date.now 
    },
    name:{
        type: String
    },
    profileIcon:{
        type: String,
        required: true
    },
    CMList:{
        type: [CMO],
        required: true
    },
    username:{
        type: String,
        unique: true,
        required: true
    }
})


module.exports = mongoose.model('users', users)