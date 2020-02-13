// const config = require('config');
// const key = config.get('SESSION_SECRET');

const sessionCheck = (req, res, next) => {
    if (req.session.user && req.cookies.key) {
        console.log('req session -- ' +JSON.stringify(req.session) +'cookie key -- ' +JSON.stringify(req.cookies) )
        res.redirect('/dashboard');
    } else
        next();
};

module.exports = sessionCheck;