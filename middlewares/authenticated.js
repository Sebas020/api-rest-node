'use strict'
var jwt = require('jwt-simple');
var moment = require('moment');
var secret = 'clave-secreta-para-generar-el-token-999';

exports.authenticated = function(req, res, next) {

	//Comprobar si llega authorización
	if(!req.headers.authorization){
		return res.status(403).send({
			message: 'La petición no tiene la cabecera de authorizaión'
		});
	}

	//Limpiar el token y quitar comillas
	var token = req.headers.authorization.replace(/['"]+/g, '');
	
	try{
		//Decodificar el token 
		var payload = jwt.decode(token, secret);//Decodificar los datos del token y generar un objeto del usuario identificado
		//Comprobar si el token ha expirado
		if(payload.exp <= moment.unix()){
			return res.status(404).send({
				message: 'El token ha expirado'
			});
		}
	}catch(ex){
		return res.status(404).send({
			message: 'El token no es válido'
		});
	}
	//Adjunatar usuario identificado a la request para tener siempre el usuario identificado en la request y poder acceder a las propiedades de este
	req.user = payload;
	//Pasar a la acción
	next();
}