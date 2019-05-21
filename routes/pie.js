'use strict';

var { createCanvas, Canvas } = require('canvas');
var express = require('express');

var router = express.Router();

var colors = {
  green: '#82BB41',
  yellow: '#f3e46e',
  red: '#e37068',
};

function renderProgress(ctx, middle, color, radius, progress) {
  progress = Math.min(progress, 100);
  progress = Math.max(progress, 0);
  progress = 3 / 2 + progress * 0.02;

  ctx.beginPath();
  ctx.fillStyle = color;
  ctx.moveTo(middle, middle);
  ctx.arc(middle, middle, radius, 3 / 2 * Math.PI, progress * Math.PI, false);
  ctx.strokeStyle = color;
  ctx.fill();
}

router.get('/', function(req, res) {
  // default size to 200px and allow up to 2048px
  var size = parseInt(req.query.size) || 200;
  size = Math.max(Math.min(2048, +size), 1);

  var progress = parseInt(req.query.progress) || 0;

  var color = colors[req.query.color || 'green'];
  var arcRadius = (size - 1) * 0.5;

  var canvas = createCanvas(size, size);
  var ctx = canvas.getContext('2d');

  // fill the background
  ctx.fillStyle = 'rgba(0,0,0,0)';
  ctx.rect(0, 0, size, size);
  ctx.fill();

  var middle = Math.round(size * 0.5);

  renderProgress(ctx, middle, color, arcRadius, 100);
  renderProgress(ctx, middle, 'white', arcRadius * 0.9, 100);
  renderProgress(ctx, middle, color, arcRadius, progress);

  res.setHeader('content-type', 'image/png');
  res.setHeader('cache-control', 'max-age=86400');

  canvas.pngStream().pipe(res);
});

module.exports = router;
