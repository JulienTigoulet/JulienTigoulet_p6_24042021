//import express
const express = require('express');
//import bodyParser
const bodyParser = require('body-parser');
//import mongose
const mongoose = require('mongoose');
//import path -->ligne 34
const path = require('path');
//import helmet
const helmet = require('helmet');

//import routes
const userRoutes = require('./routes/user');
const sauceRoutes = require('./routes/sauce');
//dotenv import
require('dotenv').config();
const db = {
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD
}

const app = express();
//mongoose connexion
mongoose.connect(`mongodb+srv://${db.username}:${db.password}@cluster0.rbn4y.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));
//access controle
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });
app.use(express.json());
app.use(helmet());

// Backend images --> statique (path)
app.use('/images', express.static(path.join(__dirname, 'images')));

app.use('/api/auth', userRoutes);
app.use('/api/sauces', sauceRoutes);

module.exports = app;