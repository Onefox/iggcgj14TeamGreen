var express = require("express"),
	fs = require("fs"),
	http = require("http"),
	app = express(),
	server = http.createServer(app),
	io = require("socket.io").listen(server, {log: false}),
	stylus = require("stylus");

// config
app.use(stylus.middleware({src: __dirname + "/htdocs", compress: true, debug: true, force: true}));
app.use(express.static(__dirname + '/htdocs'));

server.listen(3000);
console.log("Server started.");

// connected
io.sockets.on('connection', function(socket) {
	// returns the spritelist
	socket.on("getSpriteList", function getSpriteList(callback) {
		var dir = __dirname + "/htdocs/img/sprites/",
			Emitter = require("events").EventEmitter,
			fileEmitter = new Emitter(),
			foundFiles = [];

		// this event will be called when all files have been added to foundFiles
		fileEmitter.on("filesReady", function() {
			callback(foundFiles);
		});

		// read all files from the directory
		fs.readdir(dir, function(err, files) {
			// error occurred
			if (err) {
				callback(["ERR", "Folder not found: " + dir]);
				return;
			}

			// push each new file into the array
			files.forEach(function(file) {
				foundFiles.push(file);
			});

			// trigger filesReady event
			fileEmitter.emit("filesReady");
		});
	});

	// saves the level under the given name
	socket.on("saveLevel", function saveLevel(name, data, callback) {
		fs.writeFile(__dirname + "/level/" + name + ".lvl", JSON.stringify(data), function(err) {
			if(err) {
				console.log(err);
			} else {
				callback();
			}
		});
	});

	// loads level
	socket.on("loadLevel", function loadLevel(name, callback) {
		fs.readFile(__dirname + "/level/" + name + ".lvl", 'utf8', function(err, data) {
			if (err) {
				console.log(err);
			}
			
			callback(JSON.parse(data));
		});
	});

	// returns chunk
	socket.on("getChunk", function getChunk(x, y, callback) {
		// chunk doesn't AND shouldn't exist
		if (!world.chunks[x]) {
			return;
		}

		if (!world.chunks[x][y]) {
			return;
		}

		callback(world.chunks[x][y], x, y);
	});
});