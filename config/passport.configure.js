const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user.model').User;
const bcrypt = require('bcryptjs');

passport.use(new LocalStrategy({ usernameField: 'email' },
  function (email, password, done) {
    User.findOne({ email: email }, function (err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }

      if(!user.validatePassword(password)){
        console.log(err + ' here is error !')
        return done(err);
      }
      return done(null,user);

      // bcrypt.compare(password, user.password, (err, matched) => {
      //   console.log('user.password = ' + user.password + ' and password ' + password)
      //   if (err) { return done(err) }
      //   if(!matched){ 
      //     return done({msg : 'pasword incorrect !!'})}
      //   if(matched) {
      //     console.log('password = ' + password);
      //     return done(null, user);
      //   }
      // })
      //  return done(null, user);
    });
  }
));
