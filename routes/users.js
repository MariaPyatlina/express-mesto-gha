const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { auth } = require('../middlewares/auth');
const {
  getAllUsers, getUser, getUserMe, updateUser, updateUserAvatar,
} = require('../controllers/users');

router.get('/', auth, getAllUsers);

router.get('/me', auth, getUserMe);

router.get('/:userId', auth, celebrate({
  params: Joi.object().keys({
    userId: Joi.string().alphanum().length(24),
  }),
}), getUser);

router.patch('/me', auth, celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), updateUser);

router.patch('/me/avatar', auth, celebrate({
  body: Joi.object().keys({
    avatar: Joi.string(),
  }),
}), updateUserAvatar);

module.exports = router;
