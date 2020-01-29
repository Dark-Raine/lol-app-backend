const {endpoints} = require('./apis/lol/endpoints')
const fetch = require('node-fetch')

test('expect the versions endpoint to be defined', ()=> {
    expect(endpoints.versions).toBeDefined()
})

test('expect the versions endpoint response code to be 200', async ()=>{
    const statusCode = await fetch(endpoints.versions).then(res => res.status)

    expect(statusCode).toBe(200)
})

test('expect the versions endpoint response to be an array', async ()=>{
    const response = await fetch(endpoints.versions).then(res => res.json())

    expect(typeof response).toBe(typeof [])
})
