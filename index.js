'use strict'

var mongoose = require('mongoose');
var app = require('./app');
var port = process.env.PORT || 3999;//Indicarle el puerto por default o uno que nosotros le pasemos
mongoose.set('useFindAndModify', false);
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/api_rest_node', { useNewUrlParser: true })
			.then(() => {
				console.log('La conexión a la base de datos de mongo se ha realizado correctamente');
				//crear el servidor
				app.listen(port, () => {
					console.log("El servidor http://localhost:3999 está funcionando!!!")
				});
			})
			.catch(error => console.log(error));