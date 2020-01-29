const environment = require('./environment')
const app = environment.config()
const mongoose = require('mongoose')
const summonerDataRoutes = require('./routes/summonerData')
const userRoutes = require('./routes/userroutes')
const port = 3001

app.use('/summonerdata', summonerDataRoutes)
app.use('/users', userRoutes)
app.listen(port)
console.log(`online on port ${port}`)
    

mongoose.connect('mongodb://127.0.0.1:27017/lolfl',{ useNewUrlParser: true,  useUnifiedTopology: true,useFindAndModify: false  }, ()=> {
    console.log('connected!')

})
