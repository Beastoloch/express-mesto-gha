const express = require('express');
const mongoose = require('mongoose');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const { errors, celebrate, Joi } = require('celebrate');
const bodyParser = require('body-parser');
const auth = require('./middlewares/auth');
const { login, createUser } = require('./controllers/users');
const {
  ERROR_DEFAULT_CODE,
  ERROR_NOT_FOUND_CODE,
  allowedCors,
  DEFAULT_ALLOWED_METHODS} = require('./utility/constants');

const { PORT = 3000 } = process.env;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});

app.use(helmet());
app.use(limiter);

app.use(function(req, res, next) {
  const { origin } = req.headers;
  const { method } = req;
  console.log(origin);
  console.log(allowedCors);

  if (method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
    return res.end();
  }
  if (allowedCors.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }

  next();
});

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().min(8).required(),
  }),
}), login);
app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().min(8).required(),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().regex(/[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/i),
  }),
}), createUser);

app.use(auth);

app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.use((req, res) => {
  res.status(ERROR_NOT_FOUND_CODE).send({ message: 'Неверный путь' });
});

app.use(errors());
app.use((err, req, res, next) => {
  const { statusCode = ERROR_DEFAULT_CODE, message } = err;
  res.status(statusCode).send({ message: statusCode === ERROR_DEFAULT_CODE ? 'На сервере произошла ошибка' : message });
  next();
});

app.listen(PORT, () => {
  console.log(`Сервер работает на порте ${PORT}`);
});
