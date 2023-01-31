const router = require('express').Router();
const { auth } = require('../middlewares/auth');
const {
  getAllUsers, getUser, getUserMe, updateUser, updateUserAvatar,
} = require('../controllers/users');

router.get('/', auth, getAllUsers);

router.get('/me', auth, getUserMe);

router.get('/:userId', auth, getUser);

router.patch('/me', auth, updateUser);

router.patch('/me/avatar', auth, updateUserAvatar);

module.exports = router;
