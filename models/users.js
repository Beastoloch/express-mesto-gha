const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: [2, 'Минимимальная длина поля name: 2'],
    maxlength: [30, 'Максимальная длина поля name: 30'],
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    minlength: [2, 'Минимимальная длина поля about: 2'],
    maxlength: [30, 'Максимальная длина поля about: 30'],
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    validate: {
      validator: (url) => validator.isURL(url),
      message: 'Несуществующий URL',
    },
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
  },
  email: {
    type: String,
    validate: {
      validator: (email) => validator.isEmail(email),
      message: 'Несуществующий email',
    },
    required: true,
    unique: true,
  },
  password: {
    type: String,
    select: false,
    required: true,
    minlength: 8,
    maxLength: 64,
  },
});

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error('Неправильные почта или пароль'));
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new Error('Неправильные почта или пароль'));
          }

          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
