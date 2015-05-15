'use strict';

var Sequelize = require('sequelize');
var EventEmitter = require('events').EventEmitter;

//Creates our rabbit schema and exports its constructor.
module.exports = function(sequelize) {
  var Rabbit = sequelize.define('Rabbits', {
    name: {
      type: Sequelize.STRING,
      field: 'name' // Will result in an attribute that is firstName when user facing but first_name in the database
    },
    weight: {
      type: Sequelize.FLOAT
    }
  }, {
    freezeTableName: true // Model tableName will be the same as the model name
  });

  Rabbit.ee = new EventEmitter();

  Rabbit.sync({force: true}).then(function() {
    console.log('rabbit model synced');
    Rabbit.ee.emit('synced');
  });

  return Rabbit;
};
