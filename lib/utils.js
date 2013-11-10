var perlin = require('perlin-noise');

var utils = {};

var noise = perlin.generatePerlinNoise(200, 200);
var noiseIndex = 0;

utils.getRandom = function(min, max) {
    return Math.random() * (max - min) + min;
};

utils.getRandomInt = function(min, max) {
    return (Math.random() * (max - min) + min).toFixed(0);
};

utils.getRandomFromNoise = function(min, max) {
    if(noiseIndex++ >= noise.length) {
        noiseIndex = 0;
    }

    var n = noise[noiseIndex];
    return n * (max - min) + min;
};

module.exports = utils;
