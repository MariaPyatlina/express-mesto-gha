const Card = require('../models/card');
const BadRequestError = require('../error/badRequestError');
const NotFoundError = require('../error/notFoundError');
const UnauthorizedError = require('../error/unauthorizedError');

const {
  BAD_REQUEST_ERROR_MSG,
  CARD_NOT_FOUND_ERROR_MSG,
  UNAUTHORIZED_ERROR_MSG,
} = require('../utils/constants');

function createCard(req, res, next) {
  const owner = req.user._id;
  const { name, link } = req.body;

  Card.create({ name, link, owner })
    .then((card) => {
      res.status(201).send(card);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError(`${BAD_REQUEST_ERROR_MSG}Проверьте правильность запроса.`));
      }
      next(err);
    });
}

function getAllCards(req, res, next) {
  Card.find(req.body)
    .then((card) => {
      res.send({ data: card });
    })
    .catch((err) => next(err));
}

function deleteCard(req, res, next) {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        next(new NotFoundError(CARD_NOT_FOUND_ERROR_MSG));
      }

      if (card.owner !== req.user._id) {
        next(new UnauthorizedError(UNAUTHORIZED_ERROR_MSG));
      }

      return res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError(BAD_REQUEST_ERROR_MSG));
      }
      next(err);
    });
}

function setLikeCard(req, res, next) {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        next(new NotFoundError(CARD_NOT_FOUND_ERROR_MSG));
      }
      return res.status(200).send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError(BAD_REQUEST_ERROR_MSG));
      }
      next(err);
    });
}

function removeLikeCard(req, res, next) {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        next(new NotFoundError(CARD_NOT_FOUND_ERROR_MSG));
      }
      return res.status(200).send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError(BAD_REQUEST_ERROR_MSG));
      }
      next(err);
    });
}

module.exports = {
  getAllCards,
  createCard,
  deleteCard,
  setLikeCard,
  removeLikeCard,
};
