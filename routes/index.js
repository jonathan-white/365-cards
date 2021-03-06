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

/* GET home page. */
router.get('/cards', function(req, res, next) {
  res.render('index', { 
    fullTitle: '365 Cards by Katherine',
    title: '365 Cards',
    subtitle: ' by Katherine'
  });
});

/* GET Get Involved page */
router.get('/get-involved', function(req, res, next) {
  res.render('get-involved', { 
    fullTitle: '365 Cards by Katherine',
    title: '365 Cards',
    subtitle: ' by Katherine'
  });
});

module.exports = router;
