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

//==========================
//Verificar admin
//==========================

exports.verificaAdmin = function(req, res, next){

    var usuario = req.usuario;

    if(usuario.role === 'ADMIN_ROLE'){
        next();
        return;
    }else{
        return res.status(401).json({
            ok: false,
            mensaje: 'Token invalido - No es administrador',
            errors: {message: "No es usuario administrador"}
        });
    }
}

//==========================
//Verificar admin o mismo usuario
//==========================

exports.verificaMismoUsuario = function(req, res, next){

    var usuario = req.usuario;
    var id = req.params.id;

    if(usuario.role === 'ADMIN_ROLE' || usuario._id === id){
        next();
        return;
    }else{
        return res.status(401).json({
            ok: false,
            mensaje: 'Token invalido - No es administrador ni es el mismo usuarios',
            errors: {message: "No es usuario administrador"}
        });
    }
}