'use strict'

var express = require('express'); //Me permite cargar las rutas
var TopicController = require('../controllers/topic');//Cargar el controlador topic 

var router = express.Router();//Cargar el router de express para que funcionen las rutas
var md_auth = require('../middlewares/authenticated');//Cargar el middleware de autenticación
//Crear las rutas
router.get('/test', TopicController.test);
router.post('/topic', md_auth.authenticated, TopicController.save);
router.get('/topics/:page?', TopicController.getTopics);
router.get('/user-topics/:user', TopicController.getTopicsByUser);
router.get('/topic/:id', TopicController.getTopic);
router.put('/topic/:id', md_auth.authenticated, TopicController.update);
router.delete('/topic/:id', md_auth.authenticated, TopicController.delete);
router.get('/search/:search', TopicController.search);
module.exports = router;