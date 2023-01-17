const express = require('express');
const mongoose = require('mongoose');

const userRoutes = require('./routes/users');
const cardRoutes = require('./routes/cards');

const { PORT = 3000, MONGO_URL = 'mongodb://localhost:27017/mestodb' } = process.env;

const app = express();

app.use(express.json());
// app.use((req, res, next) => {
//   console.log('замена сработала');
//   req.user = {
//     _id: '63c1e664cb5281170a8fb576', // Временное решение
//   };

//   next();
// });
app.use(userRoutes); // Маршрутизирует все запросы про пользователя
app.use(cardRoutes); // Маршрутизирует все запросы про карточки

// подключаемся к серверу mongo
mongoose.connect(MONGO_URL);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
