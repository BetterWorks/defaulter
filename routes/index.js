var Canvas = require('canvas');
var crypto = require('crypto');
var express = require('express');
var path = require('path');

var router = express.Router();

var COLORS = [
 '#BFD2D7', '#88CBD8', '#57828B', '#1D89A0', '#1F7081', '#8DA6AE', '#6EA3AF', '#0F5564'
];

function fontFile(name) {
  return path.join(__dirname, '/../fonts/', name);
}

var districtFont = new Canvas.Font('District-Medium', fontFile('district-medium.woff'));

/* GET home page. */
router.get('/', function(req, res, next) {
  var size = parseInt(req.query.size) || 200;
  size = Math.max(Math.min(1000, +size), 1);
  var canvas = new Canvas(size, size);
  var ctx = canvas.getContext('2d');
  ctx.addFont(districtFont);
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

  var fonts = 'District-Medium "DejaVu Sans Light" Helvetica Arial';
  var pad = 0;
  if (initial > '\u2E7F') {
    fonts = '"WenQuanYi Zen Hei Sharp"';
    pad = size * -0.05;
  }

  ctx.font = Math.ceil(size * 0.8) + 'px ' + fonts;
  var te = ctx.measureText(initial);
  ctx.fillText(initial, (size - te.width) * 0.5, size * 0.8 + pad);

  res.setHeader('cache-control', 'public,max-age=300');
  res.setHeader('content-type', 'image/png');
  canvas.pngStream().pipe(res);
});

module.exports = router;
