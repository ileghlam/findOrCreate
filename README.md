# findOrCreate-Promise

[![Build Status](https://travis-ci.org/travis-ci/travis-web.svg?branch=master)](https://travis-ci.org/travis-ci/travis-web)
![npm](https://img.shields.io/npm/v/findorcreate-promise.svg)
![license](https://img.shields.io/npm/l/findorcreate-promise.svg)

Useful mongoose plugin "findOrCreate-Promise", which was made using es6 Promises.

## Installation

```
npm i findorcreate-promise
```

## Import plugin


```javascript
const import findOrCreate from 'findorcreate-promise';
```

## Connecting to MongoDB

First, we need to define a connection and add static method on the schema.

```javascript
const import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const TestSchema = new Schema({
    name: { type: String },
    password: { type: String },
});

TestSchema.plugin(findOrCreate);

const Test = mongoose.model('Test', TestSchema);
```

## Usage

### Basic Usage

findOrCreate takes at most three arguments.

* `query` : The values to be searched
* `data` : If a document is created, these values will be defined.
* `options`: Decides different behavior in the vent an object is found or created.

The function returns in all cases the object in question, whether it was found or created, and a boolean.
The boolean is true if it created a new document and false if it found and or updated one.

```javascript
Schema.findOrCreate({ query }, { data }, { options })
    .then((doc) => {
       /**
        * doc.created is a boolean
        * doc.result is an object
        **/
    })
    .catch(done);
```

### Create or Find a new document

You can create a new document by searching for values. If a matching document is found, it is returned.
Otherwise a new document with the searched values is created and returned.

```javascript
Test.findOrCreate({ name: 'mongoose' })
    .then((doc) => {
       /**
        * doc.created = true
        * doc.result = new document
        **/
    })
    .catch(done);
```

You can create a new document by searching values and in the second parameter, define values in the
new document.


```javascript
Test.findOrCreate({ name: 'mongoose' }, { password: 'nosql' })
    .then((doc) => {
       /**
        * doc.created = true
        * doc.result = new document
        **/
    })
    .catch(done);
```

### Update a document


The option `upsert` dictates how to handle found objects. If it is true, the values passed in `data`
are updated in the object. By default it's false.

```javascript
Test.findOrCreate({ name: 'mongoose' }, { name: 'mongoDB' }, { upsert: true })
    .then((doc) => {
       /**
        * doc.created = false
        * doc.result = document update
        **/
    })
    .catch(done);
```

### Create option

An object is created by default if it is not found. However, if `create` is set to false, the function performs only
a find and no new object will be created.

```javascript
Test.findOrCreate({ name: 'mongoose' }, {}, { create: false })
    .then((doc) => {
       /**
        * doc.created = false
        * doc.result = null
        **/
    })
    .catch(done);
```

## Dev Dependencies

* [babel-core](https://github.com/babel/babel/tree/master/packages/babel-core)
* [babel-eslint](https://github.com/babel/babel-eslint)
* [babel-preset-latest](https://github.com/babel/babel/tree/master/packages/babel-preset-latest)
* [babel-preset-stage-2](https://github.com/babel/babel/tree/master/packages/babel-preset-stage-2)
* [chai](https://github.com/chaijs/chai)
* [chai-as-promised](https://github.com/domenic/chai-as-promised)
* [eslint](https://github.com/eslint/eslint)
* [eslint-config-airbnb-base](https://github.com/airbnb/javascript)
* [eslint-plugin-import](https://github.com/benmosher/eslint-plugin-import)
* [mocha](https://github.com/mochajs/mocha)
* [mongoose](https://github.com/Automattic/mongoose)

## Test

```
npm test
```

## Bugs

When you find issues, please report them:

* web: [https://github.com/ileghlam/findOrCreate/issues](https://github.com/ileghlam/findOrCreate/issues)

## License

* __MIT__: [http://opensource.org/licenses/MIT](http://opensource.org/licenses/MIT)