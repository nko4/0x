var vector = require('vector2d-lib');

var Influencer = function(id, type, x, y) {
    this.id = id;
    this.type = type;
    this.location = new vector(x, y);
};

module.exports = Influencer;
