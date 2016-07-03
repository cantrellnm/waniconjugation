var express = require('express');
var router = express.Router();
var ctrl = require('./controller');

router.get('/', ctrl.index);
router.get('/verbs', ctrl.verbs);
router.get('/adj', ctrl.adj);
router.get('/conjugate', ctrl.conjugate);
router.get('/translate', ctrl.translate);

module.exports = router;