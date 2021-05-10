const User = require('../models/user');
//import jsonwebtoken
const jwt = require('jsonwebtoken');
//import bcrypt
const bcrypt = require('bcrypt');
//import crypto-js
const CryptoJS = require("crypto-js");

//création d'un compte
exports.signup = (req, res, next) => {
    const emailCrypted = CryptoJS.HmacSHA256(req.body.email, "UukFSurzKQLbhKkzP7PhSY0sRv8ZzVC6HmLnXzgquqCt4wpQBDc1Tp9GQuoBOy7t5jLa9cJTLA9iAncuEzUDUhyKqOJwRYMuVzuz").toString();
    bcrypt.hash(req.body.password, 10)
      .then(hash => {
        const user = new User({
          email: emailCrypted,
          password: hash
        });
        user.save()
          .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
          .catch(error => res.status(400).json({ error }));
      })
      .catch(error => res.status(500).json({ message:'Utilisateur pas crée' }));
  };
//login d'un compte déjà créer
exports.login = (req, res, next) => {
    const emailCrypted = CryptoJS.HmacSHA256(req.body.email, "UukFSurzKQLbhKkzP7PhSY0sRv8ZzVC6HmLnXzgquqCt4wpQBDc1Tp9GQuoBOy7t5jLa9cJTLA9iAncuEzUDUhyKqOJwRYMuVzuz").toString();
    // comparaison de l'emailLogin avec l'email en base de donné
    User.findOne({ email:emailCrypted})
    .then(user => {
        if (!user) {
            return res.status(401).json({ error: 'Utilisateur non trouvé !' });
        }
        bcrypt.compare(req.body.password, user.password)
            .then(valid => {
                if (!valid) {
                    return res.status(401).json({ error: 'Mot de passe incorrect !' });
                }
                res.status(200).json({
                    userId: user._id,
                    token: jwt.sign(
                    { userId: user._id },
                    '994T0Z0GTCtfxXg0y8Qfgtrmi1iu0JCc1wH8b6QmeBzBYyHUcBlqOYwV6stDrMXb8SlmqFcqesRJ6Zr7yuUC4xrA4DAxFocvpxRR6syiEdFaclAOKQyinqAM',
                    { expiresIn: '24h' }
                    )
                });
            })
            .catch(error => res.status(500).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};