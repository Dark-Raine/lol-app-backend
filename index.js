const express = require('express')
const app = express()
const fetch = require('node-fetch')
const cors = require('cors')
const bodyParser = require('body-parser')
const port = 3001
app.use(cors())
app.use(bodyParser.json())



const setDDragonVersion =  async () => {
    return fetch('https://ddragon.leagueoflegends.com/api/versions.json')
    .then(resp => resp.json())
    .then(vList => vList[0])
}
const main = async () => {
    let version = await setDDragonVersion()
    const APIKEY = 'RGAPI-24ffee70-3ad6-4a58-aa19-a14bb586555f'
    const APIQuery = `?api_key=${APIKEY}`
    const summonerProfile = 'https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-name'
    const profileIcon = `http://ddragon.leagueoflegends.com/cdn/${version}/img/profileicon/`
    const summonerCM = 'https://euw1.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-summoner/'

    const championImg = champion => `http://ddragon.leagueoflegends.com/cdn/${version}/img/champion/${champion}`
    const loadingScreenImg = name => `http://ddragon.leagueoflegends.com/cdn/img/champion/loading/${name}_0.jpg`
    
    const getChampionReferences = async () => {
        return fetch(`http://ddragon.leagueoflegends.com/cdn/${version}/data/en_GB/champion.json`)
        .then(resp => resp.json())
    } 
    let championsList = await getChampionReferences()

    const appendChampionData = CMObject => {
        CMObject.championId = Object.values(championsList.data)
        .find(champion => parseInt(champion.key) === CMObject.championId)
        CMObject.championId.image.full = championImg(CMObject.championId.image.full)
        CMObject.championId.image.loading = loadingScreenImg(CMObject.championId.id)
        return CMObject
        
    }
    

    
    
    app.get('/', (req,res) => {
        // console.log(req)
        res.json({message: 'hello'})
    })
    app.post('/', (req,res) => {
        const { name } = req.body
        const url = `${summonerProfile}/${name}?api_key=${APIKEY}`;
        // console.log(` that goddamn url ${url}`)
        fetch(url)
        .then(resp => resp.json())
        .then(profile => {
            return fetch(summonerCM+profile.id+APIQuery)
            .then(resp => resp.json())
            .then(CMObject => {
                // console.log(CMObject)
                CMObject = Object.values(CMObject).map(champion => appendChampionData(champion))
                profile.CMList = CMObject
                profile.profileIconId = profileIcon+profile.profileIconId+".png"
                return profile
            })
            .then(() => profile)
        })
        .then(profile => res.json(profile))
    })
    
    app.listen(port)
    console.log(`online on port ${port}`)
    console.log(`Patch version  ${version}`)
    // console.log(`Champions  ${Object.keys(championsList.data)}`)
    // console.log(version)
    setInterval(async() => {
        version = await setDDragonVersion()
    }, 1209600000)
}

main()