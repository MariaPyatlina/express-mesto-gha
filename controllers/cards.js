const Card = require('../models/card');
const errorHandler = require('../errors/errors');

function createCard(req, res) {
  const owner = req.user._id;
  const { name, link } = req.body;

  Card.create({ name, link, owner })
    .then((card) => {
      res.status(201).send(card);
    })
    // .catch((err) => {
    //   if (err.name === 'ValidationError') {
    //     return res.status(400).send({ message: 'Переданы некорректные данные' });
    //   }

    //   return res.status(500).send({ message: 'На сервере произошла ошибка' });
    // });
    .catch((err) => errorHandler(err, res));
}

function getAllCards(req, res) {
  Card.find(req.body)
    .then((card) => {
      res.send({ data: card });
    })
    // .catch(err => res.status(500).send({ message: 'На сервере произошла ошибка' }));
    .catch((err) => errorHandler(err, res));
}

function deleteCard(req, res) {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        return res.status(404).send({ message: 'Карточка не найдена' });
      }
      return res.send({ data: card });
    })
    // .catch((err) => {
    //   if (err.name === 'CastError') {
    //     return res.status(400).send({ message: 'Некорректный id карточки' });
    //   }

    //   return res.status(500).send({ message: 'На сервере произошла ошибка' });
    // });
    .catch((err) => errorHandler(err, res));
}

function setLikeCard(req, res) {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return res.status(404).send({ message: 'Карточка не найдена' });
      }
      return res.status(200).send({ data: card });
    })
    // .catch((err) => {
    //   if (err.name === 'CastError') {
    //     return res.status(400).send({ message: 'Некорректный id карточки' });
    //   }
    //   return res.status(500).send({ message: 'На сервере произошла ошибка' });
    // });
    .catch((err) => errorHandler(err, res));
}

function removeLikeCard(req, res) {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return res.status(404).send({ message: 'Карточка не найдена' });
      }
      return res.status(200).send({ data: card });
    })
    // .catch((err) => {
    //   if (err.name === 'CastError') {
    //     return res.status(400).send({ message: 'Некорректный id карточки' });
    //   }
    //   return res.status(500).send({ message: 'На сервере произошла ошибка' });
    // });
    .catch((err) => errorHandler(err, res));
}

module.exports = {
  getAllCards,
  createCard,
  deleteCard,
  setLikeCard,
  removeLikeCard,
};
