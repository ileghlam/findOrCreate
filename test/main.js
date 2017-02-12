// Require package
const chai = require('chai');
const mongoose = require('mongoose');
const chaiAsPromised = require('chai-as-promised');
const findOrCreate = require('../lib/main');

// Global variables
const { it, describe, before, after } = global;

// Extends Chai with assertions about promises
chai.use(chaiAsPromised);
chai.should();
const { expect } = chai;

// Connect to database
before((done) => {
    mongoose.connect('mongodb://82.196.14.126:27017/Tests');
    mongoose.connection.on('connected', () => {
        console.log('Mongoose default connection open to Tests');
        done();
    });

    // If the connection throws an error
    mongoose.connection.on('error', (err) => {
        console.log(`Mongoose default connection error: ${err}`);
        done();
    });

    // When the connection is disconnected
    mongoose.connection.on('disconnected', () => {
        console.log('Mongoose default connection disconnected');
        done();
    });
});

// Init Schema
const Schema = mongoose.Schema;

mongoose.Promise = Promise;

const testSchema = new Schema({
    name: { type: String },
    number: { type: Number },
    parent: { type: String },
    school: { type: Number },
});

testSchema.plugin(findOrCreate);
const Test = mongoose.model('test', testSchema);

/**
 * Start Test
 * 27 tests
 */

