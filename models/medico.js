var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var medicoSchema = new Schema({
    nombre: {type: String, required: [true, 'El nombre es obligatorio']},
    img: {type: String, required: false},
    usuario: {type: Schema.Types.ObjectId, ref: 'usuario', required: true},
    hospital: {type: Schema.Types.ObjectId, ref: 'hospital', required: [true, 'El id hospital es un campo obligatorio']}

});

module.exports = mongoose.model('medico', medicoSchema);