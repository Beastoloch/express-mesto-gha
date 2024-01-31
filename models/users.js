const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: [2, 'Минимимальная длина поля name: 2'],
    maxlength: [30, 'Максимальная длина поля name: 30'],
    required: [true, 'Поле name должно быть заполнено']
  },
  about: {
    type: String,
    minlength: [2, 'Минимимальная длина поля about: 2'],
    maxlength: [30, 'Максимальная длина поля about: 30'],
    required: [true, 'Поле about должно быть заполнено']
  },
  avatar: {
    type: String,
    validate: {
      validator: (url) => validator.isURL(url),
      message: 'Несуществующий URL'
    },
    required: [true, 'Поле avatar должно быть заполнено']
  }
});

module.exports = mongoose.model('user', userSchema);
