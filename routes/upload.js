var express = require('express');
var fileUpload = require('express-fileupload');
var fs = require('fs');

var app = express();

var Hospital = require('../models/hospital');
var Medico = require('../models/medico');
var Usuario = require('../models/usuario');

// default options
app.use(fileUpload());

app.put('/:tipo/:id',(req,res) => {
    
    var tipo = req.params.tipo;
    var id = req.params.id;

    var tiposValidos = ['hospitales', 'medicos', 'usuarios'];

    
    if(tiposValidos.indexOf(tipo) < 0){
        return res.status(400).json({
            ok: false,
            mensaje: 'path no valido',
            errors: {message: 'Los paths validos son: ' + tiposValidos.join(', ')}
        });
    }

    if(!req.files){
        return res.status(400).json({
            ok: false,
            mensaje: 'No se selecciono ninguna imagen',
            errors: {message: 'Debe seleccionar una imagen'}
        });
    }

    var archivo = req.files.imagen;
    var nombreCortado = archivo.name.split('.');
    var extencion = nombreCortado[nombreCortado.length - 1];
    var extenciones = ['jpg','png','gif','jpeg'];

    if(extenciones.indexOf(extencion) < 0){
        return res.status(400).json({
            ok: false,
            mensaje: 'Extencion no valida',
            errors: {message: 'Las extenciones válidas son: ' + extenciones.join(', ')}
        });
    }

    var nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extencion}`;
    var path = `./uploads/${tipo}/${nombreArchivo}`;

    archivo.mv(path, err => {
        if(err){
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al mover archivo',
                errors: err
            });
        }


        subirPorTipo(tipo,id,nombreArchivo,res);
    })
});

function subirPorTipo(tipo, id, nombreArchivo, res){

    switch (tipo) {
        case 'usuarios':
            Usuario.findById(id, (err, usuario) => {

                if(!usuario){
                    return res.status(400).json({
                        ok: false,
                        mensaje: 'No existe el usuario',
                        errors: {message: 'No existe el usuario'}
                    })
                }

                var pathViejo = './uploads/usuarios/' + usuario.img;
    
                //Si existe, elimina la imagen anterior
                if(fs.existsSync(pathViejo)){
                    fs.unlinkSync(pathViejo);
                }
    
                usuario.img = nombreArchivo;
                usuario.save((err,usuarioActualizado)=> {
                    usuarioActualizado.password = '******';
                    return res.status(200).json({
                        ok: true,
                        mensaje: 'Imagen actualizada',
                        usuario: usuarioActualizado
                    })
                })
    
            });
            break;
        case 'medicos':
            Medico.findById(id, (err, medico) => {

                
                if(!medico){
                    return res.status(400).json({
                        ok: false,
                        mensaje: 'No existe el medico',
                        errors: {message: 'No existe el medico'}
                    })
                }

                var pathViejo = './uploads/medicos/' + medico.img;
    
                //Si existe, elimina la imagen anterior
                if(fs.existsSync(pathViejo)){
                    fs.unlinkSync(pathViejo);
                }
    
                medico.img = nombreArchivo;
                medico.save((err,medicoActualizado)=> {
                    return res.status(200).json({
                        ok: true,
                        mensaje: 'Imagen actualizada',
                        medico: medicoActualizado
                    })
                })
    
            });
            break;
        case 'hospitales':
            Hospital.findById(id, (err, hospital) => {

                if(!hospital){
                    return res.status(400).json({
                        ok: false,
                        mensaje: 'No existe el hospital',
                        errors: {message: 'No existe el hospital'}
                    })
                }

                var pathViejo = './uploads/hospital/' + hospital.img;
    
                //Si existe, elimina la imagen anterior
                if(fs.existsSync(pathViejo)){
                    fs.unlinkSync(pathViejo);
                }
    
                hospital.img = nombreArchivo;
                hospital.save((err,hospitalActualizado)=> {
                    return res.status(200).json({
                        ok: true,
                        mensaje: 'Imagen actualizada',
                        hospital: hospitalActualizado
                    })
                })
    
            });
            break;
    
        default:
            return res.status(400).json({
                ok: false,
                mensaje: 'Ruta de acceso invalida'
            });
            break;
    }
}


module.exports = app;