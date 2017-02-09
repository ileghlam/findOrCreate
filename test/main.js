/* --------------------------------------------Require------------------------------------------ */
const chai = require('chai');
const mongoose = require('mongoose');
const chaiAsPromised = require('chai-as-promised');
const findOrCreate = require('../lib/main');

const { it, describe, before, after } = global;

chai.use(chaiAsPromised);
chai.should();

/* --------------------------------------Connect to database------------------------------------ */
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

/* --------------------------------------------Init Schema-------------------------------------- */
const { expect } = chai;
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

/* ------------------------------------------START TEST----------------------------------------- */

describe('#findOrCreate()', () => {
    // Test 1
    it('should add method findOrCreate to models', () => {
        expect(typeof Test.findOrCreate).to.equal('function');
    });

    // Test 2
    it('should create a new document in database', (done) => {
        Test.findOrCreate({ name: 'mango' })
            .then((doc) => {
                doc.obj.name.should.equal('mango');
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
                    doc.obj.name.should.equal(test.name);
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
            expect(doc.obj.test).to.equal(undefined);
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
            doc.obj.school.should.equal(24);
            done(null);
        })
        .catch(done);
    });

    // Test 9
    it('should create new document with upsert', (done) => {
        Test.findOrCreate({ name: 'bmw' }, { school: 420 }, { upsert: true })
        .then((doc) => {
            doc.created.should.equal(true);
            doc.obj.school.should.equal(420);
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
});
/* ----------------------------------------Delete Database-------------------------------------- */
after(done => {
  mongoose.connection.db.dropDatabase();
  done();
});
