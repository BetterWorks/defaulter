'use strict';

var Canvas = require('canvas');
var express = require('express');
var request = require('request');
var Image = Canvas.Image;

var router = express.Router();

router.get('/', function(req, res) {

  request.get({ url: req.query.src, encoding: null, timeout: 2000 }, function(err, response, body) {
    if (err) {
      res.sendStatus(500);
      return;
    }

    var type = response.headers['content-type'] || '';

    if (response.statusCode >= 400 || type.indexOf('image') === -1) {
      res.status(response.statusCode);
      res.send(body);
      return;
    }

    var img = new Image();

    img.onload = function() {
      var size = img.width;
      var middle = Math.round((size - 1) * 0.5);

      var canvas = new Canvas(size, size);
      var ctx = canvas.getContext('2d');

      ctx.drawImage(img, 0, 0, img.width, img.height);

      ctx.beginPath();
      ctx.lineWidth = 1;
      ctx.arc(middle, middle, middle, 0, 2 * Math.PI, true);
      ctx.strokeStyle = 'rgb(255, 255, 255)';
      ctx.globalCompositeOperation = 'destination-in';

      ctx.fill();

      res.setHeader('cache-control', 'max-age=7200');
      res.setHeader('content-type', 'image/png');

      canvas.pngStream().pipe(res);
    };

    img.onerror = function () {
      res.status(500);
      res.send('Unable to read image');
    };

    img.src = new Buffer(body, 'binary');
  });

});

module.exports = router;
