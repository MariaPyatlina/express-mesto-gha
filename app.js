const express = require('express');
const mongoose = require('mongoose');

const userRoutes = require('./routes/users');
const cardRoutes = require('./routes/cards');

const { PORT = 3000, MONGO_URL = 'mongodb://localhost:27017/mestodb' } = process.env;

const app = express();

app.use(express.json());

// Подставляется id пользователя во все запросы
app.use((req, res, next) => {
  req.user = {
    _id: '63c1e664cb5281170a8fb576',
  };

  next();
});

// Маршрутизирует все запросы про пользователя
app.use('/users', userRoutes);

// Маршрутизирует все запросы про карточки
app.use('/cards', cardRoutes);

// Маршрутизирует все неправильные запросы
app.use('/*', (req, res) => {
  res.status(404).send({ message: 'Некорректный url' });
});

// подключаемся к серверу mongo
mongoose.connect(MONGO_URL);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
