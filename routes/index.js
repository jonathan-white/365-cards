var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { 
    fullTitle: '365 Cards by Katherine',
    title: '365 Cards',
    subtitle: ' by Katherine'
  });
});

module.exports = router;
