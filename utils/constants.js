const SERVER_ERROR = 500;
const SERVER_ERROR_MSG = 'На сервере произошла ошибка. ';
const BAD_REQUEST_ERROR = 400;
const BAD_REQUEST_ERROR_MSG = 'Переданы некорректные данные. ';

const NOT_FOUND_ERROR = 404;
const USER_NOT_FOUND_ERROR_MSG = 'Пользователь c указанным ID не найден. ';
const CARD_NOT_FOUND_ERROR_MSG = 'Карточка c указанным ID найдена. ';

const UNAUTHORIZED = 401;
const UNAUTHORIZED_ERROR_MSG = 'Необходима авторизация';

const FORBIDDEN = 403;
const FORBIDDEN_ERROR_MSG = 'Ошибка доступа';
const SECRET_PHRASE = 'Some_secret_phrase';

module.exports = {
  SERVER_ERROR,
  BAD_REQUEST_ERROR,
  NOT_FOUND_ERROR,
  SERVER_ERROR_MSG,
  BAD_REQUEST_ERROR_MSG,
  USER_NOT_FOUND_ERROR_MSG,
  CARD_NOT_FOUND_ERROR_MSG,
  UNAUTHORIZED,
  UNAUTHORIZED_ERROR_MSG,
  FORBIDDEN,
  FORBIDDEN_ERROR_MSG,
  SECRET_PHRASE,
};
