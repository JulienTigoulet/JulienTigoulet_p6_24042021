const User = require('../models/user');
//import jsonwebtoken
const jwt = require('jsonwebtoken');
//import bcrypt
const bcrypt = require('bcrypt');
//import crypto-js
const CryptoJS = require("crypto-js");
require('dotenv').config();
const db= {
    keyEmail: process.env.KEY_CRYPTOEMAIL,
    keyToken: process.env.KEY_TOKEN
};
//création d'un compte
exports.signup = (req, res, next) => {
    const emailCrypted = CryptoJS.HmacSHA256(req.body.email,`${db.keyEmail}`).toString();
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
    const emailCrypted = CryptoJS.HmacSHA256(req.body.email,`${db.keyEmail}`).toString();
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
                    `${db.keyToken}`,
                    { expiresIn: '24h' }
                    )
                });
            })
            .catch(error => res.status(500).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};