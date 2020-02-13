const passport = require('passport');
const facebookStrategy = require('passport-facebook').Strategy;
const twitterStrategy = require('passport-twitter').Strategy;
const googleStrategy = require('passport-google-oauth').OAuth2Strategy;
const githubStrategy = require('passport-github').Strategy;
const User = require('../models/user.model').User;
const auth = require('../socialAuth/auth');


const apiKey = auth.facebookAuth.FACEBOOK_API_KEY;
const secretKey = auth.facebookAuth.FACEBOOK_SECRET_KEY;
const callbackUrl = auth.facebookAuth.CALLBACK_URL;

const twitterApi = auth.twitterAuth.TWITTER_API_KEY;
const twitterSecret = auth.twitterAuth.TWITTER_SECRET_KEY;
const twitterCallbackUrl = auth.twitterAuth.TWITTER_CALLBACK_URL;

const googleClientId = auth.googleAuth.GOOGLE_CLIENT_ID;
const googleClientSecret = auth.googleAuth.GOOGLE_SECRET_ID;
const googleCallback = auth.googleAuth.GOOGLE_CALLBACK_URL;

const gitClientId = auth.githubAuth.GIT_CLIENT_ID;
const gitSecretId = auth.githubAuth.GIT_SECRET_ID;
const gitCallback = auth.githubAuth.GIT_CALLBACK;


console.log(secretKey + 'this is secret key')
console.log('facebook callback on ' + callbackUrl)
console.log('twitter callback on ' + twitterCallbackUrl)
console.log('google callback on ' + googleCallback)
console.log('giithub callback on ' +gitCallback)
passport.use(new facebookStrategy({
    clientID: apiKey,
    clientSecret: secretKey,
    callbackURL: callbackUrl,
    profileFields: ['id', 'displayName', 'email','photos']
},
    async function (accessToken, refreshToken, profile, done) {
        await User.findOne({ 'id': profile.id }, (err, user) => {
            if (err) return done(err);
            if (user) return done(null, user);
            else {
                console.log(JSON.stringify(user));
                // console.log('profile ----------------------------- ' + JSON.stringify(profile));
                const newUser = new User();
                newUser.id = profile.id;
                newUser.name = profile.displayName;
                newUser.token = accessToken;
                newUser.profileImage = profile.photos[0].value;
                newUser.provider = profile.provider;
                if (profile.emails !== undefined)
                    newUser.email = profile._json.email;
                newUser.save((err) => {
                    if (err) throw err
                    return done(null, newUser)
                })
            }
        })
        // return done(null, profile);
    }
))

passport.use(new twitterStrategy({
    consumerKey: twitterApi,
    consumerSecret: twitterSecret,
    callbackURL: twitterCallbackUrl,
    profileFields: ['email', 'id', 'name','photos']
}, async function (accessToken, refreshToken, profile, done) {
    await User.findOne({ 'id': profile.id }, (err, user) => {
        if (err) return done(err)
        if (user) return done(null, user)
        else {
            console.log('profile email = ' + profile.username)
            console.log('profile twitter == ' + JSON.stringify(profile))
            const newUser = new User();
            newUser.id = profile.id;
            newUser.name = profile.displayName;
            newUser.email = profile.username;
            newUser.provider = profile.provider;
            newUser.profileImage = profile.photos[0].value;
            newUser.save((err) => {
                if (err) throw err;
                return done(null, user);
            })
        }
    })
}))

passport.use(new googleStrategy({
    clientID: googleClientId,
    clientSecret: googleClientSecret,
    callbackURL: googleCallback,
    profileFields: ['email','photos']
}, async function (accessToken, refreshToken, profile, done) {
    await User.findOne({ 'id': profile.id }, (err, user) => {
        if (err) return done(err);
        if (user) return done(null, { user: user, token: accessToken });
        else {
            const newUser = new User();
            console.log('profile email === ' + profile.emails[0].value)
            console.log('profile id === ' + profile.id);
            console.log(profile)
            newUser.id = profile.id;
            newUser.name = profile.displayName;
            newUser.profileImage = profile.photos[0].value;
            newUser.provider = profile.provider;
            newUser.email = profile.emails[0].value;
            newUser.save((err, user) => {
                if (err) throw err;
                return done(null, user);
            })
        }
    })
}))

passport.use(new githubStrategy({
    clientID: gitClientId,
    clientSecret: gitSecretId,
    callbackURL: gitCallback,
    profileFields : ['photos']
}, async function (accessToken, refreshToken, profile, done) {
    await User.findOne({ 'id': profile.id }, (err, user) => {
        if (err) return done(err);
        if (user) return done(null, user);
        else {
            const newUser = new User();
            newUser.id = profile.id;
            newUser.name = profile.displayName;
            newUser.email = profile.username;
            newUser.provider= profile.provider;
            newUser.profileImage= profile.photos[0].value;
            newUser.save((err, user) => {
                if (err) throw err;
                return done(null, user);
            })
        }
    })
}))