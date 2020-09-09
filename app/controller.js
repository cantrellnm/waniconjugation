const axios = require('axios');
const mongoose = require('mongoose');
const verbs = mongoose.model('Verb');
const en_verbs = mongoose.model('En_verb');
const adj = mongoose.model('Adjective');

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

module.exports.userInfo = function(req, res) {
  axios.get('https://api.wanikani.com/v2/user', {
      headers: {
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + req.params.key,
      }
    }).then(response => {
      parseUserData(res, response, req.params.key);
    }).catch(error => {
      console.log(error);
      sendJSONresponse(res, 500, 'error requesting data from WaniKani');
    });
};

async function getUserVocabData(key) {
  let subject_ids = [];
  try {
    let response = await axios.get('https://api.wanikani.com/v2/review_statistics?subject_types=vocabulary', {
      headers: {
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + key,
      }
    });
    subject_ids = subject_ids.concat(response.data.data);
    while (response.data.pages.next_url) {
      response = await axios.get(response.data.pages.next_url, {
        headers: {
          'Accept': 'application/json',
          'Authorization': 'Bearer ' + key,
        }
      });
      subject_ids = subject_ids.concat(response.data.data);
    }
    subject_ids = subject_ids.map(d => (d.data.subject_id));
  } catch (error) {
    console.log(error);
  }
  try {
    let data = [];
    let response = await axios.get('https://api.wanikani.com/v2/subjects?types=vocabulary', {
      headers: {
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + key,
      }
    });
    data = data.concat(response.data.data);
    while (response.data.pages.next_url) {
      response = await axios.get(response.data.pages.next_url, {
        headers: {
          'Accept': 'application/json',
          'Authorization': 'Bearer ' + key,
        }
      });
      data = data.concat(response.data.data);
    }
    return data.filter(d => (subject_ids.includes(d.id))).map(d => (d.data.characters));
  } catch (error) {
    console.log(error);
    return [];
  }
}

async function parseUserData(res, response, key) {
  var info = {
    username: response.data.data.username,
    level: response.data.data.level,
    APIkey: key
  };
  let vocab = await getUserVocabData(key);
  verbs.find({ level: {$lte: info.level} }).exec((err, docs) => {
    if (err) sendJSONresponse(res, 500, 'error fetching verb data');
    info.verbs = docs.filter((doc) => {
      return vocab.includes(doc.verb);
    });
    adj.find({ level: {$lte: info.level} }).exec((err, docs) => {
      if (err) sendJSONresponse(res, 500, 'error fetching adj data');
      info.adj = docs.filter((doc) => {
        return vocab.includes(doc.word);
      });
      sendJSONresponse(res, 200, info);
    });
  });
}

function sendJSONresponse(res, status, content) {
  res.status(status);
  res.json(content);
}
function regexEscape(str) {
    return str.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')
}
