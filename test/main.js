import chai from 'chai';
/* --------------------------------------------Require------------------------------------------ */
import mongoose from 'mongoose';
import findOrCreate from '../lib/main';

const { it, describe } = global;



/* --------------------------------------Connect to database------------------------------------ */
mongoose.connect('mongodb://82.196.14.126:27017/crypta');
mongoose.connection.on('connected', () => {
    console.log('Mongoose default connection open to mongodb://82.196.14.126:27017/crypta');
});

// If the connection throws an error
mongoose.connection.on('error', (err) => {
    console.log(`Mongoose default connection error: ${err}`);
});

// When the connection is disconnected
mongoose.connection.on('disconnected', () => {
    console.log('Mongoose default connection disconnected');
});

/* --------------------------------------------Init Schema-------------------------------------- */
const { expect } = chai;
const Schema = mongoose.Schema;

mongoose.Promise = Promise;

const testSchema = new Schema({
    name: { type: String },
});

testSchema.plugin(findOrCreate);

const Test = mongoose.model('test', testSchema);

/* ------------------------------------------START TEST----------------------------------------- */
describe('#findOrCreate()', () => {
    // before((done) => {
        // mongoose.connection.db.dropDatabase();
    //     const test = new Test({
    //         name: 'test',
    //     });
    //     test.save(err => done());
    // });

    it('should add method findOrCreate to models', () => {
        expect(typeof Test.findOrCreate).to.equal('function');
    });

    it('should create a new elem in database', () => {
        Test.findOrCreate({ name: 'mango' })
            .then((mec) => {
                console.log('4');
                expect(mec.name).to.equal('mango');
            }).catch(console.error);
    });
    //   it("should create the object if it doesn't exist", function(done) {
    //     Test.findOrCreate({name: 'test'}, function(err, click) {
    //     click.name.should.eql('test');

    //     });
    // });

});

/* ----------------------------------------Delete Database-------------------------------------- */
// after(done => {
//   mongoose.connection.db.dropDatabase();
//   done();
// });
