const chai = require('chai');
const mongoose = require('mongoose');
const findOrCreate = require('../lib/main');
const chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);

chai.should();

/* --------------------------------------------Require------------------------------------------ */
const { it, describe, before, after } = global;

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
    // test 1 -> Test if findOrCreate is function
    it('should add method findOrCreate to models', () => {
        expect(typeof Test.findOrCreate).to.equal('function');
    });

    // test 2 -> Create new elem
    it('should create a new elem in database', (done) => {
        Test.findOrCreate({ name: 'mango' })
            .then((doc) => {
                doc.name.should.equal('mango');
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
