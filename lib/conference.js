var Person = require('./person');

var Conference = function(data) {};

Conference.prototype.init = function(data, done) {
    this.id = data.id;
    this.people = [];

    // TODO async?
    if (data.people) {
        for (var i = 0; i < data.people.length; ++i) {
            var p = new Person(data.people[i]);
            this.people.push(p);
        }
    }

    return done();
};

module.exports = Conference;
