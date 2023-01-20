const errorHandler = (err, res) => {
  if (err.name === 'ValidationError') {
    return res.status(400).send({ message: 'Переданы некорректные данные' });
  }

  if (err.name === 'CastError') {
    return res.status(400).send({ message: 'Некорректный id ' });
  }

  return res.status(500).send({ message: 'На сервере произошла ошибка' });
};

module.exports = errorHandler;
