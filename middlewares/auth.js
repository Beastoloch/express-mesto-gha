const jwt = require('jsonwebtoken');
const { ERROR_AUTH_CODE } = require('../utility/constants');

const handleAuthError = (res) => {
  res
    .status(ERROR_AUTH_CODE)
    .send({ message: 'Необходима авторизация' });
};

const extractBearerToken = (header) => header.replace('Bearer ', '');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return handleAuthError(res);
  }

  const token = extractBearerToken(authorization);
  let payload;

  try {
    payload = jwt.verify(token, 'test-key');
  } catch (err) {
    return handleAuthError(res);
  }

  req.user = payload;
  next();
  return null;
};