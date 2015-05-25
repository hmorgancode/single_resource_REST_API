'use strict';

var chai = require('chai');
var chaiHttp = require('chai-http');
var expect = chai.expect;

var mongoose = require('mongoose');
var Rabbit = require('../lib/models/models.js').Rabbit;

chai.use(chaiHttp);

var server = require('../lib/server.js'); //run our server
var token; //(this should definitely not be out here and i am sorry)

describe('Single-Resource REST API', function() {

  before(function(done) {
    //server.once('started', function() { //Unnecessary, auth_test will be run first
    done();
    //});
  });
  after(function(done) {
    //mongoose.connection.db.dropDatabase(function() {
    //mongoose.connection.db.emit('first tests done');
    done();
    //});
  });

  it('should be able to sign in a user', function(done) {
    chai.request('localhost:3000')
      .get('/sign_in')
      .auth('bleh@example.com', 'foobar123')
      .end(function(err, res) {
        expect(err).to.eql(null);
        expect(res.status).to.eql(200);
        expect(res.body).to.have.property('token');
        token = res.body.token;
        done();
      });
  });

  it('should be able to add a new rabbit', function(done) {
    chai.request('localhost:3000')
      .post('/rabbits')
      .send({eat: token, name: 'Shrubs', weight: 10})
      .end(function(err, res) {
        expect(err).to.eql(null);
        expect(res.status).to.eql(200);
        expect(res.body).to.have.property('_id');
        expect(res.body.name).to.eql('Shrubs');
        done();
      });
  });

  it('should be able to get an array of all rabbits', function(done) {
    chai.request('localhost:3000')
      .get('/rabbits')
      .send({eat: token})
      .end(function(err, res) {
        expect(err).to.eql(null);
        expect(res.status).to.eql(200);
        expect(typeof res.body).to.eql('object');
        expect(Array.isArray(res.body)).to.eql(true);
        done();
      });
  });
});

describe('REST API continued', function() {
  var testRabbit;
  beforeEach(function(done) {
    testRabbit = new Rabbit({name: 'Buckles', weight: '6'});
    testRabbit.save(function(err, data) {
      if (err) throw err;
      testRabbit = data;
      done();
    });
  });
  after(function(done) {
    mongoose.connection.db.dropDatabase(function() {
      done();
    });
  });

  it('should be able to update a rabbit', function(done) {
    chai.request('localhost:3000')
      .put('/rabbits')
      .send({eat: token, name: 'Buckles 2', weight: 11, _id: testRabbit._id}) //that got dark quickly!
      .end(function(err, res) {
        expect(err).to.eql(null);
        expect(res.status).to.eql(200);
        expect(res.body.msg).to.eql('success');
        done();
      });
  });

  it('should be able to delete a rabbit', function(done) {
    chai.request('localhost:3000')
      .delete('/rabbits')
      .send({eat: token, _id: testRabbit._id}) //(Buckles 2 just wasn't the same as Buckles 1)
      .end(function(err, res) {
        expect(err).to.eql(null);
        expect(res.status).to.eql(200);
        expect(res.body.msg).to.eql('success');
        done();
      });
  });

  it('should have a 404 page', function(done) {
    chai.request('localhost:3000')
    .get('/rtyui873v98y3v')
    .end(function(err, res) {
      expect(err).to.eql(null);
      expect(res.status).to.eql(404);
      expect(res.body.msg).to.eql('Could not find page.');
      done();
    });
  });
}); //end describe
