const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const BadRequestError = require('../error/badRequestError');
const ConflictError = require('../error/conflictError');
const InternalServerError = require('../error/internalServerError');
const NotFoundError = require('../error/notFoundError');
const UnauthorizedError = require('../error/unauthorizedError');
const User = require('../models/user');
const {
  SERVER_ERROR,
  BAD_REQUEST_ERROR,
  NOT_FOUND_ERROR,
  SERVER_ERROR_MSG,
  BAD_REQUEST_ERROR_MSG,
  USER_NOT_FOUND_ERROR_MSG,
  UNAUTHORIZED,
  UNAUTHORIZED_ERROR_MSG,
  SECRET_PHRASE
} = require('../utils/constants');

function login(req, res, next) {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        SECRET_PHRASE,  // пейлоуд токена и секретный ключ подписи
        { expiresIn: '7d' }
      )

      res.status(200).send({ messsage: 'success', token })
    })
    .catch(() => {
      next(new UnauthorizedError(UNAUTHORIZED_ERROR_MSG))
    });
}

function createUser(req, res, next) {
  const { name, about, avatar, email, password } = req.body;

  bcrypt.hash(password, 10)  // хешируем пароль
    .then((hash) => User.create({ name, about, avatar, email, password: hash }))
    .then((user) => {
      res.status(201).send({
        name: user.name,
        about: user.about,
        avatar: user.avatar,
        email: user.email,
        _id: user._id,
      });  // чтобы при создании не возвращался пароль
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError(`${BAD_REQUEST_ERROR_MSG} Проверьте правильность запроса. createUser`));
        // return res.status(BAD_REQUEST_ERROR).send({
        //   message: ${BAD_REQUEST_ERROR_MSG}Проверьте правильность запроса. createUser,
        // });
      }

      if (err.code === 11000) {
        next(new ConflictError('Неуникальное мыло xaxax'));
        //res.status(409).send({ message: 'Неуникальное мыло хаха' });
      }

      next(err);
      // next(new InternalServerError(SERVER_ERROR_MSG));
      // return res.status(SERVER_ERROR).send({ message: SERVER_ERROR_MSG + 'createUser2' });
    });
}

function getAllUsers(req, res, next) {
  User.find(req.body)
    .then((user) => {
      res.send({ data: user });
    })
    .catch(() => next(err));
}

function getUser(req, res, next) {
  console.log('req.params', req.params);
  console.log('req.user', req.user);
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {

        //throw new NotFoundError(USER_NOT_FOUND_ERROR_MSG + 'getUser');
        next(new NotFoundError(USER_NOT_FOUND_ERROR_MSG + 'getUser'));
        //return res.status(NOT_FOUND_ERROR).send({ message: USER_NOT_FOUND_ERROR_MSG + 'getUser' });
      }



      return res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError(BAD_REQUEST_ERROR_MSG + 'getUser'))
        // return res.status(BAD_REQUEST_ERROR).send({ message: BAD_REQUEST_ERROR_MSG + 'getUser' });
      }
      next(err);
      //return res.status(SERVER_ERROR).send({ message: SERVER_ERROR_MSG + 'getUser3' });
    });
}

function getUserMe(req, res, next) {
  const { _id } = req.user; //передавать свой id
  req.params.userId = _id;
  getUser(req, res, next);
}

function updateUser(req, res, next) {
  const userId = req.user._id;
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    userId,
    { name, about },
    { new: true, runValidators: true, upsert: false },
  )
    .then((user) => {
      if (!user) {
        next(new NotFoundError(USER_NOT_FOUND_ERROR_MSG));
        //return res.status(NOT_FOUND_ERROR).send({ message: USER_NOT_FOUND_ERROR_MSG });
      }
      return res.status(200).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError(BAD_REQUEST_ERROR_MSG));
        // return res.status(BAD_REQUEST_ERROR).send({ message: BAD_REQUEST_ERROR_MSG });
      }
      next(err);
      // return res.status(SERVER_ERROR).send({ message: SERVER_ERROR_MSG });
    });
}

function updateUserAvatar(req, res) {
  const userId = req.user._id;
  const { avatar } = req.body;

  User.findByIdAndUpdate(
    userId,
    { avatar },
    { new: true, runValidators: true, upsert: false },
  )
    .then((user) => {
      if (!user) {
        next(new NotFoundError(USER_NOT_FOUND_ERROR_MSG));
        // return res.status(NOT_FOUND_ERROR).send({ message: USER_NOT_FOUND_ERROR_MSG });
      }
      return res.status(200).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError(BAD_REQUEST_ERROR_MSG));
        // return res.status(BAD_REQUEST_ERROR).send({ message: BAD_REQUEST_ERROR_MSG });
      }
      next(err);
      // return res.status(SERVER_ERROR).send({ message: SERVER_ERROR_MSG + 'updateUserAvatar' });
    });
}

module.exports = {
  login,
  createUser,
  getAllUsers,
  getUser,
  getUserMe,
  updateUser,
  updateUserAvatar,
};
