//requires
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser')


//Inicializar variables
var app = express();

//Body Parser
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


//Importar rutas
var appRoutes = require('./routes/app');
var usuarioRoutes = require('./routes/usuario');
var loginRoutes = require('./routes/login');
var hospitalRoutes = require('./routes/hospital');
var medicoRoutes = require('./routes/medico');
var busquedaRoutes = require('./routes/busqueda');
var busquedaRoutes = require('./routes/upload');
var busquedaimagenes = require('./routes/imagenes');

//Conexión a la base de datos
mongoose.connection.openUri('mongodb://localhost:27017/HospitalDb',  {
    useCreateIndex: true,
    useNewUrlParser: true
},
(err,res) => {
    if(err) {
        console.log("\x1b[31m%s\x1b[0m", err)
        throw err;
    }
    console.log('Base de datos: \x1b[32m%s\x1b[0m','online');

});

//Rutas
app.use('/usuario',usuarioRoutes);
app.use('/hospital',hospitalRoutes);
app.use('/medico',medicoRoutes);
app.use('/busqueda',busquedaRoutes);
app.use('/upload',busquedaRoutes);
app.use('/img',busquedaimagenes);
app.use('/login',loginRoutes);

app.use('/',appRoutes);

//Escuchar peticiones
app.listen(3000, () => {
    console.log('Express server puerto 3000: \x1b[32m%s\x1b[0m','online');
});