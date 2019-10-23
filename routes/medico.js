var Medico = require('../models/medico');
var express = require('express');
var mdAutenticacion = require('../middlewares/autenticacion');

var app = express();


//========================================
//Peticion GET general
//========================================
app.get('/', (req, res) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    Medico.find({})
    .skip(desde)
    .limit(5)
    .populate('usuario', 'nombre email')
    .populate('hospital')
    .exec((err,medicos) => {
        if(err){
            res.status(500).json({
                ok: false,
                mensaje: 'Error al recuperar la lista de medicos',
                errors: err
            });
        }

        Medico.count({},(err,conteo) => {
            res.status(200).json({
                ok: true,
                total: conteo,
                medicos: medicos
            });
        })
    });
});



//========================================
//Peticion POST
//========================================
app.post('/', mdAutenticacion.verificaToken, (req, res) => {
    var body = req.body;

    var medico = new Medico({
        nombre: body.nombre,
        img: body.img,
        usuario: req.usuario._id,
        hospital: body.hospitalId
    });

    medico.save((err, nuevoMedico) => {
        if(err){
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear un nuevo medico',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            mensaje: 'Medico creado',
            medico: nuevoMedico,
            usuario: req.usuario
        });
    });
})

//========================================
//Peticion PUT
//========================================
app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;
    var body = req.body;

    Medico.findById(id, (err, medico) => {
        if(err){
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al recuperar el medico a actualizar',
                errors: err
            });
        }

        if(!medico){
            return res.status(400).json({
                ok: false,
                mensaje: 'No se encontro ningun medico con el id: ' + id
            })
        }

        medico.nombre = body.nombre
        medico.img = body.img
        medico.usuario = req.usuario
        medico.horpital = body.horpitalId

        medico.save((err, medicoActualizado) => {
            if(err){
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al actualizar el medico',
                    errors: err
                });
            }
    
            res.status(200).json({
                ok: true,
                mensaje: 'Medico actualizado',
                medico: medicoActualizado,
                usuario: req.usuario
            });
        });

    });

})


//========================================
//Peticion DELETE
//========================================
app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;

    Medico.findByIdAndDelete(id, (err,medicoEliminar) => {
        if(err){
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al eliminar el medico',
                errors: err
            });
        }

        res.status(200).json({
            ok: true,
            mensaje: 'Medico eliminado',
            medico: medicoEliminar
        })

    })
})


module.exports = app;