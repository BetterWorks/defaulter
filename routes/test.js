'use strict';

var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
  var range = [];
  var i = 0;
  for (i = -10; i <= 110; i += 10) {
    range.push(i);
  }
  var sizes = [];
  for (i = -10; i <= 100; i += 20) {
    sizes.push(i);
  }
  res.render('test', {range: range, sizes: sizes});
});

module.exports = router;
