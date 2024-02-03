const { ERROR_UNAUTHORIZED_CODE } = require('../utility/constants');

class UnauthorizedError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = ERROR_UNAUTHORIZED_CODE;
  }
}

module.exports = UnauthorizedError;
