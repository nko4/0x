var utils = {};


utils.getRandom = function(min, max) {
    return Math.random() * (max - min) + min;
};

utils.getRandomInt = function(min, max) {
    return (Math.random() * (max - min) + min).toFixed(0);
};

module.exports = utils;
