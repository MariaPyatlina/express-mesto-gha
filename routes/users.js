const router = require('express').Router();
const { setUserId } = require('../middleware/setUserId');
const {
  createUser, getAllUsers, getUser, updateUser, updateUserAvatar,
} = require('../controllers/users');

router.post('/users', createUser);

router.get('/users', getAllUsers);

router.get('/users/:userId', getUser);

router.patch('/users/me', setUserId, updateUser);

router.patch('/users/me/avatar', setUserId, updateUserAvatar);

module.exports = router;
