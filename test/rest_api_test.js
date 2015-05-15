'use strict';

var chai = require('chai');
var chaiHttp = require('chai-http');
var expect = chai.expect;
var sequelize = require('sequelize');

var models = require('../lib/models/models.js');

chai.use(chaiHttp);

var server = require('../lib/server.js'); //run our server

var testRabbit;

describe('Single-Resource REST API', function() {

  before(function(done) {
    server.once('started', function() {
      //sequelize.sync(); //unnecessary
      console.log('');
      console.log('Tests started:');
      console.log('');
      done();
    });
  });
  after(function(done) {
    done();
    //Rabbit.drop(); //clear the database
  });

  it('should be able to add a new rabbit', function(done) {
    chai.request('localhost:3000')
      .post('/rabbits')
      .send({name: 'Shrubs', weight: 10})
      .end(function(err, res) {
        expect(err).to.eql(null);
        expect(res.status).to.eql(200);
        expect(res.body).to.have.property('id');
        expect(res.body.name).to.eql('Shrubs');
        expect(res.body.weight).to.eql(10);
        done();
      });
  });

  it('should be able to get an array of all rabbits', function(done) {
    chai.request('localhost:3000')
      .get('/rabbits')
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
  before(function(done) {
    testRabbit = models.Rabbit.create({name: 'Buckles', weight: '6'})
    .then(function() {
      done();
    });
  });
  /*afterEach(function(done) { //Uncomment to manually check the column
    chai.request('localhost:3000')
      .get('/rabbits')
      .end(function(err, res) {
        expect(err).to.eql(null);
        console.log(res.body);
        done();
      });
  });*/

  it('should be able to update a rabbit', function(done) {
    chai.request('localhost:3000')
      .put('/rabbits')
      .send({name: 'Buckles 2', weight: 11, id: testRabbit._boundTo.id}) //that got dark quickly!
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
      .send({id: testRabbit._boundTo.id}) //(Buckles 2 just wasn't the same as Buckles 1)
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
