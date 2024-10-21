const jwt = require('jsonwebtoken');

module.exports={
    validateRegister:(req,res,next)=>{
        //minimo de caracteres de nombre de usuario ==== 5
        if(!req.body.username || req.body.username.length < 5){
            console.log(req.body.username);
            return res.status(400).send({
                msg:'Por favor, escribe un nombre de usuario mayor a 5 caracteres.'
            });
        }

        //minimo de caracteres de contraseña ==== 5
        if (!req.body.password || req.body.password.length < 5){
            return res.status(400).send({
                msg:'Por favor, escribe una contrasela de minimo 5 caracteres.'
            });
        }

        //que al confirmar contraseñas, ambas coincidan
        if(!req.body.repeat_password || req.body.repeat_password != req.body.password){
            return res.status(400).send({
                msg:'Ambas contraseñas deben de coincidir.'
            });
        }
        next();
    },

    isLoggedIn:(req,res,next)=>{
        try{
            const token = req.headers.authorization.split('')[1];
            const decoded = jwt.verify(token,'SECRETKEY');
            req.userData = decoded;
            next()
        }
        catch (err){
            return res.status(401).send({
                msg:'Tu sesión ya expiró'
            });
        }
    }
};