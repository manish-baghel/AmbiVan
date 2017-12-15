/**
 * Created by manish on 6/9/17.
 */
var express = require('express');
var mainController = require('../controllers/MainController');
var router = express.Router();
var app = require('../../ApplicationInstance');

//=====================================================
//============ GET REQUEST ============================
//=====================================================
router.route('/').get(mainController.home);
router.route('/ambulance/getAmbulance').get(mainController.getAmbulance);

router.route('/about').get(mainController.about);
router.route('/paramedic').get(mainController.paramedic);
router.route('/responder').get(mainController.responder);
router.route('/vision').get(mainController.vision);
router.route('/awareness').get(mainController.awareness);
router.route('/driverTraining').get(mainController.driver);
router.route('/book-overview').get(mainController.bookoverview);
router.route('/auth').get(mainController.auth);
router.route('/availability').get(mainController.availability);
router.route('/faq').get(mainController.faq);
router.route('/noti').get(mainController.push);

//====================================================
//============ POST REQUEST ==========================
//====================================================
router.route('/ambulance').post(mainController.ambulancePost);
router.route('/').post(mainController.postform);
router.route('/van').post(mainController.listvan);
router.route('/responder').post(mainController.formresponder);
router.route('/driver').post(mainController.formdriver);
router.route('/paramedic').post(mainController.formparamedic);
router.route('/chetan').post(mainController.test);
router.route('/near').post(mainController.near);

module.exports = router;
