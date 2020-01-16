module.exports = {
    versions: 'https://ddragon.leagueoflegends.com/api/versions.json',
    champions: (version) => `http://ddragon.leagueoflegends.com/cdn/${version}/data/en_GB/champion.json`,
    summonerProfile: 'https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-name',
    summonerCM: 'https://euw1.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-summoner/',
    APIAuth: `?api_key=${process.env.APIKEY}`,
    loadingScreenImg: name => `http://ddragon.leagueoflegends.com/cdn/img/champion/loading/${name}_0.jpg`,
    profileIcon: version => `http://ddragon.leagueoflegends.com/cdn/${version}/img/profileicon/`
}