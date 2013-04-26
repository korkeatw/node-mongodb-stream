/**
 * Author: KHASATHAN
 * Date: 23 Apr 2013
 * Description: Streaming data in collection and push to client.
 */

/**
 * Required modules 
 */
var Sio = require('socket.io');
var Mongoose = require('mongoose');
var Http = require('http');
var Step = require('step');
var Toolbox = require('toolbox');

/**
 * HTTP server
 */
var app = Http.createServer(function(req, res) {
	res.end('This is Nodejs server');
});

// Listening on port 9000
app.listen(9000);

/**
 * MongoDB
 */
// Point url to MongoDB server
// Ex. mongodb://<USERNAME>:<PASSWD>@<HOST>:<PORT>/<DATABASE> (custom port)
// or mongodb://<USERNAME>:<PASSWD>@<HOST>/<DATABASE> (default port)
Mongoose.connect('mongodb://USERNAME:PASSWD@127.0.0.1/DB');
Mongoose.connection;
// Define object schema
var schema = Mongoose.Schema;
var objectId = schema.Types.ObjectId;
var textSchema = Mongoose.Schema({
	_id : objectId
	,text : String
});
// parameters are object name, object schema, collection name
var Text = Mongoose.model('object_name', textSchema, 'text_collection');

Step(
	function getLastId() {
		Text.find().sort({_id : -1}).limit(1).exec(this);
	},
	function (err, docs) {
		if(err) console.log(err);
		// set lastId to 000000000000000000000000 (24 digits)
		// if collection is empty
		var lastId = (docs.length == 0) ? 
			'000000000000000000000000' : docs[0]._id;
		
		/**
		* Socket.io
		*/
		var io = Sio.listen(app)
			.enable('browser client minification')
			.enable('browser client etag')
			.enable('browser client gzip')
			.set('transports', ['xhr-polling']) // using 
			.set('polling duration', 10) // in second
			.set('log level', 1); // log level 1 just show only info message

		io.sockets.on('connection', function(socket) {
			// In the first time, when user connect to server
			// return last 5 documents to client
			var q = (lastId == '000000000000000000000000') ? 
				{} : { _id : lastId };
			
			// For push message. 
			// MongoDB collection MUST BE capped collection.
			var stream = Text.find()
				.where('_id')
				.gt(lastId)
				.select('_id text')
				.tailable()
				.stream();
			stream.on('data', function(doc) {
				setTimeout(function() {
					socket.emit('update-resp', doc);
					lastId = doc._id;
				}, 3500); // delay before push to client
			});
		});
	}
);
