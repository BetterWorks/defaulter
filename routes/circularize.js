'use strict';

var Canvas = require('canvas');
var express = require('express');
var request = require('requestretry');
var Image = Canvas.Image;

var router = express.Router();

router.get('/', function(req, res) {
  var opts = {
    url: req.query.src,
    encoding: null,
    timeout: 2000,
    maxAttempts: 2,
    retryDelay: 0,
    retryStrategy: request.RetryStrategies.HTTPOrNetworkError
  };
  request(opts, function(err, response, body) {
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
      var middleX = Math.round((img.width - 1) * 0.5);
      var middleY = Math.round((img.height - 1) * 0.5);
      var radius = Math.min(middleX, middleY);

      var canvas = new Canvas(img.width, img.height);
      var ctx = canvas.getContext('2d');

      ctx.drawImage(img, 0, 0, img.width, img.height);

      ctx.beginPath();
      ctx.lineWidth = 1;
      ctx.arc(middleX, middleY, radius, 0, 2 * Math.PI, true);
      ctx.strokeStyle = 'rgb(255, 255, 255)';
      ctx.globalCompositeOperation = 'destination-in';

      ctx.fill();

      res.setHeader('content-type', 'image/png');
      res.setHeader('cache-control', 'max-age=86400');

      canvas.toBuffer(function (err, buf) {
        if (err) {
          res.status(500).send('Unable to read image');
          return;
        }
        res.send(buf);

        // workaround leak https://github.com/Automattic/node-canvas/issues/785
        img.onload = null;
        img.onerror = null;
        img.src = null;
      });

    };

    img.onerror = function () {
      res.status(500);
      res.send('Unable to read image');
    };

    img.src = new Buffer(body, 'binary');
  });

});

module.exports = router;
