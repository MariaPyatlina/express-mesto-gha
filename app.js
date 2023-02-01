const express = require('express');
const mongoose = require('mongoose');
const { celebrate, Joi, errors } = require('celebrate');

const userRoutes = require('./routes/users');
const cardRoutes = require('./routes/cards');
const { login, createUser } = require('./controllers/users');
const { handlerError } = require('./middlewares/handlerError');

const { PORT = 3000, MONGO_URL = 'mongodb://localhost:27017/mestodb' } = process.env;

const app = express();
// подключаемся к серверу mongo

app.use(express.json());
mongoose.set('strictQuery', false);

// Маршрутизирует авторизацию
app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), login);

// Маршрутизирует регистрацию
app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    // eslint-disable-next-line no-useless-escape
    avatar: Joi.string().regex(/https?:\/\/(www\.)?[a-z0-9-\.\_\-~:\/?#[\]@!$&'\(\)\*\+,;=]+#?/),
  }),
}), createUser);

// Маршрутизирует все запросы про пользователя
app.use('/users', userRoutes);

// Маршрутизирует все запросы про карточки
app.use('/cards', cardRoutes);

// Маршрутизирует все неправильные запросы
app.use('/*', (req, res) => {
  res.status(404).send({ message: 'Некорректный url' });
});

// Обрабатывает все ошибки
app.use(errors());
app.use(handlerError);

mongoose.connect(MONGO_URL);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
