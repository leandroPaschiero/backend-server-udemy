var express = require('express');
var Hospital = require('../models/hospital');
var Medico = require('../models/medico');
var Usuario = require('../models/usuario');

var app = express();


//=======================================
//Busqueda general
//=======================================
app.get('/todo/:busqueda',(req,res) => {

    var busqueda = req.params.busqueda;
    var regex = new RegExp(busqueda, 'i');

    Promise.all([buscarHospitales(busqueda,regex), buscarMedicos(busqueda,regex), buscarUsuarios(busqueda,regex)])
        .then(response => {
        res.status(200).json({
            ok: true,
            hospitales: response[0],
            medicos: response[1],
            usuarios: response[2]
        })
    })
});

//=======================================
//Busqueda especifica
//=======================================
app.get('/coleccion/:tabla/:busqueda',(req,res) => {
    var busqueda = req.params.busqueda;
    var tabla = req.params.tabla;
    var regex = new RegExp(busqueda, 'i');

    var promesa;

    switch (tabla.toLocaleLowerCase()) {
        case 'usuarios':
            promesa = buscarUsuarios(busqueda, regex);
            break;
        case 'medicos':
            promesa = buscarMedicos(busqueda, regex);
            break;
        case 'hospitales':
            promesa = buscarHospitales(busqueda, regex);
            break;
        default:
            return res.status(404).json({
                ok:false,
                hospitales: 'No existe la tabla a la que intenta acceder'
            });
    }

    promesa.then(response => {
        res.status(200).json({
            ok:true,
            [tabla]: response
        });
    })
})


function buscarHospitales(busqueda, regex){

    return new Promise((resolve, reject) => {
        
        Hospital.find({nombre: regex})
        .populate('usuario','nombre email')
        .exec((err,hospitales) => {
            if(err){
                reject('Error al cargar hospitales', err);
            }else{
                resolve(hospitales);
            }
        });
    });
}

function buscarMedicos(busqueda, regex){

    return new Promise((resolve, reject) => {
        
        Medico.find({nombre: regex})
        .populate('usuario', 'nombre email')
        .populate('hospital')
        .exec((err,medicos) => {
            if(err){
                reject('Error al cargar medicos', err);
            }else{
                resolve(medicos);
            }
        });
    });
}

function buscarUsuarios(busqueda, regex){

    return new Promise((resolve, reject) => {
        
        Usuario.find({}, 'nombre email img')
            .or([{'nombre' : regex},{'email' : regex}])
            .exec((err, usuarios) => {
                if(err){
                    reject('Error al cargar usuarios', err);
                } else {
                    resolve(usuarios);
                }
            })
    });
}

module.exports = app;