var express = require('express');
var router = express.Router();
var testControl = require('../server/controllers/testController')


router.get('/page/:pageNumber', testControl.pagination)

module.exports = router;