const environment = require('./environment')
const app = environment.config()
const fetch = require('node-fetch')
const mongoose = require('mongoose')
const port = 3001
const {getChampionReferences, synchronizePatchVersion,endpoints,appendChampionData} = require('./apis/lol/functions')
const { summonerProfile,summonerCM, APIAuth, loadingScreenImg, profileIcon,championImg } = endpoints

const main = async () => {
    let version = await synchronizePatchVersion()
    let championsList = await getChampionReferences(version)

    app.post('/', (req,res) => {
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
   
    app.listen(port)
    console.log(`online on port ${port}`)
    console.log(`Patch version  ${version}`)
}
mongoose.connect('mongodb://127.0.0.1:27017/lolfl',{ useNewUrlParser: true,  useUnifiedTopology: true,useFindAndModify: false  }, ()=> {
    console.log('connected!')
    // version =  synchronizePatchVersion() 
})

main()