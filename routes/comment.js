'use strict'

var express = require('express'); //Me permite cargar las rutas
var CommentController = require('../controllers/comment');//Cargar el controlador topic 

var router = express.Router();//Cargar el router de express para que funcionen las rutas
var md_auth = require('../middlewares/authenticated');//Cargar el middleware de autenticación
//Crear las rutas
router.post('/comment/topic/:topicId', md_auth.authenticated, CommentController.add);
router.put('/comment/:commentId', md_auth.authenticated, CommentController.update);
router.delete('/comment/:topicId/:commentId', md_auth.authenticated, CommentController.delete);
module.exports = router;