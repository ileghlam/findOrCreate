/* --------------------------------------------Require------------------------------------------ */
const chai = require('chai');
const mongoose = require('mongoose');
const findOrCreate = require('../lib/main');
const chaiAsPromised = require('chai-as-promised');

const { it, describe, before, after } = global;

chai.use(chaiAsPromised);
chai.should();

/* --------------------------------------Connect to database------------------------------------ */
before((done) => {
    mongoose.connect('mongodb://82.196.14.126:27017/crypta');
    mongoose.connection.on('connected', () => {
        console.log('Mongoose default connection open to mongodb://82.196.14.126:27017/crypta');
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
    it('should create a new elem in database', (done) => {
        Test.findOrCreate({ name: 'mango' })
            .then((doc) => {
                doc.obj.name.should.equal('mango');
                done(null);
            })
            .catch(err => {
                done(err);
            });
    });

    //Test 3
    it('should find "mango" in database', (done) => {
        Test.findOne({ name: 'mango'}, (err, test) => {
            if (err) done(err);
            Test.findOrCreate({ name: 'mango' })
                .then((doc) => {
                    doc.obj.name.should.equal(test.name);
                    done(null);
                })
                .catch(err => {
                    done(err);
                });
        });
    })

    // Test 4
    it('should pass created as true if the object didn\'t exist', (done) => {
        Test.findOrCreate({ name: 'created' })
            .then((doc) => {
                doc.created.should.equal(true);
                done(null);
            })
            .catch(err => {
                done(err);
            });
    });

    // Test 5
    it('should pass created as false if the object already exists', (done) => {
        Test.findOrCreate({ name: 'created' })
            .then((doc) => {
                doc.created.should.equal(false);
                done(null);
            })
            .catch(err => {
                done(err);
            });
    });
});

/* ----------------------------------------Delete Database-------------------------------------- */
// after(done => {
//   mongoose.connection.db.dropDatabase();
//   done();
// });
