'use strict';

const express = require('express');
// Load array of notes
const data = require('./db/notes');
const { requestLogger } = require('./middleware/logger');

const app = express();

const { PORT } = require('./config');

app.use(requestLogger);
// ADD STATIC SERVER HERE
app.use(express.static('public'));

app.get('/api/notes', (req, res) => {
	res.json(data);
});

const findNote = function(id) {
	// console.log(`the ID being "found": ${id}, and typeof: ${typeof id}`);
	for(let i=0; i<data.length; i++) {
		// console.log(`"data" note ID: ${data[i].id}, and typeof: ${typeof data[i].id}`);
		if(id == data[i].id) {
			return data[i];
		}
	}
	return {error: "ID not found"};
};

app.get('/api/notes/:id', (req, res) => {
	res.json(findNote(req.params.id));
});

app.get('/boom', (req, res, next) => {
	throw new Error('Boom!!');
});

app.use(function (req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	res.status(404).json({ message: 'Not Found' });
});

app.use(function (err, req, res, next) {
	res.status(err.status || 500);
	res.json({
		message: err.message,
		error: err
	});
});

// Listen for incoming connections
if (require.main === module) {
	app.listen(PORT, function () {
		console.info(`Server listening on ${this.address().port}`);
	}).on('error', err => {
		console.error(err);
	});
}

module.exports = app; // Export for testing
