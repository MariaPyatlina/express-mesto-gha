const jwt = require('jsonwebtoken');
const { SECRET_PHRASE } = require('../utils/constants');
const { UNAUTHORIZED,
  UNAUTHORIZED_ERROR_MSG, } = require('../utils/constants');

const auth = (req, res, next) => {
  const { authorization } = req.headers;
  // проверим есть ли токен в заголовке
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res.status(UNAUTHORIZED).send(UNAUTHORIZED_ERROR_MSG);
  }

  // извлечем его, если есть
  const token = authorization.replace('Bearer ', '');
  console.log('token from header', token);

  // верифицируем токен
  let payload;

  try {
    payload = jwt.verify(token, SECRET_PHRASE);
  }
  catch (err) {
    // отправим ошибку, если не получилось
    return res.status(UNAUTHORIZED).send(UNAUTHORIZED_ERROR_MSG);
  }

  // записываем пейлоуд в объект запроса
  req.user = payload;

  // пропускаем запрос дальше
  next();
}

module.exports = {
  auth,
}