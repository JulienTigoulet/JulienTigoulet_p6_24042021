const passwordValidator =require('../models/passwordValidator')

module.exports = (req, res, next) =>{
    if (!passwordValidator.validate(req.body.password)) {
        return res.status(401).json({error:'password pas assez complexe'});
                 
    } else {
        next();
    }

}