const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const UnauthorizedError = require('../error/unauthorizedError');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: false,
    minlength: 2,
    maxlength: 30,
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    required: false,
    minlength: 2,
    maxlength: 30,
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    required: false,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: {
      validator(v) {
        // eslint-disable-next-line no-useless-escape
        return /https?:\/\/(www\.)?[a-z0-9-\.\_\-~:\/?#[\]@!$&'\(\)\*\+,;=]+#?/.test(v);
      },
      message: (props) => `${props.value} неправильный формат ссылки`,
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: [validator.isEmail, 'Неправильный формат почты'],
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    select: false, // необходимо чтобы api не возвращал хеш пароля
  },
}, {
  versionKey: false,
});

// добавим метод findUserByCredentials схеме пользователя
// у него будет два параметра — почта и пароль
userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new UnauthorizedError('Неправильная пара логин-пароль'));
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new UnauthorizedError('Неправильная пара логин-пароль'));
          }

          return user;
        });
    });
};

// создаём модель и экспортируем её
module.exports = mongoose.model('user', userSchema);
