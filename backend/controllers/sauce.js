const Sauce = require('../models/sauce');


//créer une sauce
exports.postSauce =(req, res, next) => {
  const sauceForm = JSON.parse(req.body.sauce);
  delete sauceForm._id;
  const sauce = new Sauce({
      ...sauceForm,
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,

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
//trouver une sauce unique
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
      .then(sauce => res.status(200).json(sauce))
      .catch(error => res.status(404).json({ error }));
  };

//modifier une sauce
exports.modificationOneSauce = (req, res, next) => {
    Sauce.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
      .then(() => res.status(200).json({ message: 'Sauce modifiée !'}))
      .catch(error => res.status(400).json({ error }));
  };

//delete une sauce
exports.deleteOneSauce = (req, res, next) => {
    Sauce.deleteOne({ _id: req.params.id })
      .then(() => res.status(200).json({ message: 'Sauce supprimée !'}))
      .catch(error => res.status(400).json({ error }));
  };