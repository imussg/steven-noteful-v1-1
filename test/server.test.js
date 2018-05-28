const app = require('../server');
const chai = require('chai');
const chaiHttp = require('chai-http');

const expect = chai.expect;

chai.use(chaiHttp);

describe('Reality check', function () {

	it('true should be true', function () {
		expect(true).to.be.true;
	});

	it('2 + 2 should equal 4', function () {
		expect(2 + 2).to.equal(4);
	});

});

describe('Express static', function () {

	it('GET request "/" should return the index page', function () {
		return chai.request(app)
			.get('/')
			.then(function (res) {
				expect(res).to.exist;
				expect(res).to.have.status(200);
				expect(res).to.be.html;
			});
	});

	it('Creates a JSON list of notes from the GET call', function() {
		// Test for GET /api/notes
		return chai.request(app)
			.get('/api/notes')
			.then(res => {
				// response must be an array of 10 notes
				expect(res).to.be.json;
				expect(res.body).to.be.a('array');
				expect(res.body.length).to.equal(10);

				const expectedKeys = ['id', 'title', 'content'];
				res.body.forEach(note => {
					// assert each item is object and contains the given keys
					expect(note).to.be.a('object');
					expect(note).to.include.keys(expectedKeys);
				});
			});
	});

	it('Returns the relevant object when ID is refered to in a GET call', function() {
		
		return chai.request(app)
			.get('/api/notes')
			.then(res => {
				const tempId = res.body[0].id;
				return chai.request(app)
					.get(`/api/notes/${tempId}`);
			})
			.then(res => {
				const expectedKeys = ['id', 'title', 'content'];
				expect(res).to.have.status(200);
				expect(res).to.be.json;
				expect(res.body.length).to.equal(1);
				expect(res.body[0]).to.be.a('object');
				expect(res.body[0]).to.include.keys(expectedKeys);
			});
	});

	it('Returns 404 if the given ID does not exist', function() {
		// should respond with a 404 for an invalid id (/api/notes/DOESNOTEXIST)
		return chai.request(app)
			.get('/api/notes/INVALID')
			.then(res => {
				expect(res).to.have.status(404);
			});
	});

	it('POSTs a new note successfully', function() {

		return chai.request(app)
			.get('/api/notes')
			.then(res => {
				const newNote = {
					id: (1000 + res.body.length),
					title: 'some note',
					content: 'the contents of some new notes'
				};
				return chai.request(app)
					.post('/api/notes')
					.send(newNote);
			})
			.then(res => {
				expect(res).to.have.status(201);
				expect(res).to.be.json;
				expect()
			});
	});

});

describe('404 handler', function () {

	it('should respond with 404 when given a bad path', function () {
		return chai.request(server)
			.get('/DOES/NOT/EXIST')
			.then(res => {
				expect(res).to.have.status(404);
			});
	});

});

describe('RESTful Endpoint calls', function() {
	// GET request "/" should return the index page
	it('should return the index page', function() {

	})
})