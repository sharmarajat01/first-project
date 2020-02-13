const session = require('express-session');
const config = require('config')

module.exports = app => {
    console.log('in session part...')
    const key = config.get('SESSION_SECRET');
    app.use(session({
        secret: key,
        saveUninitialized: true,
        resave: true,
        cookie: {
            expires: 600000
        }
    }))

    // app.use((req, res, next) => {
    //     if (req.cookies.key === 'undefined')
    //     {
    //         console.log('in cookie key undefined..')
    //         return next();}
    //     else if (!req.session.user) {
    //         console.log('no user found');
    //         res.clearCookie();
    //         console.log('user not found .. requst session is  = '+JSON.stringify(req.session))
    //         return next();
    //     }
    //     else if(req.session.user){
    //         console.log('req session eq = ' +JSON.stringify(req.session) +'end here !!!!!      ')
    //         res.json({msg : 'already signed in.'})
    //         return next();
    //     }
    //     console.log('didnt get any session and key.' +JSON.stringify(req.cookies.connect));
    //     next();
    // })
}