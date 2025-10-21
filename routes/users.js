const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/userController');
const { auth, permit } = require('../middleware/auth');

router.post('/register', userCtrl.register);
router.post('/login', userCtrl.login);
router.get('/profile', auth, userCtrl.getProfile);
router.put('/profile', auth, userCtrl.updateProfile);
router.delete('/delete', auth, userCtrl.deleteAccount);

// follow/unfollow
router.post('/follow/:id', auth, userCtrl.follow);
router.delete('/unfollow/:id', auth, userCtrl.unfollow);

//Solo admins
router.get('/', auth, permit('admin'), userCtrl.getAllUsers);

module.exports = router;
