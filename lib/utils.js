var utils = {};


utils.getRandom = function(min, max) {
    return Math.random() * (max - min) + min;
};

module.exports = utils;
