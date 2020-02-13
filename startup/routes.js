const bodyParser = require('body-parser');
const appRouter = require('../routes/index');
const cookieParser = require('cookie-parser');
// const jwt = require('../middlewares/jwt');


module.exports = app => {
	app.use(bodyParser.urlencoded({ extended: false }));
	app.use(bodyParser.json());
	app.use(cookieParser());
	app.use('/api', appRouter);
    // app.use(jwt);
}