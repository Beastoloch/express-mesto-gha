const Card = require('../models/cards');
const {
  ERROR_BAD_INPUT_CODE,
  ERROR_NOT_FOUND_CODE,
  ERROR_FORBIDDEN_CODE,
} = require('../utility/constants');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch((err) => next(err));
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      next(err);
    });
};

module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        const err = new Error('Карточка не найдена');
        err.statusCode = ERROR_NOT_FOUND_CODE;
        next(err);
        return;
      }
      if (!(card.owner.equals(req.user._id))) {
        const err = new Error('Недостаточно прав');
        err.statusCode = ERROR_FORBIDDEN_CODE;
        next(err);
        return;
      }
      Card.deleteOne(card)
        .then(() => {
          res.send({ data: 'Карточка успешно удалена' });
        });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        const e = new Error('Неккоректный _id карточки');
        e.statusCode = ERROR_BAD_INPUT_CODE;
        next(e);
        return;
      }
      next(err);
    });
};

module.exports.likeCard = (req, res, next) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.user._id } },
  { new: true },
)
  .then((card) => {
    if (!card) {
      const err = new Error('Карточка не найдена');
      err.statusCode = ERROR_NOT_FOUND_CODE;
      next(err);
      return;
    }
    res.send({ data: card });
  })
  .catch((err) => {
    if (err.name === 'CastError') {
      const e = new Error('Неккоректный _id карточки');
      e.statusCode = ERROR_BAD_INPUT_CODE;
      next(e);
      return;
    }
    next(err);
  });

module.exports.dislikeCard = (req, res, next) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user._id } },
  { new: true },
)
  .then((card) => {
    if (!card) {
      const err = new Error('Карточка не найдена');
      err.statusCode = ERROR_NOT_FOUND_CODE;
      next(err);
      return;
    }
    res.send({ data: card });
  })
  .catch((err) => {
    if (err.name === 'CastError') {
      const e = new Error('Неккоректный _id карточки');
      e.statusCode = ERROR_BAD_INPUT_CODE;
      next(e);
      return;
    }
    next(err);
  });
