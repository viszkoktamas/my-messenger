const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const userRoutes = require('./routes/user');

const app = express();

const MONGO_DB_URL =
  'mongodb+srv://' +
  process.env.MONGO_ATLAS_USER +
  ':' +
  process.env.MONGO_ATLAS_PW +
  '@' +
  process.env.MONGO_ATLAS_URL +
  '/my-messenger';

mongoose
  .connect(MONGO_DB_URL, { useNewUrlParser: true, useCreateIndex: true, useFindAndModify: true })
  .then(() => {
    console.log('mongodb connected');
  })
  .catch(err => {
    console.log('mongodb connection error', err);
  });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/images', express.static(path.join('backend/images')));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  next();
});

app.use('/api/user', userRoutes);

module.exports = app;
