const express = require('express');
const app = express();
const config = require('config');
const cookieParser = require('cookie-parser');
const request = require('request-promise');
const bodyParser = require('body-parser');
// const authKey = require('./socialAuth/auth').facebookAuth;

app.use(bodyParser.json());
app.set('view engine','ejs');
app.get('/',(req,res)=>{
    res.render('home');
})

app.use(cookieParser());
// app.post('/facebook-search', (req, res) => {

//     const userFieldSet = 'name, link, is_verified, picture';

//     //const  { queryTerm, searchType } = req.body;
//     const temp ={
//          clientId : "321812678764228",
//          client_secret : "e5f8ae3f56f766acd38296ce647429d6"
//     }
//     const options = {
//       method: 'GET',
//       uri: 'https://graph.facebook.com/search',
//       qs: {
//         access_token: "321812678764228",
//         query: 'fiat',
//         type: 'user',
//         fields: userFieldSet
//       }
//     };
//     request(options)
//     .then(fbRes => {
// // Search results are in the data property of the response.
// // There is another property that allows for pagination of results.
// // Pagination will not be covered in this post,
// // so we only need the data property of the parsed response.
//       const parsedRes = JSON.parse(fbRes).data; 
//       res.json(parsedRes);
//     })
//     .catch(err=> console.log(err));
// });

require('./startup/config')();
require('./startup/db')();
require('./startup/cors')(app);
require('./startup/passport')(app);
require('./startup/session')(app);
require('./startup/routes')(app);


const port = process.env.PORT || config.get('PORT');

const server = app.listen(port, ()=>{
    console.log(`listening to port ${port}...`)
});

module.exports= server;