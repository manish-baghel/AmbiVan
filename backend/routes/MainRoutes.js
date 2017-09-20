/**
 * Created by manish on 6/9/17.
 */
var express = require('express');
var mainController = require('../controllers/MainController');
var router = express.Router();
var app = require('../../ApplicationInstance');


router.route('/').get(mainController.home);
router.route('/ambulance/getAmbulance').get(mainController.getAmbulance);
router.route('/').post(mainController.ambulancePost);


module.exports = router;
