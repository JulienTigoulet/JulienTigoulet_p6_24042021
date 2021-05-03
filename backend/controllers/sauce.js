const Sauce = require('../models/sauce');
// import fs --> accés au fichier "img"
const fs = require('fs');

//créer une sauce
exports.postSauce =(req, res, next) => {
  const sauceForm = JSON.parse(req.body.sauce);
  delete sauceForm._id;
  const sauce = new Sauce({
      ...sauceForm,
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
      likes:0,
      dislikes:0,
  });
  sauce.save()
    .then(() => res.status(201).json({ message: 'Sauce créée !' }))
    .catch(error => res.status(400).json({ error }));
};

//voir toute les sauces
exports.getAllSauces = (req, res, next) => {
  Sauce.find()
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(400).json({ error }));
};

//trouver une sauce
exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(404).json({ error }));
};

//modifier une sauce
exports.modificationOneSauce = (req, res, next) => {
  const sauceObject = req.file ?
    {
      ...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
  Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Sauce modifié !'}))
    .catch(error => res.status(400).json({ error }));
};

//Supprimer une sauce
exports.deleteOneSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
      const filename = sauce.imageUrl.split('/images/')[1];
      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Sauce supprimée !'}))
          .catch(error => res.status(400).json({ error }));
      });
    })
    .catch(error => res.status(500).json({ error }));
};
  // userlike/userdislike fonctionne avec UserId[like],[dislike] et [usersLike],[usersDislike]

exports.likeSauce = (req,res,next) =>{
  Sauce.findOne ({_id: req.params.id })
  .then(sauce =>{
    //userlike +1
    if (req.body.like === 1) {
      Sauce.updateOne({ _id: req.params.id }, {
        $inc: { likes: 1 },
        $push: { usersLiked: req.body.userId },
        _id: req.params.id
      })
      .then(() => res.status(201).json({ message: 'Like ajouté !' }))
      .catch(error => res.status(400).json({ error }));
    }
    //userlike/userdislike -1
    if (req.body.like === 0) {
      // userdislike -1
      if (sauce.usersDisliked.find(user => user === req.body.userId)) {
        Sauce.updateOne({ _id: req.params.id }, {
          $inc: { dislikes: -1 },
          $pull: { usersDisliked: req.body.userId },
          _id: req.params.id
        })
        .then(() => res.status(201).json({ message: '-1 Dislike' }))
        .catch(error => res.status(400).json({ error }));
      }
      // like -1
      else {
        Sauce.updateOne({ _id: req.params.id }, {
          $inc: { likes: -1 },
          $pull: { usersLiked: req.body.userId },
          _id: req.params.id
        })
        .then(() => res.status(201).json({ message: ' -1 Like' }))
        .catch(error => res.status(400).json({ error }))
      }
    };
    //dislike +1
    if (req.body.like === -1) {
      Sauce.updateOne({ _id: req.params.id }, {
      $inc: { dislikes: 1 },
      $push: { usersDisliked: req.body.userId },
      _id: req.params.id
      })
      .then(() => res.status(201).json({ message: 'Dislike !' }))
      .catch(error => res.status(400).json({ error }))
    }  
  })
};
