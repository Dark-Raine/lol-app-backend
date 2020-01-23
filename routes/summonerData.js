const express = require('express')
const router = express.Router()
const fetch = require('node-fetch')
const { getChampionReferences, synchronizePatchVersion,endpoints,appendChampionData } = require('../apis/lol/functions')
const { summonerProfile,summonerCM, APIAuth, profileIcon,verification,verifyAccount } = endpoints
    
    router.post('/', async (req,res) => {
        let version = await synchronizePatchVersion()
        let championsList = await getChampionReferences(version)
        const { name } = req.body
        const url = `${summonerProfile}/${name}${APIAuth}`;
        fetch(url)
        .then(resp => resp.json())
        .then(profile => {
            return fetch(summonerCM+profile.id+APIAuth)
            .then(resp => resp.json())
            .then(CMObject => {
                // console.log(CMObject)
                CMObject = Object.values(CMObject).map(champion => appendChampionData(version,championsList,champion))
                profile.CMList = CMObject
                profile.profileIconId = profileIcon(version)+profile.profileIconId+".png"
                return profile
            })
            .then(() => profile)
        })
        .then(profile => res.json(profile))
        .catch(err => res.json(err.message))
    })
    
    router.get('/verification', (req,res)=>{
        res.status(200).json(verification)
    })
    
    router.post('/verification', (req,res)=>{
        const {accountId} = req.body
        const url = verifyAccount+accountId+APIAuth
        console.log(url)
        fetch(verifyAccount+accountId+APIAuth)
        .then(resp => resp.json())
        .then(summonerCode => {
            console.log(summonerCode,verification)
            const verified = summonerCode === verification
            verified ? res.status(200).json({verified}) : res.status(404).json({verified})
        })
        .catch(err => res.json(err.message))
    })

    module.exports = router