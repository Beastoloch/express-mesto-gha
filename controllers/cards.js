const Card = require('../models/cards');
const {
  ERROR_DEFAULT_CODE,
  ERROR_BAD_INPUT_CODE,
  ERROR_NOT_FOUND_CODE} = require("../utility/constants");


module.exports.getCards = (req, res) => {
  Card.find({})
    .then(cards => res.send({ data: cards }))
    .catch(err => res.status(ERROR_DEFAULT_CODE).send({ message: "Некорректные данные" }));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  console.log(req.user);
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then(card => res.send({ data: card }))
    .catch(err => {
      if(err.name === 'ValidationError'){
        res.status(ERROR_BAD_INPUT_CODE).send({ message: "Некорректные данные" });
        return;
      }
      res.status(ERROR_DEFAULT_CODE).send({ message: "Произошла ошибка" });
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndDelete(req.params.cardId)
    .then(card => {
      if(!card){
        res.status(ERROR_NOT_FOUND_CODE).send({ message: "Карточка не найдена" });
        return;
      }
      res.send({data: "Карточка успешно удалена"})
    })
    .catch(err => {
      if(err.name === 'CastError'){
        res.status(ERROR_BAD_INPUT_CODE).send({ message: 'Неккоректный _id пользователя' });
        return;
      }
      res.status(ERROR_DEFAULT_CODE).send({ message: "Произошла ошибка" })
    });
};

module.exports.likeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.user._id } },
  { new: true },
)
  .then((card) => {
    if(!card){
      res.status(ERROR_NOT_FOUND_CODE).send({ message: "Карточка не найдена" });
      return;
    }
    res.send({data: card})
  })
  .catch(err => {
    if(err.name === 'ValidationError'){
      res.status(ERROR_BAD_INPUT_CODE).send({ message: "Некорректные данные" });
      return;
    }
    if(err.name === 'CastError'){
      res.status(ERROR_BAD_INPUT_CODE).send({ message: 'Неккоректный _id пользователя' });
      return;
    }
    res.status(ERROR_DEFAULT_CODE).send({ message: "Произошла ошибка" })
  });

module.exports.dislikeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user._id } },
  { new: true },
)
  .then((card) => {
    if(!card){
      res.status(ERROR_NOT_FOUND_CODE).send({ message: "Карточка не найдена" });
      return;
    }
    res.send({data: card})
  })
  .catch(err => {
    if(err.name === 'ValidationError'){
      res.status(ERROR_BAD_INPUT_CODE).send({ message: "Некорректные данные" });
      return;
    }
    if(err.name === 'CastError'){
      res.status(ERROR_BAD_INPUT_CODE).send({ message: 'Неккоректный _id пользователя' });
      return;
    }
    res.status(ERROR_DEFAULT_CODE).send({ message: "Произошла ошибка" })
  });
