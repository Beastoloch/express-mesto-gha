const mongoose = require('mongoose');
const validator = require('validator');

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: [2, 'Минимимальная длина поля name: 2'],
    maxlength: [30, 'Максимальная длина поля name: 30'],
    required: [true, 'Поле name должно быть заполнено'],
  },
  link: {
    type: String,
    validate: {
      validator: (url) => validator.isURL(url),
      message: 'Несуществующий URL',
    },
    required: [true, 'Поле avatar должно быть заполнено'],
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  likes: {
    type: Array,
    default: [],
    items: {
      type: [mongoose.Schema.Types.ObjectId, 'Неккоректный _id пользователя'],
      ref: 'user',
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('card', cardSchema);
