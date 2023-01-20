const User = require('../models/user');
const errorHandler = require('../errors/errors');

function createUser(req, res) {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => {
      res.status(201).send(user);
    })
    // .catch((err) => {
    //   if (err.name === 'ValidationError') {
    //     return res.status(400).send({ message: 'Переданы некорректные данные' });
    //   }

    //   return res.status(500).send({ message: 'На сервере произошла ошибка' });
    // });
    .catch((err) => errorHandler(err, res));
}

function getAllUsers(req, res) {
  User.find(req.body)
    .then((user) => {
      res.send({ data: user });
    })
    // .catch((err) => res.status(500).send(err));
    .catch((err) => errorHandler(err, res));
}

function getUser(req, res) {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: 'Пользователь не найден' });
      }
      return res.status(200).send(user);
    })
    // .catch((err) => {
    //   if (err.name === 'CastError') {
    //     return res.status(400).send({ message: 'Некорректный id пользователя' });
    //   }
    //   return res.status(500).send({ message: 'На сервере произошла ошибка' });
    // });
    .catch((err) => errorHandler(err, res));
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
        return res.status(404).send({ message: 'Пользователь не найден' });
      }
      return res.status(200).send({ data: user });
    })
    // .catch((err) => {
    //   if (err.name === 'ValidationError') {
    //     return res.status(400).send({ message: 'Переданы некорректные данные' });
    //   }
    //   return res.status(500).send({ message: 'На сервере произошла ошибка' });
    // });
    .catch((err) => errorHandler(err, res));
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
        return res.status(404).send({ message: 'Пользователь не найден' });
      }
      return res.status(200).send({ data: user });
    })
    // .catch((err) => {
    //   if (err.name === 'ValidationError') {
    //     return res.status(400).send({ message: 'Переданы некорректные данные' });
    //   }
    //   return res.status(500).send({ message: 'На сервере произошла ошибка' });
    // });
    .catch((err) => errorHandler(err, res));
}

module.exports = {
  createUser,
  getAllUsers,
  getUser,
  updateUser,
  updateUserAvatar,
};
