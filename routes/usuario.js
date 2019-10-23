var Usuario = require('../models/usuario');
var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var mdAutenticacion = require('../middlewares/autenticacion');


var app = express();

//==========================
//Obtener todos los usuarios
//==========================
app.get('/',(req,res,next) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    Usuario.find({ }, 'nombre email img role')
        .skip(desde)
        .limit(5)
        .exec((err, usuarios) => {
        if(err){
            return res.status(500).json({
                ok: false,
                mensaje: 'Error cargando usuario',
                errors: err
            });
        }

        Usuario.count({}, (err, conteo) => {
            res.status(200).json({
                ok: true,
                total: conteo,
                usuarios: usuarios
            });
        });


    });


});

//==========================
//Crear nuevo usuario
//==========================
app.post('/', mdAutenticacion.verificaToken, (req,res)=> {
    var body = req.body;

    var usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    usuario.save((err, usuarioGuardado) => {
        if(err){
            return res.status(400).json({
                ok: false,
                mensaje: "Error al crear usuario",
                error: err
            })
        }

        res.status(201).json({
            ok: true,
            usuario: usuario,
            usuarioToken: req.usuario
        });
    });

});


//==========================
//actualizar usuario
//==========================
app.put('/:id', mdAutenticacion.verificaToken, (req,res) => {
    var id = req.params.id;
    var body = req.body;

    Usuario.findById(id, (err, usuario) => {
        if(err){
            return res.status(500).json({
                ok: false,
                mensaje: "Error al buscar usuario",
                error: err
            })
        }

        if(!usuario){
            return res.status(400).json({
                ok: false,
                mensaje: "El usuario con el id " + id + " no existe",
                errors: {message: 'No existe un usuario con ese ID'}
            })
        }
        
        usuario.nombre = body.nombre
        usuario.email = body.email
        usuario.role = body.role

        usuario.save ((err, usuarioGuardado) => {
            if(err){
                return res.status(400).json({
                    ok: false,
                    mensaje: "Error al actualizar usuario",
                    error: err
                });
            }

            usuarioGuardado.password = "******"

            res.status(200).json({
                ok:true,
                usuario: usuarioGuardado
            });
        })
    });
});


//==========================
//Eliminar usuario
//==========================
app.delete('/:id', mdAutenticacion.verificaToken, (req,res) => {
    var id = req.params.id;

    Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
        if(err){
            return res.status(500).json({
                ok: false,
                mensaje: "Error al borrar usuario",
                error: err
            });
        }

        res.status(200).json({
            ok:true,
            usuario: usuarioBorrado
        });
    })
})


module.exports = app;