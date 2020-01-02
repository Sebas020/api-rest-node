'use strict'

var validator = require('validator');
var bcrypt = require('bcrypt-nodejs');
var User = require('../models/user');
var jwt = require('../services/jwt');//Requerir el servicio de jason web token para encriptar usuario que hemos creado para usarlo
//Éstas son librerias que trae internamente nodejs para poder trabajar con el sistema de archivos...
var fs = require('fs');
var path = require('path');
//Clase
var controller = {

	probando: function(req, res){
		return res.status(200).send({
			message: "Soy el método probando"
		});
	},

	testeando: function(req, res){
		return res.status(200).send({
			message: "Soy el método testeando"
		});
	},
	save: function(req, res){
		//Recoger los parámetros de la petición
		var params = req.body;
		//Validar los datos con validator
		try{
			var validate_name= !validator.isEmpty(params.name);
			var validate_surname= !validator.isEmpty(params.surname);
			var validate_email= !validator.isEmpty(params.email) && validator.isEmail(params.email);
			var validate_password= !validator.isEmpty(params.password);
		}catch(ex){
			return res.status(200).send({
				message: 'Faltan datos por enviar'
			});
		}
		//console.log(validate_name, validate_surname, validate_email, validate_password);
		if(validate_name && validate_surname && validate_email && validate_password){
			//Crear el objeto del usuario
			var user = new User();
			//Asignar valores al objeto usuario que me han llegado desde la petición
			user.name = params.name;
			user.surname = params.surname;
			user.email = params.email.toLowerCase();
			user.role = 'ROLE_USER';
			user.image = null;
			//Comprobar si el usuario existe
			User.findOne({email: user.email}, (err, issetUser)=>{
				if(err){
					return res.status(500).send({
						message: 'Error al comprobar duplicidad de usuario'
					});
				}
				if(!issetUser){
					//si no existe 

					//cifrar la contraseña con bcrypnodejs
					bcrypt.hash(params.password, null, null, (err, hash) =>{
						user.password = hash;
						// y guardar usuarios
						user.save((err, userStored) => {
							if(err){
								return res.status(500).send({
									message: 'Error al guardar el usuario'
								});
							}
							if(!userStored){
								return res.status(500).send({
									message: 'El usuario no se ha guardado'
								});
							}
							//Devolver respuesta
							return res.status(200).send({
								status: 'success',
								user: userStored});
						});//Close save
					});//Close bcrypt
					
				}else{
					return res.status(200).send({
						message: 'El usuario ya está registrado'
					});
				}
			});
			
		}else{
			return res.status(200).send({
				message: 'Validación de los datos del usuario incorrecta, intentalo de nuevo'
			});
		}
	},
	login: function(req, res){
		//Recoger los parámetros de la petición
		var params = req.body;//El body son los datos que yo le mando desde el formulario
		//Validar los datos
		try{
			var validate_email = !validator.isEmpty(params.email) && validator.isEmail(params.email);
			var validate_password = !validator.isEmpty(params.password);
		}catch(ex){
			return res.status(200).send({
				message: 'Faltan datos por enviar'
			});
		}

		if(!validate_email || !validate_password){
			return res.status(200).send({
				message: 'Los datos ingresados son incorrectos'
			});
		}
		//Buscar usuarios que coincidan con el email
		User.findOne({email: params.email.toLowerCase()}, (err, user) => {
			if(err){
				return res.status(500).send({
					message: 'Error al intentar identificarse'
				});
			}

			if(!user){
				return res.status(404).send({
					message: 'El usuario no existe'
				});
			}
			//Si lo encuentra,
			//Comprobar la contraseña (Coincidencia de email y password / bcrypt)
			bcrypt.compare(params.password, user.password, (err, check) => {
				//Si es correcto, 
				if(check){
					//Generar token de jwt y devolverlo
					if(params.gettoken){
						//Devolver los datos del usuario en el token
						return res.status(200).send({
							token: jwt.createToken(user)
						});
					}else{
						//Limpiar el objeto para devolver solamente los datos que nos interesan
						user.password = undefined;
						//Devolver los datos
						return res.status(200).send({
								status: 'success',
								user
						});
					}

					
				}else{
					return res.status(200).send({
						message: 'Las credenciales no son correctas'
					});
				}
				
			});
			
		});
		
		
	},
	update: function(req, res){//Crear middleware para comprobar el jwt token, para ponerselo a la ruta
		//un middleware es un método que se ejecuta antes de ejecutar la acción del controlador
		//Recoger los datos del usuario
		var params = req.body;
		//validar los datos
		try{
			var validate_name= !validator.isEmpty(params.name);
			var validate_surname= !validator.isEmpty(params.surname);
			var validate_email= !validator.isEmpty(params.email) && validator.isEmail(params.email);
		}catch(ex){
			return res.status(200).send({
				message: 'Faltan datos por enviar'
			});
		}
		
		//Eliminar prpiedades innecesarias
		delete params.password;
		
		//User.findOneAndUpdate(condicion, datos a actualizar, opciones, callback)
		//Buscar y actualizar documento
		var userId = req.user.sub;
		
		//Comprobar si el email es único
		if(req.user.email != params.email){
			User.findOne({email: params.email.toLowerCase()}, (err, user) => {
				if(err){
					return res.status(500).send({
						message: 'Error al intentar la comprobación'
					});
				}

				if(user && user.email == params.email){
					return res.status(200).send({
						message: 'El email no puede ser modificado'
					});
				}else{
					//Buscar y modificar el usuario
					User.findOneAndUpdate({_id: userId}, params, {new: true}, (err, userUpdated) => {
						
						if(err){
							return res.status(500).send({
								status: 'error',
								message: 'Error al actualizar usuario'
							});
						}

						if(!userUpdated){
							return res.status(200).send({
								status: 'error',
								message: 'No se ha actualizado el usuario'
							});
						}
						//Devolver respuesta
						return res.status(200).send({
							status: 'success',
							user: userUpdated
						});
					});
				}
			});	
		}else{
			//Buscar y modificar el usuario
			User.findOneAndUpdate({_id: userId}, params, {new: true}, (err, userUpdated) => {
				
				if(err){
					return res.status(500).send({
						status: 'error',
						message: 'Error al actualizar usuario'
					});
				}

				if(!userUpdated){
					return res.status(200).send({
						status: 'error',
						message: 'No se ha actualizado el usuario'
					});
				}
				//Devolver respuesta
				return res.status(200).send({
					status: 'success',
					user: userUpdated
				});
			});
		}
	},
	uploadAvatar: function(req, res){
		//Configurar el modulo multiparty (middleware) para habilitar la subida de ficheros => routes/user.js
		
		//Recoger el fichero de la petición
		var file_name = 'Avatar no subido...';

		if(!req.files){
			return res.status(404).send({
				status: 'error',
				message: file_name
			});
		}
		//Conseguir el nombre y la extensión del archivo subido
		var file_path = req.files.file0.path;
		var file_split = file_path.split('\\');

		//** Advertencia ** En linus o mac 
		//var file_split = file_path.split('\\');
		//Nombre del archivo
		var file_name = file_split[2];
		//Extensión del archivo
		var ext_split = file_name.split('\.');
		var file_ext = ext_split[1];
		//Comprobar extensión sólo imagenes, si no es valida borrar fichero subido
		if(file_ext != 'png' && file_ext != 'jpg' && file_ext != 'jpeg' && file_ext != 'gif'){
			fs.unlink(file_path, (err) => {
				return res.status(200).send({
					status: 'error',
					message: 'La extensión del archivo no es válida.'
				});
			});
		}else{
			//Sacar el id de usuario identificado
			var userId = req.user.sub;
			//Buscar y actualizar documento de la bd
			User.findOneAndUpdate({_id: userId}, {image: file_name}, {new: true}, (err, userUpdated) => {
				if(err || !userUpdated){
					return res.status(500).send({
						status: 'error',
						message: 'Error al guardar el usuario'
					});
				}
				//Devolver respuesta
				return res.status(200).send({
					status: 'success',
					user: userUpdated
				});
			});
		}
	},
	avatar: function(req, res){
		var fileName = req.params.fileName;
		var pathFile = './uploads/users/' + fileName;

		fs.exists(pathFile, (exists) => {
			if(exists){
				//Utilizamos el método sendFile de la response para enviar la imagen y además utilizamos la libreria de path para resolver el archivo que se encuentra en la ruta especificada
				return res.sendFile(path.resolve(pathFile));//Con el resolve nos devuelve el archivo jpg osea la imagen mas no sólo el hexadecimal
			}else{
				return res.status(404).send({
					message: 'La imagen no existe'
				});
			}
		});
	},
	getUsers: function(req, res){
		User.find().exec((err, users) => {
			if(err || !users){
				res.status(404).send({
					status: 'error',
					message: 'No hay usuarios que mostrar'
				});
			}
			res.status(200).send({
				status: 'success',
				users
			});
		});
	},
	getUser: function(req, res){
		var userId = req.params.userId;

		User.findById(userId).exec((err, user)=>{
			if(err || !user){
				return res.status(404).send({
					status: 'error',
					message: 'No Existe el usuario'
				});
			}
			return res.status(200).send({
				status: 'success',
				user
			});
		});
	}
};

module.exports = controller;