const User = require('../models/users');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then(users => res.send({data: users}))
    .catch(err => res.status(500).send({ message: err.message }));
};

module.exports.getUsersById = (req, res) => {
  User.findById(req.params.userId)
    .then(user => {
      if(!user){
        res.status(404).send({ message: "Пользователь не найден" });
        return;
      }
      res.send({data: user})
    })
    .catch(err => res.status(500).send({ message: err.message }));
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then(user => {
      res.send({ data: user })
    })
    .catch(err => {
      if(err.name === 'ValidationError'){
        res.status(400).send({ message: err.message })
      }
      else{
        res.status(500).send({ message: err.message })
      }
    });
};

module.exports.updateUser = (req, res) => {
  User.findByIdAndUpdate(req.user._id, req.body, { runValidators: true })
    .then(user => {
      if(!user){
        res.status(404).send({ message: "Пользователь не найден" });
        return;
      }
      res.send({data: user})
    })
    .catch(err => {
      if(err.name === 'ValidationError'){
        res.status(400).send({ message: err.message })
      }
      else{
        res.status(500).send({ message: err.message })
      }
    });
};

module.exports.updateUserAvatar = (req, res) => {
  const { link } = req.body;

  User.findByIdAndUpdate(req.user._id, link, { runValidators: true })
    .then(user => {
      if(!user){
        res.status(404).send({ message: "Пользователь не найден" });
        return;
      }
      res.send({data: user})
    })
    .catch(err => {
      if(err.name === 'ValidationError'){
        res.status(400).send({ message: err.message })
      }
      else{
        res.status(500).send({ message: err.message })
      }
    });
};
