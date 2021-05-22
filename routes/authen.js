const express = require('express');
const router = express.Router();
const authenService = require('../server/service/authen');
const authenController = require('../server/controllers/authenController');
/* GET users listing. */
router.get('/login', authenService.login);
router.post('/api/login', authenController.submitLogin);

router.get('/register', (req, res) => {
    res.render('register/register');
});

router.post('/api/register', authenController.submitRegister);


//API switch
router.get('/logout', authenController.logout)
module.exports = router;
