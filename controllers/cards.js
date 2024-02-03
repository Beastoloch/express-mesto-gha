const Card = require('../models/cards');

const BadRequestError = require('../errors/bad-request-error');
const NotFoundError = require('../errors/not-found-error');
const ForbiddenError = require('../errors/forbidden-error');

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
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Некорректные данные'));
      } else {
        next(err);
      }
    });
};

module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        next(new NotFoundError('Карточка не найдена'));
        return;
      }
      if (!(card.owner.equals(req.user._id))) {
        next(new ForbiddenError('Недостаточно прав'));
        return;
      }
      Card.deleteOne(card)
        .then(() => {
          res.send({ data: 'Карточка успешно удалена' });
        });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Неккоректный _id карточки'));
      } else {
        next(err);
      }
    });
};

module.exports.likeCard = (req, res, next) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.user._id } },
  { new: true },
)
  .then((card) => {
    if (!card) {
      next(new NotFoundError('Карточка не найдена'));
      return;
    }
    res.send({ data: card });
  })
  .catch((err) => {
    if (err.name === 'CastError') {
      next(new BadRequestError('Неккоректный _id карточки'));
    } else {
      next(err);
    }
  });

module.exports.dislikeCard = (req, res, next) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user._id } },
  { new: true },
)
  .then((card) => {
    if (!card) {
      next(new NotFoundError('Карточка не найдена'));
      return;
    }
    res.send({ data: card });
  })
  .catch((err) => {
    if (err.name === 'CastError') {
      next(new BadRequestError('Неккоректный _id карточки'));
    } else {
      next(err);
    }
  });
