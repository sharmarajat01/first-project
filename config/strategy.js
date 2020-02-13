// const passport = require('passport')
// const localStrategy = require('passport-local').Strategy;
// const User = require('../models/user.model');

// const localStrat = model => async (req, done) => {
//     const {
//         email, password
//     } = req.body;

//     await model.findOne({ email: email }, function (err, user) {
//         if (err) return done(err);
//         if (!user) return done(null, false, { message: 'Invalid email' });
//         if (!user.validatePassword(password)) return done(null, false, { message: 'Invalid password' });
//         return done(null,user);
//     });
// }


// module.exports = {
//     strategy: new localStrategy('local',localStrat(User))
// }