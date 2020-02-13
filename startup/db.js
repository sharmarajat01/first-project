const mongoose = require('mongoose')
const config = require('config');

module.exports= ()=>{
    const db = config.get('MONGODB-URI');

    const confg = {
        useNewUrlParser  :true,
        useFindAndModify  : false,
        useCreateIndex : true
    }
    mongoose.connect(db, confg)
    .then(console.log(`mongoDb connected at ${db}`))
    .catch(err => console.log(err))
}