const express = require('express');
const router = express.Router();
const errorController = require('../controllers/errorController');

router.get('/intentional-error', errorController.throwError);

module.exports = router;
