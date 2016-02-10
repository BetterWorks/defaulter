'use strict';

var Canvas = require('canvas');
var express = require('express');

var router = express.Router();

var colors = {
  green: {
    main: '#82BB41',
    shadow: '#759d40',
  },
  yellow: {
    main: '#f3e46e',
    shadow: '#cbba5f',
  },
  red: {
    main: '#e37068',
    shadow: '#c55f5e',
  },
};

function renderProgress(ctx, middle, color, lineWidth, radius, progress) {
  progress = Math.min(progress, 100);
  progress = Math.max(progress, 0);
  progress = 0.6666 + progress * 0.016667;

  ctx.beginPath();
  ctx.lineWidth = lineWidth;
  ctx.arc(middle, middle, radius, 0.6666 * Math.PI, progress * Math.PI, false);
  ctx.strokeStyle = color;
  ctx.stroke();
}

router.get('/', function(req, res) {
  // default size to 200px and allow up to 2048px
  var size = parseInt(req.query.size) || 200;
  size = Math.max(Math.min(2048, +size), 1);

  var progress = parseInt(req.query.progress) || 0;

  var color = colors[req.query.color || 'green'];

  var baseStrokeWidth = size * 0.086;
  var arcRadius = size * 0.355;
  var progMainWidth = size * 0.1;
  var progMainRadius = size * 0.4;

  var canvas = new Canvas(size, size);
  var ctx = canvas.getContext('2d');

  // fill the background
  ctx.fillStyle = 'rgba(0,0,0,0)';
  ctx.rect(0, 0, size, size);
  ctx.fill();

  var middle = Math.round(size * 0.5);

  renderProgress(ctx, middle, '#f7f6f5', baseStrokeWidth, arcRadius, 100);
  renderProgress(ctx, middle, color.shadow, baseStrokeWidth, arcRadius, progress);
  renderProgress(ctx, middle, color.main, progMainWidth, progMainRadius, progress);

  res.setHeader('cache-control', 'max-age=7200');
  res.setHeader('content-type', 'image/png');

  canvas.pngStream().pipe(res);
});

module.exports = router;
