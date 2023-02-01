const { SERVER_ERROR_MSG } = require('../utils/constants');

function handlerError(err, req, res, next) {
  const { statusCode = 500, message } = err;

  res
    .status(statusCode)
    .send({
      // проверяем статус и выставляем сообщение в зависимости от него
      message: statusCode === 500
        ? SERVER_ERROR_MSG
        : message,
    });

  next();
}

module.exports = {
  handlerError,
};