describe('#findOrCreate()', () => {
    // Test 1
    it('should add method findOrCreate to models', () => {
        expect(typeof Test.findOrCreate).to.equal('function');
    });

    // Test 2
    it('should create a new document in database', (done) => {
        Test.findOrCreate({ name: 'mango' })
            .then((doc) => {
                doc.result.name.should.equal('mango');
                done(null);
            })
            .catch(done);
    });

    // Test 3
    it('should find "mango" in database', (done) => {
        Test.findOne({ name: 'mango' }, (err, test) => {
            if (err) done(err);
            Test.findOrCreate({ name: 'mango' })
                .then((doc) => {
                    doc.result.name.should.equal(test.name);
                    done(null);
                })
                .catch(error => done(error));
        });
    });

    // Test 4
    it('should pass created as true if the object didn\'t exist', (done) => {
        Test.findOrCreate({ name: 'created' })
            .then((doc) => {
                doc.created.should.equal(true);
                done(null);
            })
            .catch(done);
    });

    // Test 5
    it('should pass created as false if the object already exists', (done) => {
        Test.findOrCreate({ name: 'created' })
            .then((doc) => {
                doc.created.should.equal(false);
                done(null);
            })
            .catch(done);
    });

    // // Test 6
    it('should not add properties with a $ when creating the object', (done) => {
        Test.findOrCreate({
            name: 'exists',
            test: { $exists: true },
        }).then((doc) => {
            expect(doc.result.test).to.equal(undefined);
            doc.created.should.equal(true);
            done(null);
        })
        .catch(done);
    });

    // Test 7
    it('should create a new document in database with data', (done) => {
        Test.findOrCreate({ name: 'merco' }, {
            number: 12,
            parent: 'valide',
            school: '42',
        })
        .then((doc) => {
            doc.created.should.equal(true);
            done(null);
        })
        .catch(done);
    });

    // Test 8
    it('should update merco with upsert', (done) => {
        Test.findOrCreate({ name: 'merco' }, { school: 24 }, { upsert: true })
        .then((doc) => {
            doc.created.should.equal(false);
            doc.result.school.should.equal(24);
            done(null);
        })
        .catch(done);
    });

    // Test 9
    it('should create new document with upsert', (done) => {
        Test.findOrCreate({ name: 'bmw' }, { school: 420 }, { upsert: true })
        .then((doc) => {
            doc.created.should.equal(true);
            doc.result.school.should.equal(420);
            done(null);
        })
        .catch(done);
    });

    // Test 10
    it('should delete all documents and create new document', (done) => {
        Promise.all([
            Test.remove({ name: 'bmw' }),
            Test.remove({ name: 'merco' }),
            Test.remove({ name: 'exists' }),
            Test.remove({ name: 'mango' }),
            Test.remove({ name: 'created' }),
            Test.findOrCreate({ name: 'mangoose' }),
        ])
        .then((tab) => {
            const doc = tab.pop();
            doc.created.should.equal(true);
            done(null);
        })
        .catch(done);
    });

    // Test 11
    it('should create document with create option has true and data', (done) => {
        Test.findOrCreate({ name: 'bb8' }, { school: 420 }, { create: true })
        .then((doc) => {
            doc.created.should.equal(true);
            doc.result.school.should.equal(420);
            done(null);
        })
        .catch(done);
    });

    // Test 12
    it('should create document with create option has false and data', (done) => {
        Test.findOrCreate({ name: 'bb9' }, { parent: 'jupiter' }, { create: false })
        .then((doc) => {
            doc.created.should.equal(false);
            done(null);
        })
        .catch(done);
    });

    // Test 13
    it('should create document with create option has true and data', (done) => {
        Test.findOrCreate({ name: 'bb9' }, { parent: 'jupiter' }, { create: true })
        .then((doc) => {
            doc.created.should.equal(true);
            doc.result.parent.should.equal('jupiter');
            done(null);
        })
        .catch(done);
    });

    // Test 14
    it('should find the document with everything the document contains', (done) => {
        Test.findOrCreate({ name: 'bb9', parent: 'jupiter' })
        .then((doc) => {
            doc.created.should.equal(false);
            doc.result.parent.should.equal('jupiter');
            doc.result.name.should.equal('bb9');
            done(null);
        })
        .catch(done);
    });

    // Test 15
    it('should find the document with more than the document contains', (done) => {
        Test.findOrCreate({ name: 'bb9', parent: 'jupiter', school: 42 }, { create: false })
        .then((doc) => {
            doc.created.should.equal(false);
            done(null);
        })
        .catch(done);
    });

    // Test 16
    it('should create document only with search and options', (done) => {
        Test.findOrCreate({ name: 'bb10', parent: 'valide', school: 77 })
        .then((doc) => {
            doc.created.should.equal(true);
            doc.result.name.should.equal('bb10');
            done(null);
        })
        .catch(done);
    });

    // Test 17
    it('should update multiple arguments', (done) => {
        Test.findOrCreate({ name: 'bb10' }, { parent: 'eiffel tower', school: 42 }, { upsert: true })
        .then((doc) => {
            doc.created.should.equal(false);
            doc.result.name.should.equal('bb10');
            doc.result.parent.should.equal('eiffel tower');
            done(null);
        })
        .catch(done);
    });

    // Test 18
    it('should update nothing', (done) => {
        Test.findOrCreate({ name: 'bb10' }, {}, { upsert: true })
        .then((doc) => {
            doc.created.should.equal(false);
            doc.result.name.should.equal('bb10');
            doc.result.parent.should.equal('eiffel tower');
            done(null);
        })
        .catch(done);
    });

    // Test 19
    it('should update document with upsert has false', (done) => {
        Test.findOrCreate({ name: 'bb10' }, { parent: 'ahah', school: 99 }, { upsert: false })
        .then((doc) => {
            doc.created.should.equal(false);
            doc.result.name.should.equal('bb10');
            doc.result.parent.should.equal('eiffel tower');
            doc.result.school.should.equal(42);
            done(null);
        })
        .catch(done);
    });

    // Test 20
    it('should create document with upsert has true and create has true', (done) => {
        Test.findOrCreate(
            { name: 'one' },
            {
                school: 420,
                number: 321,
                parent: 'old',
            },
            {
                upsert: true,
                create: true,
            })
        .then((doc) => {
            doc.created.should.equal(true);
            doc.result.name.should.equal('one');
            doc.result.school.should.equal(420);
            doc.result.number.should.equal(321);
            doc.result.parent.should.equal('old');
            done(null);
        })
        .catch(done);
    });

    // Test 21
    it('should create document with upsert has false and create has false', (done) => {
        Test.findOrCreate(
            { name: 'two' },
            {
                school: 420,
                number: 321,
                parent: 'old',
            },
            {
                upsert: false,
                create: false,
            })
        .then((doc) => {
            doc.created.should.equal(false);
            done(null);
        })
        .catch(done);
    });

    // Test 22
    it('should create document with upsert has true and create has false', (done) => {
        Test.findOrCreate(
            { name: 'three' },
            {
                school: 420,
                number: 321,
                parent: 'old',
            },
            {
                upsert: true,
                create: false,
            })
        .then((doc) => {
            doc.created.should.equal(false);
            done(null);
        })
        .catch(done);
    });

    // Test 23
    it('should create document with upsert has false and create has true', (done) => {
        Test.findOrCreate(
            { name: 'four' },
            {
                school: 420,
                number: 321,
                parent: 'old',
            },
            {
                upsert: true,
                create: true,
            })
        .then((doc) => {
            doc.created.should.equal(true);
            doc.result.name.should.equal('four');
            doc.result.school.should.equal(420);
            doc.result.number.should.equal(321);
            doc.result.parent.should.equal('old');
            done(null);
        })
        .catch(done);
    });

    // Test 24
    it('should update document with upsert has true and create has true', (done) => {
        Test.findOrCreate(
            { name: 'one' },
            {
                name: 'two',
                school: 46,
                number: 42,
                parent: 'paste',
            },
            {
                upsert: true,
                create: true,
            })
        .then((doc) => {
            doc.created.should.equal(false);
            doc.result.name.should.equal('two');
            doc.result.school.should.equal(46);
            doc.result.number.should.equal(42);
            doc.result.parent.should.equal('paste');
            done(null);
        })
        .catch(done);
    });

    // Test 25
    it('should update document with upsert has false and create has false', (done) => {
        Test.findOrCreate(
            { name: 'two' },
            {
                school: 420,
                number: 99,
                parent: 'paste',
            },
            {
                upsert: false,
                create: false,
            })
        .then((doc) => {
            doc.created.should.equal(false);
            doc.result.name.should.equal('two');
            doc.result.school.should.equal(46);
            doc.result.number.should.equal(42);
            doc.result.parent.should.equal('paste');
            done(null);
        })
        .catch(done);
    });

    // Test 26
    it('should update document with upsert has true and create has false', (done) => {
        Test.findOrCreate(
            { name: 'two' },
            {
                name: 'one',
                school: 420,
                number: 99,
                parent: 'paste',
            },
            {
                upsert: true,
                create: false,
            })
        .then((doc) => {
            doc.created.should.equal(false);
            doc.result.name.should.equal('one');
            doc.result.school.should.equal(420);
            doc.result.number.should.equal(99);
            doc.result.parent.should.equal('paste');
            done(null);
        })
        .catch(done);
    });

    // Test 27
    it('should update document with upsert has false and create has true', (done) => {
        Test.findOrCreate(
            { name: 'one' },
            {
                school: 88,
                number: 0,
                parent: 'bye',
            },
            {
                upsert: false,
                create: true,
            })
        .then((doc) => {
            doc.created.should.equal(false);
            doc.result.name.should.equal('one');
            doc.result.school.should.equal(420);
            doc.result.number.should.equal(99);
            doc.result.parent.should.equal('paste');
            done(null);
        })
        .catch(done);
    });
});

// Delete Database
after(done => {
  mongoose.connection.db.dropDatabase();
  done();
});
