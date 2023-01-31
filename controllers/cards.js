const Card = require('../models/card');
const BadRequestError = require('../error/badRequestError');
const ConflictError = require('../error/conflictError');
const InternalServerError = require('../error/internalServerError');
const NotFoundError = require('../error/notFoundError');
const UnauthorizedError = require('../error/unauthorizedError');

const {
  SERVER_ERROR,
  BAD_REQUEST_ERROR,
  NOT_FOUND_ERROR,
  SERVER_ERROR_MSG,
  BAD_REQUEST_ERROR_MSG,
  CARD_NOT_FOUND_ERROR_MSG,
  UNAUTHORIZED,
  UNAUTHORIZED_ERROR_MSG,
  SECRET_PHRASE
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
        next(new BadRequestError(`${BAD_REQUEST_ERROR_MSG}Проверьте правильность запроса.`))
        // return res.status(BAD_REQUEST_ERROR).send({ message: `${BAD_REQUEST_ERROR_MSG}Проверьте правильность запроса.` });
      }
      next(err);
      // return res.status(SERVER_ERROR).send({ message: SERVER_ERROR_MSG });
    });
}

function getAllCards(req, res, next) {
  Card.find(req.body)
    .then((card) => {
      res.send({ data: card });
    })
    .catch(() => next(err)
      //res.status(SERVER_ERROR).send({ message: SERVER_ERROR_MSG })
    );
}

function deleteCard(req, res, next) {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        next(new NotFoundError(CARD_NOT_FOUND_ERROR_MSG))
        // return res.status(NOT_FOUND_ERROR).send({ message: CARD_NOT_FOUND_ERROR_MSG });
      }
      // проверить
      console.log('userId', userId);
      console.log('owner', owner);

      if (card.owner !== req.user._id) {
        next(new UnauthorizedError(UNAUTHORIZED_ERROR_MSG));
        // return res.status(401).send({ message: 'Нельзя удалить чужую карточку' });
      }

      return res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError(BAD_REQUEST_ERROR_MSG))
        // return res.status(BAD_REQUEST_ERROR).send({ message: BAD_REQUEST_ERROR_MSG });
      }
      next(err);
      // return res.status(SERVER_ERROR).send({ message: SERVER_ERROR_MSG });
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
        // return res.status(NOT_FOUND_ERROR).send({ message: CARD_NOT_FOUND_ERROR_MSG });
      }
      return res.status(200).send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError(BAD_REQUEST_ERROR_MSG))
        // return res.status(BAD_REQUEST_ERROR).send({ message: BAD_REQUEST_ERROR_MSG });
      }
      next(err);
      // return res.status(SERVER_ERROR).send({ message: SERVER_ERROR_MSG });
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
        // return res.status(NOT_FOUND_ERROR).send({ message: CARD_NOT_FOUND_ERROR_MSG });
      }
      return res.status(200).send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError(BAD_REQUEST_ERROR_MSG));
        // return res.status(BAD_REQUEST_ERROR).send({ message: BAD_REQUEST_ERROR_MSG });
      }
      next(err);
      // return res.status(SERVER_ERROR).send({ message: SERVER_ERROR_MSG });
    });
}

module.exports = {
  getAllCards,
  createCard,
  deleteCard,
  setLikeCard,
  removeLikeCard,
};
