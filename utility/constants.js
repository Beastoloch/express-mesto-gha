module.exports.SUCCESS_AUTH_CODE = 201;
module.exports.ERROR_BAD_INPUT_CODE = 400;
module.exports.ERROR_AUTH_CODE = 401;
module.exports.ERROR_FORBIDDEN_CODE = 403;
module.exports.ERROR_NOT_FOUND_CODE = 404;
module.exports.ERROR_TAKEN_EMAIL_CODE = 409;
module.exports.ERROR_DEFAULT_CODE = 500;

module.exports.allowedCors = [
  'https://praktikum.tk',
  'http://praktikum.tk',
  'http://localhost:3000',
  'localhost:3000',
  'https://mesto.beastoloch.nomoredomainsmonster.ru',
  'http://mesto.beastoloch.nomoredomainsmonster.ru',
];

module.exports.DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';
