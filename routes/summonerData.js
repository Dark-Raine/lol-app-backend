const express = require('express')
const router = express.Router()
const { endpoints, getRequestParser, profileRestructure, verifySummonerCode, urlBuilder, apiResponseChecker } = require('../apis/lol/functions')
const { summonerProfile, verification, verifyAccount } = endpoints
    
    router.post('/', async function getdata(req,res)  {
        const { name } = req.body
        const url = urlBuilder(summonerProfile,name)
        const parsedData = await getRequestParser(url)
        apiResponseChecker(parsedData,res)
    })

    router.post('/masterylist', async function getdata(req,res)  {
        const { name } = req.body
        const url = urlBuilder(summonerProfile,name)
        const parsedData = await getRequestParser(url)
        apiResponseChecker(parsedData,res, profileRestructure)
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
    })

    module.exports = router