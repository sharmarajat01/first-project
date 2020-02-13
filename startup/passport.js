const passport = require('passport');
require('../config/passport.configure');


module.exports = app => {
	app.use(passport.initialize({ userProperty: 'currentUser' }));
	
	app.use(passport.session());
    

	passport.serializeUser(function(user, done) {
		done(null, user.id);
	}); //1st

	passport.deserializeUser(function(user, done) {
		done(null, { id: 'asssasasasassa' });
	}); //1st
};