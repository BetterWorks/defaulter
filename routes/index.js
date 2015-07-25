var express = require('express');
var router = express.Router();
var Canvas = require('canvas');
var crypto = require('crypto');

COLORS = [
  '#1abc9c', '#16a085', '#f1c40f', '#f39c12', '#2ecc71', '#27ae60', '#e67e22', '#d35400', '#3498db',
  '#2980b9', '#e74c3c', '#c0392b', '#9b59b6', '#8e44ad', '#bdc3c7', '#34495e', '#2c3e50', '#95a5a6',
  '#7f8c8d', '#ec87bf', '#d870ad', '#f69785', '#9ba37e', '#b49255', '#b49255', '#a94136'
];


/* GET home page. */
router.get('/', function(req, res, next) {
  var size = parseInt(req.query.size) || 200;
  size = Math.max(Math.min(1000, +size), 1);
  var canvas = new Canvas(size, size);
  var ctx = canvas.getContext('2d');
  ctx.rect(0, 0, size, size);

  var text = req.query.text || '?';
  var initial = text[0].toUpperCase().trim();

  if (req.query.hex) {
    ctx.fillStyle = '#' + req.query.hex;
  } else {
    if (req.query.seed) {
      var md5 = crypto.createHash('md5');
      md5.update(initial);
      md5.update(req.query.seed);
      choice = parseInt(md5.digest('hex'), 16) % COLORS.length;
    } else {
      choice = Math.floor(Math.random() * COLORS.length);
    }
    ctx.fillStyle = COLORS[choice];
  }


  ctx.fill();

  ctx = canvas.getContext('2d');
  ctx.fillStyle = 'white';

  var fonts = '"DejaVu Sans Light" Helvetica Arial';
  if (initial > '\u2E7F') {
    fonts = '"WenQuanYi Zen Hei Sharp"';
  }

  ctx.font = Math.ceil(size * 0.8) + '% ' + fonts;
  var te = ctx.measureText(initial);
  ctx.fillText(initial,
    (size - te.width) * 0.5,
    (size - te.emHeightAscent) * 0.4 + te.emHeightAscent);

  res.setHeader('cache-control', 'public,max-age=300');
  res.setHeader('content-type', 'image/png');
  canvas.pngStream().pipe(res);
});

module.exports = router;
