var express = require('express');
var router = express.Router();
var ctrl = require('./controller');

router.get('/', ctrl.index);
router.get('/verbs', ctrl.verbs);
router.get('/adj', ctrl.adj);
router.get('/conjugate', ctrl.conjugate);
router.get('/translate', ctrl.translate);

router.get('/api/verbs', ctrl.verbList);
router.get('/api/en_verbs', ctrl.en_verbList);
router.get('/api/adj', ctrl.adjList);

router.get('/api/user/:key', ctrl.userInfo);

router.get('/api/verbs/:verb', ctrl.findVerb);
router.get('/api/en_verbs/:en_verb', ctrl.findEn_verb);
router.get('/api/adj/:adj', ctrl.findAdj);

router.get('/api/verbs/search/:verb', ctrl.searchVerb);
router.get('/api/adj/search/:adj', ctrl.searchAdj);

module.exports = router;