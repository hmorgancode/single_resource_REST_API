'use strict';

var chai = require('chai');
var chaiHttp = require('chai-http');
var expect = chai.expect;

var mongoose = require('mongoose');

chai.use(chaiHttp);

var server = require('../lib/server.js'); //run our server

describe('Authentication', function() {

  before(function(done) {
    server.once('started', function() {
      done();
    });
  });
  after(function(done) {
    done();
    //We don't drop the database afterwards anymore-
    //instead, we create a user here that we use in rest_api_test.js.
    //(I feel like this is against the idea of unit testing, but I want
    //to try it out here and make sure that it works.)
  });

  it('should be able to create a new user', function(done) {
    chai.request('localhost:3000')
      .post('/create_user')
      .send({username: 'justthisguy',
             email: 'bleh@example.com', password: 'foobar123'})
      .end(function(err, res) {
        expect(err).to.eql(null);
        expect(res.status).to.eql(200);
        expect(res.body).to.have.property('token');
        done();
      });
  });

  it('should reject duplicate emails', function(done) {
    chai.request('localhost:3000')
      .post('/create_user')
      .send({username: 'lil_bobby_tables',
             email: 'bleh@example.com', password: 'foobar123'})
      .end(function(err, res) {
        expect(err).to.eql(null);
        expect(res.status).to.eql(500);
        done();
      });
  });

}); //end describe
