var express = require('express');
var router = express.Router();
var ctrlMain = require('../controllers/main');
//var ctrlProfile = require('../controllers/main')
/* GET home page. */
router.get('/', ctrlMain.index);
router.post('/profile', ctrlMain.profile);
router.get('/profile', ctrlMain.loadProfile);
router.get('/edit_profile', ctrlMain.loadEditProfile);
router.get('/logout', ctrlMain.logout);
router.post('/login', ctrlMain.login);
router.post('/signup', ctrlMain.signup);
router.get('/changePassword', ctrlMain.renderChangePassword);
router.get('/deleteAccount', ctrlMain.renderDeleteAccount);
router.post('/delete_account', ctrlMain.deleteAccount);
router.post('/change_password', ctrlMain.changePassword);
router.post('/updateProfile', ctrlMain.updateProfile);

module.exports = router;