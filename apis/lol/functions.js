const { endpoints } = require('./endpoints')
const { versions,champions,championImg,loadingScreenImg } = endpoints
const fetch = require('node-fetch')
const LolApiConfig = require('../../models/riotApiConfig')
const bcrypt = require('bcrypt')
const salt = parseInt(process.env.SALT)

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
        const upd = await LolApiConfig.findOneAndUpdate(query,{patchVersion: toCheck},{new:true})
        return upd
    } else {
        console.log('created')
        const patchVersion = new LolApiConfig({
            patchVersion: toCheck,
            marker: true
        })
        patchVersion.save()
    }
}

const synchronizePatchVersion = async() => {
    const version = await getDDragonVersion()
    const toDisplay = (await versionChecker(version))

    return toDisplay.patchVersion
}

const appendChampionData = (version,championsList,CMObject) => {
    const modifiedCData = Object.values(championsList.data)
    .find(champion => parseInt(champion.key) === CMObject.championId)
    CMObject[modifiedCData.id] = modifiedCData
    CMObject[modifiedCData.id].image.full = championImg(version,CMObject[modifiedCData.id].image.full)
    CMObject[modifiedCData.id].image.loading = loadingScreenImg(CMObject[modifiedCData.id].id)
    return CMObject
}

const digestPassword = async (plainTextPassword) => {
    const toSend = await bcrypt.hash(plainTextPassword, salt)
    return toSend
}

const validatePassword = async (passwordToValidate) => {
    const validated = await bcrypt.compare(passwordToValidate, hash)
    return validated
}

module.exports = {
    getChampionReferences,
    synchronizePatchVersion,
    endpoints,
    appendChampionData,
    digestPassword,
    validatePassword
}