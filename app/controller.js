var mongoose = require('mongoose');
var verbs = mongoose.model('Verb');
var en_verbs = mongoose.model('En_verb');
var adj = mongoose.model('Adjective');

module.exports.index = function(req, res) {
  res.render('index');
};
module.exports.verbs = function(req, res) {
  if (req.query.level) {
    verbs.find({ level: req.query.level }, function (err, docs) {
      if (err)
        res.render('error', {message: 'Invalid query "'+req.query.level+'"', error: err});
      else
        res.render('verbs', {verbs: docs});
    });
  } else {
    res.render('verbs');
  }
};
module.exports.adj = function(req, res) {
  if (req.query.level) {
    adj.find({ level: req.query.level }, function (err, docs) {
      if (err)
        res.render('error', {message: 'Invalid query "'+req.query.level+'"', error: err});
      else
        res.render('adj', {words: docs});
    });
  } else {
    res.render('adj');
  }
};
module.exports.conjugate = function(req, res) {
  res.render('conjugate');
};
module.exports.translate = function(req, res) {
  res.render('translate');
};

module.exports.findVerb = function(req, res) {
  verbs.find({ verb: req.params.verb }, function (err, docs) {
    if (err)
      sendJSONresponse(res, 500, err);
    else
      sendJSONresponse(res, 200, docs);
  });
};
module.exports.searchVerb = function(req, res) {
  var search = new RegExp(regexEscape(req.params.verb), "i");
  verbs.find({$or: [
      { verb: search },
      { reading: search },
      { meanings: search }
    ]}, function (err, docs) {
    if (err)
      sendJSONresponse(res, 500, err);
    else
      sendJSONresponse(res, 200, docs);
  });
};
module.exports.verbList = function(req, res) {
  var options = {};
  if (req.query.level)
    options.level = req.query.level;
  else if (req.query.lte)
    options.level = { $lte: req.query.lte };
  verbs.find(options, function (err, docs) {
    if (err)
      sendJSONresponse(res, 500, err);
    else
      sendJSONresponse(res, 200, docs);
  });
};

module.exports.findEn_verb = function(req, res) {
  en_verbs.find({ infinitive: req.params.en_verb }, function (err, docs) {
    if (err)
      sendJSONresponse(res, 500, err);
    else
      sendJSONresponse(res, 200, docs);
  });
};
module.exports.en_verbList = function(req, res) {
  en_verbs.find({ }, function (err, docs) {
    if (err)
      sendJSONresponse(res, 500, err);
    else
      sendJSONresponse(res, 200, docs);
  });
};

module.exports.findAdj = function(req, res) {
  adj.find({ word: req.params.adj }, function (err, docs) {
    if (err)
      sendJSONresponse(res, 500, err);
    else
      sendJSONresponse(res, 200, docs);
  });
};
module.exports.searchAdj = function(req, res) {
  var search = new RegExp(regexEscape(req.params.adj), "i");
  adj.find({$or: [
      { word: search },
      { reading: search },
      { meanings: search }
    ]}, function (err, docs) {
    if (err)
      sendJSONresponse(res, 500, err);
    else
      sendJSONresponse(res, 200, docs);
  });
};
module.exports.adjList = function(req, res) {
  var options = {};
  if (req.query.level)
    options.level = req.query.level;
  else if (req.query.lte)
    options.level = { $lte: req.query.lte };
  adj.find(options, function (err, docs) {
    if (err)
      sendJSONresponse(res, 500, err);
    else
      sendJSONresponse(res, 200, docs);
  });
};

function sendJSONresponse(res, status, content) {
  res.status(status);
  res.json(content);
}
function regexEscape(str) {
    return str.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')
}