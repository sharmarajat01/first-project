const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const handler = require('../controllers/auth.contoller');
const sessionParse = require('../middlewares/sessionParser');


router.get('/get', handler.get);
router.post('/login', handler.login);
router.get('/logout',handler.logout);
router.post('/register', handler.register);
router.put('/:id', auth, handler.update);
router.get('/auth/facebook',sessionParse, handler.fbLogin);
router.get('/auth/facebook/callback',sessionParse,handler.fbCallback);
router.get('/auth/twitter/callback',handler.twitterCallback);
router.get('/auth/twitter',handler.twitterLogin);

router.get('/auth/google/callback',handler.googleCallback);
router.get('/auth/google',handler.googleLogin);

router.get('/auth/github/callback',handler.gitCallback);
router.get('/auth/github',handler.gitLogin);

module.exports = router;
