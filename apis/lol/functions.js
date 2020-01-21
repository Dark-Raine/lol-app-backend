const { endpoints } = require('./endpoints')
const { versions,champions,championImg,loadingScreenImg } = endpoints
const fetch = require('node-fetch')
const LolApiConfig = require('../../models/riotApiConfig')

const getDDragonVersion =  async () => {
    return fetch(versions)
    .then(resp => resp.json())
    .then(vList => vList[0])
}

const getChampionReferences = async (version) => {
    return fetch(champions(version))
    .then(resp => resp.json())
}

const versionChecker = async(toCheck) => {
    const query = {marker: true}
    if ((await LolApiConfig.find(query)).length === 1) {
        // console.log('found')
        const upd = await LolApiConfig.findOneAndUpdate(query,{patchVersion: toCheck})
        return upd
    } else {
        console.log('created')
        const patchVersion = new LolApiConfig({
            patchVersion: toCheck,
            marker: true
        })
        patchVersion.save()
        // console.log(patchVersion)
    }
}

const synchronizePatchVersion = async() => {
    const version = await getDDragonVersion()
    const toDisplay = (await versionChecker(version))

    return toDisplay.patchVersion
}

const appendChampionData = (version,championsList,CMObject) => {
    CMObject.championId = Object.values(championsList.data)
    .find(champion => parseInt(champion.key) === CMObject.championId)
    CMObject.championId.image.full = championImg(version,CMObject.championId.image.full)
    CMObject.championId.image.loading = loadingScreenImg(CMObject.championId.id)
    return CMObject
}

module.exports = {
    getChampionReferences,
    synchronizePatchVersion,
    endpoints,
    appendChampionData
}