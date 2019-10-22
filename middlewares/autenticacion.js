var SEED = require('../config/config').SEED;
var jwt = require('jsonwebtoken');

//==========================
//Verificar token (Este metodo bloquea a los siguientes en el hasta que el token sea valido)
//==========================

exports.verificaToken = function(req, res, next){

    var token = req.query.token;
    
    jwt.verify(token, SEED, (err, decoded) => {
        if(err){
            return res.status(401).json({
                ok: false,
                mensaje: 'Token invalido',
                errors: err
            });
        }

        req.usuario = decoded.usuario;
    
        next();
    })
}
