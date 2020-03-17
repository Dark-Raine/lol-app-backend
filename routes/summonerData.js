const express = require('express')
const router = express.Router()
const fetch = require('node-fetch')
const { endpoints, getRequestParser, profileRestructure } = require('../apis/lol/functions')
const { summonerProfile, APIAuth, verification, verifyAccount } = endpoints
    
    router.post('/', async (req,res) => {
        const { name } = req.body
        const url = `${summonerProfile}/${name}${APIAuth}`;
        getRequestParser(url)
        .then(profileRestructure)
        .then(profile => res.json(profile))
        .catch(err => res.json(err.message))
    })
    
    router.get('/verification', (req,res)=>{
        res.status(200).json(verification)
    })
    
    router.post('/verification', (req,res)=>{
        const {accountId} = req.body
        const url = verifyAccount+accountId+APIAuth
        getRequestParser(url)
        .then(summonerCode => {
            console.log(summonerCode,verification)
            const verified = summonerCode === verification
            verified ? res.status(200).json({verified}) : res.status(404).json({verified})
        })
        .catch(err => res.json({error: err.message}))
    })

    module.exports = router