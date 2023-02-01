const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../error/unauthorizedError');
const { SECRET_PHRASE } = require('../utils/constants');
const { UNAUTHORIZED_ERROR_MSG } = require('../utils/constants');

// eslint-disable-next-line consistent-return
const auth = (req, res, next) => {
  const { authorization } = req.headers;
  // проверим есть ли токен в заголовке
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(new UnauthorizedError(UNAUTHORIZED_ERROR_MSG));
  }

  // извлечем его, если есть
  const token = authorization.replace('Bearer ', '');

  // верифицируем токен
  let payload;

  try {
    payload = jwt.verify(token, SECRET_PHRASE);
  } catch (err) {
    // отправим ошибку, если не получилось
    return next(new UnauthorizedError(UNAUTHORIZED_ERROR_MSG));
  }

  // записываем пейлоуд в объект запроса
  req.user = payload;

  // пропускаем запрос дальше
  next();
};

module.exports = {
  auth,
};
