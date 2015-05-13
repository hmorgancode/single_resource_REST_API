'use strict';

//Creates our rabbit schema and exports its constructor.
module.exports = function(mongoose) {
  var rabbitSchema = mongoose.Schema({
    name: String,
    weight: {type: Number, min: 0, max: 20}
  });

  var Rabbit = mongoose.model('Rabbit', rabbitSchema);
  return Rabbit;
};
