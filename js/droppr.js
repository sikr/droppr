/*
 * Droppr - updload images and provide URL
 */

(function() {

var fs             = require('fs');
var pathArray      = __dirname.split("/");
pathArray.pop();
var basePath       = pathArray.join('/');
var key            = fs.readFileSync(basePath + '/ssl/key.pem');
var certificate    = fs.readFileSync(basePpath + '/ssl/cert.pem');
var credentials    = { key: key, cert: certificate};

var config         = require('./config.json');

var express        = require('express');
var upload         = express();
var download       = express();
var https          = require('https');
var uploadServer   = https.createServer(credentials, upload);
// var downloadServer = https.createServer(credentials, download);
var path           = require('path');
var multer         = require('multer');

var Store          = require('./store');
var store          = new Store(config.path);

var storage = multer.diskStorage({
  destination: function (req, file, callback) {
    // callback(null, directory);
    store.getDirectory(function(directory) {
      callback(null, directory);
    });
  },
  filename: function (req, file, callback) {
    store.getUniqueFilename(path.parse(file.originalname).base,
                            file.mimetype,
                            function(err, uniqueName) {
      callback(err, uniqueName);
    });
  }
});

var uploadMulter = multer({ storage: storage });

function runServer() {

  // static content webserver
  upload.use('/', express.static(basePath + '/www/'));

  // logging
  upload.use(function (req, res, next) {
    console.info('request:' + req.url);
    next();
  });

  upload.post('/upload', uploadMulter.single('file'), function(req, res) {
    if (typeof req.file === 'object' && req.file.filename) {
      res.send({
        // url: 'http://' +
        //      req.headers.host.split(':')[0] +
        //      '/' +
        //      uploadPath +
        //      store.getCurrentDirectory() +
        //      '/' +
        //      req.file.filename
        url: config.downloadProtocol +
             '://' +
             config.downloadHost +
             // '/' +
             config.downloadPath +
             '/' +
             store.getCurrentDirectory() +
             '/' +
             req.file.filename
      });
    }
    else {
      res.status(415).send('');
    }
  });

  // static content webserver
  download.use('/', express.static(config.path));

  // create secure server
  uploadServer.listen(config.uploadPort);
  // downloadServer.listen(config.downloadPort);
  console.info('**** Droppr is running on port ' + config.uploadPort + ' ****');
}

runServer();

})();
