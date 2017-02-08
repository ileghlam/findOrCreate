import chai from 'chai';
/* --------------------------------------------Require------------------------------------------ */
import mongoose from 'mongoose';
import assert from 'assert';
import findOrCreate from '../lib/main';

/* --------------------------------------------Init Schema-------------------------------------- */
const { expect } = chai;
const Schema = mongoose.Schema;

mongoose.Promise = Promise;

const testSchema = new Schema({
    name: { type: String },
});

testSchema.plugin(findOrCreate);

const test = mongoose.model('test', testSchema);

/* --------------------------------------Connect to database------------------------------------ */
mongoose.connect('mongodb://82.196.14.126:27017/crypta');
// mongoose.connection.on('connected', function () {  
//     console.log('Mongoose default connection open to ' + 'mongodb://82.196.14.126:27017/crypta');
// }); 

// // If the connection throws an error
// mongoose.connection.on('error',function (err) {  
//     console.log('Mongoose default connection error: ' + err);
// }); 

// // When the connection is disconnected
// mongoose.connection.on('disconnected', function () {  
//     console.log('Mongoose default connection disconnected'); 
// });

/* ------------------------------------------START TEST----------------------------------------- */
describe('#findOrCreate()', () => {

    before((done) => {
        const grapefruit = new test({
            name: 'Grapefruit',
        });
        grapefruit.save(err => done())
    });

    it('the static method findOrCreate is added to models', () => {
        expect(typeof test.findOrCreate).to.equal('function');
    });
});