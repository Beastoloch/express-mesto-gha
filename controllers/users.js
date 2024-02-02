const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/users');

const { NODE_ENV, JWT_SECRET } = process.env;
const {
  ERROR_BAD_INPUT_CODE,
  ERROR_NOT_FOUND_CODE,
  ERROR_AUTH_CODE,
  SUCCESS_AUTH_CODE,
  ERROR_TAKEN_EMAIL_CODE,
} = require('../utility/constants');

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch((err) => next(err));
};

module.exports.getUsersById = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        const err = new Error('Пользователь не найден');
        err.statusCode = ERROR_NOT_FOUND_CODE;
        next(err);
        return;
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        const e = new Error('Неккоректный _id пользователя');
        e.statusCode = ERROR_BAD_INPUT_CODE;
        next(e);
        return;
      }
      next(err);
    });
};

module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req.user)
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      next(err);
    });
};

module.exports.createUser = (req, res, next) => {
  const {
    email, password, name, about, avatar,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      email, password: hash, name, about, avatar,
    })
      .then((user) => {
        res.status(SUCCESS_AUTH_CODE).send({
          name: user.name,
          about: user.about,
          avatar: user.avatar,
          email: user.email,
          _id: user._id,
        });
      })
      .catch((err) => {
        if (err.name === 'ValidationError') {
          const e = new Error('Некорректные данные');
          e.statusCode = ERROR_BAD_INPUT_CODE;
          next(e);
          return;
        }
        if (err.code === 11000) {
          const e = new Error('Этот email уже зарегистрирован');
          e.statusCode = ERROR_TAKEN_EMAIL_CODE;
          next(e);
          return;
        }
        next(err);
      }));
};

module.exports.updateUser = (req, res, next) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true })
    .then((user) => {
      if (!user) {
        const err = new Error('Пользователь не найден');
        err.statusCode = ERROR_NOT_FOUND_CODE;
        next(err);
        return;
      }
      res.send({ data: user });
    })
    .catch((err) => {
      next(err);
    });
};

module.exports.updateUserAvatar = (req, res, next) => {
  const avatar = req.body;

  User.findByIdAndUpdate(req.user._id, avatar, { runValidators: true, new: true })
    .then((user) => {
      if (!user) {
        const err = new Error('Пользователь не найден');
        err.statusCode = ERROR_NOT_FOUND_CODE;
        next(err);
        return;
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        const e = new Error('Некорректные данные');
        e.statusCode = ERROR_BAD_INPUT_CODE;
        next(e);
        return;
      }
      next(err);
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      res.send({
        token: jwt.sign(
          { _id: user._id },
          NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
          { expiresIn: '7d' },
        ),
      });
    })
    .catch((err) => {
      if (err.message === 'Неправильные почта или пароль') {
        const e = new Error(err.message);
        e.statusCode = ERROR_AUTH_CODE;
        next(e);
      }
      next(err);
    });
};
