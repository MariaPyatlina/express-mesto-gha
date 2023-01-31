const { SERVER_ERROR_MSG } = require('../utils/constants');

function handlerError(err, req, res, next) {
  const { statusCode = 500, message } = err;

  if (statusCode !== 500) {
    res.status(statusCode).send(message);
  } else {
    res.status(statusCode).send({ message: SERVER_ERROR_MSG });
  }

  next();
}

module.exports = {
  handlerError
}
