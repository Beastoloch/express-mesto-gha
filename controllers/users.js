const User = require('../models/users');
const {
  ERROR_DEFAULT_CODE,
  ERROR_BAD_INPUT_CODE,
  ERROR_NOT_FOUND_CODE,
} = require('../utility/constants');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(() => res.status(ERROR_DEFAULT_CODE).send({ message: 'Произошла ошибка' }));
};

module.exports.getUsersById = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        res.status(ERROR_NOT_FOUND_CODE).send({ message: 'Пользователь не найден' });
        return;
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_BAD_INPUT_CODE).send({ message: 'Неккоректный _id пользователя' });
        return;
      }
      res.status(ERROR_DEFAULT_CODE).send({ message: 'Произошла ошибка' });
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_BAD_INPUT_CODE).send({ message: 'Некорректные данные' });
        return;
      }
      res.status(ERROR_DEFAULT_CODE).send({ message: 'Произошла ошибка' });
    });
};

module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about }, { runValidators: true, new: true })
    .then((user) => {
      if (!user) {
        res.status(ERROR_NOT_FOUND_CODE).send({ message: 'Пользователь не найден' });
        return;
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_BAD_INPUT_CODE).send({ message: 'Некорректные данные' });
        return;
      }
      res.status(ERROR_DEFAULT_CODE).send({ message: 'Произошла ошибка' });
    });
};

module.exports.updateUserAvatar = (req, res) => {
  const avatar = req.body;

  User.findByIdAndUpdate(req.user._id, avatar, { runValidators: true, new: true })
    .then((user) => {
      if (!user) {
        res.status(ERROR_NOT_FOUND_CODE).send({ message: 'Пользователь не найден' });
        return;
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_BAD_INPUT_CODE).send({ message: 'Некорректные данные' });
        return;
      }
      res.status(ERROR_DEFAULT_CODE).send({ message: 'Произошла ошибка' });
    });
};
