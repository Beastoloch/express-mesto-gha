const Card = require('../models/cards');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then(cards => res.send({ data: cards }))
    .catch(err => res.status(500).send({ message: err.message }));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  console.log(req.user);
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then(card => res.send({ data: card }))
    .catch(err => {
      if(err.name === 'ValidationError'){
        res.status(400).send({ message: err.message });
      }
      else{
        res.status(500).send({ message: err.message })
      }
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndDelete(req.params.cardId)
    .then(card => {
      if(!card){
        res.status(404).send({ message: "Карточка не найдена" });
        return;
      }
      res.send({data: "Карточка успешно удалена"})
    })
    .catch(err => res.status(500).send({ message: err.message }));
};

module.exports.likeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.user._id } },
  { new: true },
)
  .then((card) => {
    if(!card){
      res.status(404).send({ message: "Карточка не найдена" });
      return;
    }
    res.send({data: card})
  })
  .catch(err => {
    if(err.name === 'ValidationError'){
      res.status(400).send({ message: err.message });
    }
    else{
      res.status(500).send({ message: err.message })
    }
  });

module.exports.dislikeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user._id } },
  { new: true },
)
  .then((card) => {
    if(!card){
      res.status(404).send({ message: "Карточка не найдена" });
      return;
    }
    res.send({data: card})
  })
  .catch(err => {
    if(err.name === 'ValidationError'){
      res.status(400).send({ message: err.message });
    }
    else{
      res.status(500).send({ message: err.message })
    }
  });
