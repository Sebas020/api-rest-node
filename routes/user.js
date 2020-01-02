'use strict'
//Aquí se definiran todas las rutas del usuario
var express = require('express');//Requerimos el express para utilizar el router de express
var UserController = require('../controllers/user');//Requerimos o instanciamos el controlador a utilizar

var router = express.Router();//Creamos la variable router con el Router de express para crear las url
var md_auth = require('../middlewares/authenticated');//Requerir el middleware
var multipart = require('connect-multiparty');//Requerir la librería que nos permitirá subir archivos
var md_upload = multipart({ uploadDir: './uploads/users' });//Configurar las opciones del miltipar(modificar middleware) y pasarle las opciones y configuraciones que necesitamos
//Creamos las url o rutas
//Rutas de prueba
router.get('/probando', UserController.probando);
router.post('/testeando', UserController.testeando);
// Rutas de usuario
router.post('/register', UserController.save);
router.post('/login', UserController.login);
router.put('/user/update', md_auth.authenticated, UserController.update);//Para usar el middleware en la ruta se lo pasamos como segundo parámtro a la función de la ruta
router.post('/upload-avatar', [md_auth.authenticated, md_upload], UserController.uploadAvatar);//user el middleware de subida de imagenes e identificación, para pasar varios middleware se deben pasar entre corchetes, osea pasarle un array con estas propiedades
router.get('/avatar/:fileName', UserController.avatar);
router.get('/users', UserController.getUsers);
router.get('/user/:userId', UserController.getUser);

//Exportamos el módulo
module.exports = router;