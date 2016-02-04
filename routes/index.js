'use strict';

var Canvas = require('canvas');
var crypto = require('crypto');
var express = require('express');
var path = require('path');

var router = express.Router();

var COLORS = [
 '#BFD2D7', '#88CBD8', '#57828B', '#1D89A0', '#1F7081', '#8DA6AE', '#6EA3AF', '#0F5564'
];

var fontPath = path.join(__dirname, '..', 'fonts', 'font.woff');
var font = new Canvas.Font('CustomFont', fontPath);

function getAccentColor(query, text) {
  if (query.hex) {
    // color is defined
    return '#' + query.hex;
  } else if (query.seed) {
    // seed is defined and will determine the color chosen
    var md5 = crypto.createHash('md5');
    md5.update('' + text);
    md5.update(query.seed);
    return COLORS[parseInt(md5.digest('hex').substr(0, 8), 16) % COLORS.length];
  } else {
    // color is chosen randomly
    return COLORS[Math.floor(Math.random() * COLORS.length)];
  }
}

router.get('/', function(req, res) {
  // use only the first two characters of the text
  var text = req.query.text || '?';
  text = text.trim().substr(0, 2).toUpperCase();

  var fonts = 'CustomFont';
  if (text[0] > '\u2E7F') {
    // only use 1st character for CJK because of space limitations
    text = text[0];
    fonts = '"WenQuanYi Zen Hei Sharp"';
  }

  // default size to 200px and allow up to 2048px
  var size = parseInt(req.query.size) || 200;
  size = Math.max(Math.min(2048, +size), 1);

  var fontSize = Math.ceil(size * 0.5);
  var strokeWidth = Math.round(fontSize * 0.08);

  var mainColor = 'white';
  var backgroundColor = getAccentColor(req.query, text);

  var haveBorder = req.query.border === 'true';
  if (haveBorder) {
    var tempColor = mainColor;
    mainColor = backgroundColor;
    backgroundColor = tempColor;
  }

  var canvas = new Canvas(size, size);
  var ctx = canvas.getContext('2d');
  ctx.addFont(font);

  // fill the background
  ctx.fillStyle = backgroundColor;
  ctx.rect(0, 0, size, size);
  ctx.fill();

  // draw the containing circle
  if (haveBorder) {
    var arcRadius = Math.floor((size - strokeWidth) * 0.5);
    var middle = Math.floor(size * 0.5);
    ctx.beginPath();
    ctx.lineWidth = strokeWidth;
    ctx.arc(middle, middle, arcRadius, 0, 2*Math.PI, true);
    ctx.strokeStyle = mainColor;
    ctx.stroke();
  }

  // position the text
  ctx.font = fontSize + 'px ' + fonts;
  var textSize = ctx.measureText(text);
  var xPos = Math.round((size - textSize.width) * 0.5);
  var yPos = Math.round(size * 0.667);

  ctx.fillStyle = mainColor;
  ctx.fillText(text, xPos, yPos);

  res.setHeader('cache-control', 'max-age=7200');
  res.setHeader('content-type', 'image/png');

  canvas.pngStream().pipe(res);
});

module.exports = router;
