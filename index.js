const environment = require('./environment')
const app = environment.config()
const fetch = require('node-fetch')
const mongoose = require('mongoose')
const port = 3001
const { summonerProfile,summonerCM, APIAuth, loadingScreenImg, profileIcon } = require('./apis/lol/endpoints')
const {setDDragonVersion,getChampionReferences, synchronizePatchVersion} = require('./apis/lol/functions')

const main = async () => {
    let version = await setDDragonVersion()
    let championsList = await getChampionReferences(version)
    const championImg = champion => `http://ddragon.leagueoflegends.com/cdn/${version}/img/champion/${champion}`
    
    const appendChampionData = CMObject => {
        CMObject.championId = Object.values(championsList.data)
        .find(champion => parseInt(champion.key) === CMObject.championId)
        CMObject.championId.image.full = championImg(CMObject.championId.image.full)
        CMObject.championId.image.loading = loadingScreenImg(CMObject.championId.id)
        return CMObject
    }

    app.post('/', (req,res) => {
        const { name } = req.body
        const url = `${summonerProfile}/${name}${APIAuth}`;
        fetch(url)
        .then(resp => resp.json())
        .then(profile => {
            return fetch(summonerCM+profile.id+APIAuth)
            .then(resp => resp.json())
            .then(CMObject => {
                CMObject = Object.values(CMObject).map(champion => appendChampionData(champion))
                profile.CMList = CMObject
                profile.profileIconId = profileIcon(version)+profile.profileIconId+".png"
                return profile
            })
            .then(() => profile)
        })
        .then(profile => res.json(profile))
        .catch(err => res.json(err.message))
    })

    mongoose.connect('mongodb://127.0.0.1:27017/lolfl',{ useNewUrlParser: true,  useUnifiedTopology: true,useFindAndModify: false  }, ()=> {
        console.log('connected!')
        synchronizePatchVersion()
    })

    
    app.listen(port)
    console.log(`online on port ${port}`)
    console.log(`Patch version  ${version}`)
}

main()