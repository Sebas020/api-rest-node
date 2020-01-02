'use strict'

//Requires
var express = require('express');
var bodyParser = require('body-parser');//Convierte lo que viene de las peticiones a objetos de javascript
//Ejcutar express
var app = express();
//Cargar archivos de rutas
var user_routes = require('./routes/user');
var topic_routes = require('./routes/topic');
var comment_routes = require('./routes/comment');
//Añadir middlewares
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());//Convierte petición en objeto json
// Configurar cabeceras y cors
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

//Reescribir rutas cargarlas y que funcionen en express y en general en la aplicación
app.use('/api', user_routes);
app.use('/api', topic_routes);
app.use('/api', comment_routes);
//Exportar el modulo
module.exports = app;