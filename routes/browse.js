var express = require('express');
var router = express.Router();

/* GET browse page. */
router.get('/', function(req, res, next) {
    res.render('browse', { message: 'What are we mining today?', clicked: 'You\'ve been warned.' });
});

module.exports = router;