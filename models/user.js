'use strict'
//El orm es el mongoose, el orm es una capa de abstracción que nos facilitará mucho el uso con la bd, ésta tiene propiedades y funciones creadas para la manipulación de la bd
var mongoose = require('mongoose');
var Schema = mongoose.Schema;//Esto me permite crear esquemas de mongoose, definir propiedades que va a tener el objeto
var UserSchema = Schema({
	name: String,
	surname: String,
	email: String,
	role: String,
	password: String,
	image: String
});
//Eliminar una propiedad el objeto cuando hacemos un get, en este caso vamos a eliminar la password para que no se muestre al cliente
UserSchema.methods.toJSON = function(){
	var obj = this.toObject();
	delete obj.password;

	return obj;
}
module.exports = mongoose.model('User', UserSchema);//Exporto para poder requerirlo como un modulo de nodejs en cualquier archivo, el .model es una propiedad de mongoose que permite exportar modelos, y al exportarlo crear un objeto con todas las propiedades del esquema generado por mongoose, ademas la funcion hace un lowercase y pluraliza el nombre, por lo que la colección de datos se llamaría 'users', y dentro de esa colección habran un monton de documenos con el mismo esquema que se creo con UserSchema
