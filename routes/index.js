var fs = require('fs')
  , path = require('path');

var dir = path.join(__dirname, '..', 'public', 'repo');

exports.index = function(req, res) {
  res.render('index');
};

exports.remote = function(req, res) {
  res.render('remote');
};

exports.photos = function(req, res) {
  getUrls(function(err, urls) {
    res.render('photos', {urls: urls.reverse()});
  });
};

exports.photo = function(req, res) {
  getUrls(function(err, urls) {
    res.render('photo', {url: urls.reverse()[0]});
  });
};

exports.repo = function(req, res) {
  var ext = req.get('Content-Type').indexOf('gif') !== -1 ? '.gif' : '.jpg';
  var p = path.join(dir, (new Date()).getTime() + ext);
  req.pipe(fs.createWriteStream(p));
  req.on('end', function() {
      res.send({status: 1});
  });
  // todo on error send a response or hack it with a timeout
  // req.on
};

function getUrls(callback) {
  fs.readdir(dir, function(err, files) {
    callback(err, files ? files.map(function(f) { return '/repo/' + f;}) : []);
  });
}