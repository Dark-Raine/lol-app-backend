const express = require('express')
const router = express.Router()
const { endpoints, getRequestParser, profileRestructure, verifySummonerCode, urlBuilder } = require('../apis/lol/functions')
const { summonerProfile, verification, verifyAccount } = endpoints
    
    router.post('/', (req,res) => {
        const { name } = req.body
        const url = urlBuilder(summonerProfile,name)
        getRequestParser(url)
        .then(profileRestructure)
        .then(profile => res.json(profile))
        .catch(err => res.json(err.message))
    })
    
    router.get('/verification', (req,res)=>{
        res.status(200).json(verification)
    })
    
    router.post('/verification', async (req,res)=>{
        const {accountId} = req.body
        const url = urlBuilder(verifyAccount,accountId)
        const summonerCode = await getRequestParser(url)
        const verified = await verifySummonerCode(summonerCode)
        verified ? res.status(200).json({verified}) : res.status(404).json({verified})
        
        // .catch(err => res.json({error: err.message}))
    })

    module.exports = router