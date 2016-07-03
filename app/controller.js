module.exports.index = function(req, res) {
  res.render('index');
};

module.exports.verbs = function(req, res) {
  res.render('verbs');
};

module.exports.adj = function(req, res) {
  res.render('adj');
};

module.exports.conjugate = function(req, res) {
  res.render('conjugate');
};

module.exports.translate = function(req, res) {
  res.render('translate');
};