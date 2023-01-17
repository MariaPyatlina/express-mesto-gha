const router = require('express').Router();
const {
  createCard, getAllCards, deleteCard, setLikeCard, removeLikeCard,
} = require('../controllers/cards');

router.post('/', createCard);

router.get('/', getAllCards);

router.delete('/:cardId', deleteCard);

router.put('/:cardId/likes', setLikeCard);

router.delete('/:cardId/likes', removeLikeCard);

module.exports = router;
