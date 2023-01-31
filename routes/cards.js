const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { auth } = require('../middlewares/auth');
const {
  createCard, getAllCards, deleteCard, setLikeCard, removeLikeCard,
} = require('../controllers/cards');

router.post(
  '/',
  auth,
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      link: Joi.string().required(),
    }),
  }), createCard);

router.get('/', auth, getAllCards);

router.delete('/:cardId', auth, deleteCard);

router.put('/:cardId/likes', auth, setLikeCard);

router.delete('/:cardId/likes', auth, removeLikeCard);

module.exports = router;
