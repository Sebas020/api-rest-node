'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mongoosePaginate = require('mongoose-paginate-v2');//Cargar la librería para la paginación
//Modelo de comment
var CommentSchema = Schema({
	content: String,
	date: { type: Date, default: Date.now },
	user: { type: Schema.ObjectId, ref: 'User' }
});
var Comment = mongoose.model('Comment', CommentSchema);
//Modelo de topic
var TopicSchema = Schema({
	title: String,
	content: String,
	code: String,
	lang: String,
	date: { type: Date, default: Date.now },
	user: { type: Schema.ObjectId, ref: 'User' },//Hace la relación con el esquema de usuario que ya creamos anteriormente populado la información de ese documento y permitiendonos crear un objeto de ésta dentro del documento de topics, osea la información del usuario que realizó ese foro
	comments: [CommentSchema] //Hacer que todos la información que se almacene aquí sea del tipo de CommentSchema, osea un documento embebido de los comentarios dentro de los topics
});

// Cargar paginación
TopicSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Topic', TopicSchema);