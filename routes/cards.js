const router = require('express').Router();
const { setUserId } = require('../middleware/setUserId');
const {
  createCard, getAllCards, deleteCard, setLikeCard, removeLikeCard,
} = require('../controllers/cards');

router.post('/cards', setUserId, createCard);

router.get('/cards', getAllCards);

router.delete('/cards/:cardId', deleteCard);

router.put('/cards/:cardId/likes', setUserId, setLikeCard);

router.delete('/cards/:cardId/likes', setUserId, removeLikeCard);

module.exports = router;
