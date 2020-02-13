const passport = require('passport');
const { User, validateLoginUser, validateRegisterUser } = require('../models/user.model');
require('../social/facebook-passport');
// var sess;


const login = (req, res, next) => {
    const { error } = validateLoginUser(req.body);

    if (error) return res.status(400).send(error.details[0].message);
    // if (req.session.email === req.email)
    //     return res.json({ msg: `already logged in via Id = ${req.session.email}`, user: req.session.user, token: req.session.token });

    passport.authenticate('local', { failureRedirect: '/login' }, (err, passportUser, info) => {
        if (err) {
            console.log(JSON.stringify(err) + 'here is an error !! ')
            return next(err);
        }
        if (passportUser) {
            const user = passportUser;
            // sess = req.session;
            console.log('login session = ' + JSON.stringify(req.session));
            req.session.email = req.body.email;
            console.log('sess mail = ' + req.body.email)
            user.token = passportUser.generateJWT();

            return res.json({ user: user, token: user.token });
        }
        return res.status(400).send(info);
    })(req, res, next);
};

const fbCallback = (req, res, next) => {
    console.log('in fb callback')
    if (req.session.user) {
        console.log('request session user is = ' + req.session.user + req.session.email + 'this is email' + ' ends herer !!!   ')
        return res.json({ msg: `already logged in via Email = ${req.session.email}`, user: req.session.user, token: req.session.token });
    }
    passport.authenticate('facebook', (err, user) => {
        if (err) {
            console.log('in fbLogin err')
            console.log(err)
            return next(err);
        }
        if (user) {
            console.log('user equals = ' + JSON.stringify(user));
            // sess = req.session;
            console.log('fb login sessionn = ' + JSON.stringify(req.session));
            req.session.email = user.email;
            req.session.user = user;
            const token = user.token
            console.log('reqq session after adiing user in it is = ' + req.session.user)
            console.log('req session after adding more values in it = ' + JSON.stringify(req.session) + 'ends here !!!  ')
            console.log('cookie = ' + JSON.stringify(req.cookies));
            return res.json({ message: 'successfully login via facebook', user: user, token: token })
        }
    })(req, res, next)
}

const fbLogin = (req, res, next) => {
    if (req.session.email === req.email) {
        console.log('request session user is = ' + req.session.user + req.session.email + 'this is email' + ' ends herer !!!   ')
        return res.json({ msg: `already logged in via Id = ${req.session.email}`, user: req.session.user, token: req.session.token });
    }
    console.log('in fb login !! ')
    passport.authenticate('facebook',
        { authType: 'reauthenticate', scope: ['email', 'user_friends'] })(req, res, next);
}

const twitterLogin = (req, res, next) => {
    passport.authenticate('twitter', { scope: ['email', 'photos'] })(req, res, next);
}

const twitterCallback = (req, res, next) => {
    // if (err) return next(err)
    passport.authenticate('twitter', { authType: 'reauthenticate', failureRedirect: '/login', }, (err, user) => {
        if (err) return next(err);
        if (user) return res.json({ msg: ' successfully login via twitter.', user: user })
    })(req, res, next);
}

const googleCallback = (req, res, next) => {
    console.log('in google login !! ')
    passport.authenticate('google', {
        failureRedirect: '/', successRedirect: '/profile'
    }, (err, user) => {
        if (err) {
            console.log(err);
            return next(err);
        }
        if (user) return res.json({ msg: 'successfully login via google account.', user: user })
    })(req, res, next);
}

const googleLogin = (req, res, next) => {
    passport.authenticate('google', {
        authType: 'reauthenticate', scope: ['https://www.googleapis.com/auth/userinfo.email',
            'profile']
    })(req, res, next);
}

const gitCallback = (req, res, next) => {
    passport.authenticate('github', { failureRedirect: '/login' }, (err, user) => {
        if (err) return next(err);
        if (user) return res.json({ msg: 'successfully login via github.', user: user });
    })(req, res, next)
}

const gitLogin = (req, res, next) => {
    passport.authenticate('github', { authType: 'reauthenticate', scope: ['email'] })(req, res, next);
}



const register = async (req, res) => {
    const { error } = validateRegisterUser(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let userExist = await User.findOne({ email: req.body.email });
    if (userExist) return res.status(400).json({ message: 'user already registered with this id.' });

    const user = new User(req.body);

    await user.setPassword(user.password);

    await user.save();

    user.token = user.generateJWT();

    return res.json({ user: user, token: user.token, message: 'successfully registered.' })
}


const get = (req, res) => {
    // sess = req.session;
    console.log('sess mail in get = ' + req.session.email);
    console.log('req session in get = ' + JSON.stringify(req.session, null, 4));
    if (req.session.email) {
        return res.json({ msg: 'welcome.' })
    }
}

const update = (req, res) => {
    user.findOne({ _id: req.params.id })
        .then(user => {
            const {
                name,
                email
            } = req.body
            user.name = name,
                user.email = email
            return user.save();
        })
        .then(user => {
            return res.json({ msg: `user with id = ${user._id}, is successfully updated.`, user: user })
        })
        .catch(err => console.log(err))
}
const logout = (req, res) => {
    res.render('home');
}


module.exports = {
    register,
    login,
    get,
    update,
    fbLogin,
    fbCallback,
    twitterCallback,
    twitterLogin,
    googleCallback,
    googleLogin,
    gitLogin,
    gitCallback,
    logout
};
