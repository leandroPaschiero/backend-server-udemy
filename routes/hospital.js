var Hospital = require('../models/hospital');
var express = require('express');
var mdAutenticacion = require('../middlewares/autenticacion');



var app = express();

//========================================
//Peticion GET general
//========================================
app.get('/',(req,res) => {
    var desde = req.query.desde || 0;
    desde = Number(desde);

    Hospital.find({})
        .skip(desde)
        .populate('usuario', 'nombre email')
        .exec((err, hospitales) =>{
        if(err){
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al recuperar la lista de hospitales',
                errors: err
            });
        }

        Hospital.count({}, (err, conteo) => {
            res.status(200).json({
                ok: true,
                total: conteo,
                hospitales: hospitales
            });

        })

    });
});


//========================================
//Peticion POST
//========================================
app.post('/', mdAutenticacion.verificaToken ,(req, res) => {
    var body = req.body;

    var hospital = new Hospital({
        nombre: body.nombre,
        img: body.img,
        usuario: req.usuario._id
    });

    hospital.save((err, nuevoHospital) => {
        if(err){
            return res.status(400).json({
                ok: false,
                mensaje: 'Error cuando se intenta crear un nuevo hospital',
                errors: err
            })
        }

        res.status(201).json({
            ok:true,
            mensaje: 'Nuevo hospital',
            hospital: nuevoHospital,
            usuario: req.usuario
        })
    })
});


//========================================
//Peticion PUT
//========================================
app.put('/:id', mdAutenticacion.verificaToken ,(req, res) => {
    var id = req.params.id
    var body = req.body;

    Hospital.findById(id, (err, hospital) => {
        if(err){
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al actulizar el hospital',
                errors: err
            });
        }

        if(!hospital){
            return res.status(400).json({
                ok: false,
                mensaje: 'No se encontro ningun hospital con id: ' + id,
                errors: err
            });
        }

        hospital.nombre = body.nombre;
        hospital.img = body.img;
        hospital.usuario = body.usuario;

        hospital.save((err, hospitalActualizado) => {
            if(err){
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error cuando se intenta actualizar el hospital',
                    errors: err
                })
            }
    
            res.status(200).json({
                ok:true,
                mensaje: 'Hospital actualizado',
                hospital: hospitalActualizado,
                usuario: req.usuario
            })
        })
    })
});

//========================================
//Peticion DELETE
//========================================
app.delete('/:id', mdAutenticacion.verificaToken ,(req, res) => {
    var id = req.params.id;
    
    Hospital.findByIdAndDelete(id, (err, hospitalEliminado) => {
        if(err){
            return res.status(500).json({
                ok: false,
                mensaje: 'Error cuando se intenta eliminar el hospital',
                errors: err
            });
        }

        res.status(200).json({
            ok: true,
            mensaje: 'Hospital eliminado',
            hospital: hospitalEliminado,
            usuario: req.usuario
        })
    })
});




module.exports = app;