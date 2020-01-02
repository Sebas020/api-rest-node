'user strict'

var jwt = require('jwt-simple');
var moment = require('moment');

exports.createToken = function(user){
	//Este es el objeto con el que vamos a generar el token y el objeto que le vamos a enviar al cliente o al front para que lo persista y tenga esa información del usuario registrado
	var payload = {//Dentro de jwt el paiload son todos los datos del usuario que queremos identificar y generar su toquen
		sub: user._id,
		name: user.name,
		surname: user.surname,
		email: user.email,
		role: user.role,
		image: user.image,
		iat: moment().unix(),//fecha de creación
		exp: moment().add(30, 'days').unix//fecha de expiración del token
	};
	return jwt.encode(payload, 'clave-secreta-para-generar-el-token-999');//Vamos a usar el método encode de la libreria de jwt para generar el token del paiload.
};