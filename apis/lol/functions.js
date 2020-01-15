const { versions, champions } = require('./endpoints')
const fetch = require('node-fetch')
const LolApiConfig = require('../../models/riotApiConfig')

const setDDragonVersion =  async () => {
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
    const eval = await LolApiConfig.find(query)
    if ((await LolApiConfig.find(query)).length === 1) {
        console.log('found')
        const upd = await LolApiConfig.findOneAndUpdate(query,{patchVersion: toCheck})
        return upd
    } else {
        console.log('created')
        const patchVersion = new LolApiConfig({
            patchVersion: toCheck,
            marker: true
        })
        patchVersion.save()
        console.log(patchVersion)
    }
}

const synchronizePatchVersion = async() => {
    const version = await fetch(versions)
    .then(resp => resp.json())
    .then(vList => vList[0])

    // console.log(version)
    const toDisplay = await versionChecker(version)
    console.log(toDisplay)
}

module.exports = {
    setDDragonVersion,
    getChampionReferences,
    synchronizePatchVersion
}