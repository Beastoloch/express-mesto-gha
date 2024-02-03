module.exports.SUCCESS_AUTH_CODE = 201;
module.exports.ERROR_BAD_REQUEST_CODE = 400;
module.exports.ERROR_UNAUTHORIZED_CODE = 401;
module.exports.ERROR_FORBIDDEN_CODE = 403;
module.exports.ERROR_NOT_FOUND_CODE = 404;
module.exports.ERROR_CONFLICT_CODE = 409;
module.exports.ERROR_DEFAULT_CODE = 500;

module.exports.regexURL = /[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/i;

module.exports.allowedCors = [
  'https://praktikum.tk',
  'http://praktikum.tk',
  'http://localhost:3000',
  'localhost:3000',
  'https://mesto.beastoloch.nomoredomainsmonster.ru',
  'http://mesto.beastoloch.nomoredomainsmonster.ru',
];

module.exports.DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';
