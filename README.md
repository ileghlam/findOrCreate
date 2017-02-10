# findOrCreate-Promise

[![Build Status](https://travis-ci.org/travis-ci/travis-web.svg?branch=master)](https://travis-ci.org/travis-ci/travis-web)

Useful mongoose plugin "findOrCreate-Promise", which was made using es6 Promises.

## Installation

Import the plugin "findOrCreate-Promise".

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
});

TestSchema.plugin(findOrCreate);

const Test = mongoose.model('Test', TestSchema);
```

## Usage

### Create a new document

You can create a new document. The return value is a object

```javascript
Test.findOrCreate({ name: 'mongoose' })
    .then((doc) => {
        // doc.result contain the document.
        console.log(doc.result);
        // If the document are created, doc.created has at true.
        console.log(doc.created);
    })
    .catch(done);
```

### Find a document

You can create a new document. The return value is a object

```javascript
Test.findOrCreate({ name: 'mongoose' })
    .then((doc) => {
        // doc.result contain the document.
        console.log(doc.result);
        // If the document are created, doc.created has at true.
        console.log(doc.created);
    })
    .catch(done);
```

### Update a document

You can create a new document. The return value is a object

```javascript
Test.findOrCreate({ name: 'mongoose' })
    .then((doc) => {
        // doc.result contain the document.
        console.log(doc.result);
        // If the document are created, doc.created has at true.
        console.log(doc.created);
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


## BUGS

When you find issues, please report them:

* web: [https://github.com/ileghlam/findOrCreate/issues](https://github.com/ileghlam/findOrCreate/issues)
* web:
  <https://github.com/ileghlam/findOrCreate/issues>
## License

* __MIT__: [http://opensource.org/licenses/MIT](http://opensource.org/licenses/MIT)