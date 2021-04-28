const express = require('express');
const sauceRoutes = express.Router();

const sauceCtrl =  require('../controllers/sauce');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

// création d'une nouvelle sauce
sauceRoutes.post('/',auth ,multer ,sauceCtrl.postSauce);
// modification d'une sauce
sauceRoutes.put('/:id',auth ,sauceCtrl.modificationOneSauce);
// suppression d'une sauce
sauceRoutes.delete('/:id',auth ,sauceCtrl.deleteOneSauce);
// recupération une sauce
sauceRoutes.get('/:id',auth ,sauceCtrl.getOneSauce);
// recupération des sauces
sauceRoutes.get('/',auth ,sauceCtrl.getAllSauces);

module.exports = sauceRoutes;