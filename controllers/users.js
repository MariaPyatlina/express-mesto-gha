const bcrypt = require('bcryptjs');
const User = require('../models/user');
const {
  SERVER_ERROR,
  BAD_REQUEST_ERROR,
  NOT_FOUND_ERROR,
  SERVER_ERROR_MSG,
  BAD_REQUEST_ERROR_NSG,
  USER_NOT_FOUND_ERROR_MSG,
} = require('../utils/constants');

function createUser(req, res) {
  //const { email, password, name, about, avatar } = req.body;
  bcrypt.hash(req.body.password, 10)  // хешируем пароль
    .then(hash => User.create({
      email: req.body.email,
      password: hash,  // записываем хеш в базу
      name: req.body.name,
      about: req.body.about,
      avatar: req.body.avatar
    }))
    .then((user) => {
      res.status(201).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(BAD_REQUEST_ERROR).send({
          message: `${BAD_REQUEST_ERROR_NSG}Проверьте правильность запроса.`,
        });
      }

      return res.status(SERVER_ERROR).send({ message: SERVER_ERROR_MSG });
    });
}

function getAllUsers(req, res) {
  User.find(req.body)
    .then((user) => {
      res.send({ data: user });
    })
    .catch(() => res.status(SERVER_ERROR).send({ message: SERVER_ERROR_MSG }));
}

function getUser(req, res) {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        return res.status(NOT_FOUND_ERROR).send({ message: USER_NOT_FOUND_ERROR_MSG });
      }
      return res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(BAD_REQUEST_ERROR).send({ message: BAD_REQUEST_ERROR_NSG });
      }
      return res.status(SERVER_ERROR).send({ message: SERVER_ERROR_MSG });
    });
}

function updateUser(req, res) {
  const userId = req.user._id;
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    userId,
    { name, about },
    { new: true, runValidators: true, upsert: false },
  )
    .then((user) => {
      if (!user) {
        return res.status(NOT_FOUND_ERROR).send({ message: USER_NOT_FOUND_ERROR_MSG });
      }
      return res.status(200).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(BAD_REQUEST_ERROR).send({ message: BAD_REQUEST_ERROR_NSG });
      }
      return res.status(SERVER_ERROR).send({ message: SERVER_ERROR_MSG });
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
        return res.status(NOT_FOUND_ERROR).send({ message: USER_NOT_FOUND_ERROR_MSG });
      }
      return res.status(200).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(BAD_REQUEST_ERROR).send({ message: BAD_REQUEST_ERROR_NSG });
      }
      return res.status(SERVER_ERROR).send({ message: SERVER_ERROR_MSG });
    });
}

module.exports = {
  createUser,
  getAllUsers,
  getUser,
  updateUser,
  updateUserAvatar,
};
