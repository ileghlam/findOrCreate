var should = require('should');
var sleepsort = require('../lib/main');

describe('sleepsort', function() {
    describe('with no arguments', function() {
        it('returns an empty array', function() {
            var result = sleepsort();
            result.should.eql([]);
        });
    });
});