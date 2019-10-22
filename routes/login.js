var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var Usuario = require('../models/usuario');
var SEED = require('../config/config').SEED;

var app = express();


app.post('/', (req, res) => {

    var body = req.body;

    Usuario.findOne({email: body.email}, (err, usuarioDB) => {

        if(err){
            return res.status(500).json({
                ok: false,
                mensaje: "Error al recuperar cuenta",
                errors: err
            })
        }

        if(!usuarioDB){
            return res.status(400).json({
                ok: false,
                mensaje: "Credenciales incorrectas - email",
                errors: err
            });
        }

        if(!bcrypt.compareSync(body.password, usuarioDB.password) ){
            return res.status(400).json({
                ok: false,
                mensaje: "Credenciales incorrectas - pasword",
                errors: err
            });
        }

        //Crear un token
        var token = jwt.sign({ usuario: usuarioDB}, SEED, { expiresIn: 14400 /*4 horazs*/ })

        usuarioDB.password = "******";
                
        res.status(200).json({
            ok: true,
            usuario: usuarioDB,
            token: token,
            id: usuarioDB._id
        })
    })
});


module.exports = app;