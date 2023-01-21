const Card = require('../models/card');
const {
  SERVER_ERROR,
  BAD_REQUEST_ERROR,
  NOT_FOUND_ERROR,
  SERVER_ERROR_MSG,
  BAD_REQUEST_ERROR_NSG,
  CARD_NOT_FOUND_ERROR_MSG,
} = require('../utils/constants');

function createCard(req, res) {
  const owner = req.user._id;
  const { name, link } = req.body;

  Card.create({ name, link, owner })
    .then((card) => {
      res.status(201).send(card);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(BAD_REQUEST_ERROR).send({ message: BAD_REQUEST_ERROR_NSG });
      }

      return res.status(SERVER_ERROR).send({ message: SERVER_ERROR_MSG });
    });
}

function getAllCards(req, res) {
  Card.find(req.body)
    .then((card) => {
      res.send({ data: card });
    })
    .catch(() => res.status(SERVER_ERROR).send({ message: SERVER_ERROR_MSG }));
}

function deleteCard(req, res) {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        return res.status(NOT_FOUND_ERROR).send({ message: CARD_NOT_FOUND_ERROR_MSG });
      }
      return res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(BAD_REQUEST_ERROR).send({ message: BAD_REQUEST_ERROR_NSG });
      }

      return res.status(SERVER_ERROR).send({ message: SERVER_ERROR_MSG });
    });
}

function setLikeCard(req, res) {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return res.status(NOT_FOUND_ERROR).send({ message: CARD_NOT_FOUND_ERROR_MSG });
      }
      return res.status(200).send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(BAD_REQUEST_ERROR).send({ message: BAD_REQUEST_ERROR_NSG });
      }
      return res.status(SERVER_ERROR).send({ message: SERVER_ERROR_MSG });
    });
}

function removeLikeCard(req, res) {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return res.status(NOT_FOUND_ERROR).send({ message: CARD_NOT_FOUND_ERROR_MSG });
      }
      return res.status(200).send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(BAD_REQUEST_ERROR).send({ message: BAD_REQUEST_ERROR_NSG });
      }
      return res.status(SERVER_ERROR).send({ message: SERVER_ERROR_MSG });
    });
}

module.exports = {
  getAllCards,
  createCard,
  deleteCard,
  setLikeCard,
  removeLikeCard,
};
