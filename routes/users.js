const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/userController');
const { auth } = require('../middleware/auth');

router.post('/register', userCtrl.register);
router.post('/login', userCtrl.login);
router.get('/profile', auth, userCtrl.getProfile);
router.put('/profile', auth, userCtrl.updateProfile);
router.delete('/delete', auth, userCtrl.deleteAccount);

// follow/unfollow
router.post('/follow/:id', auth, userCtrl.follow);
router.delete('/unfollow/:id', auth, userCtrl.unfollow);

module.exports = router;
