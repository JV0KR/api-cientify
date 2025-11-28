

const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/userController');
const { auth, permit } = require('../middleware/auth');
const upload = require('../middleware/upload');


router.post('/register', userCtrl.register);
router.post('/login', userCtrl.login);

router.get('/profile', auth, userCtrl.getProfile);
router.put('/profile', auth, upload.single('avatar'), userCtrl.updateProfile);
router.delete('/delete', auth, userCtrl.deleteAccount);

router.get('/search', auth, userCtrl.searchUsers);

router.post('/:id/follow', auth, userCtrl.follow);
router.post('/:id/unfollow', auth, userCtrl.unfollow);

router.get('/:id', auth, userCtrl.getUserById);

router.get('/', auth, permit('admin'), userCtrl.getAllUsers);


module.exports = router;
