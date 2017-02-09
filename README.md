# findOrCreate-Promise [![Build Status](https://travis-ci.org/travis-ci/travis-web.svg?branch=master)](https://travis-ci.org/travis-ci/travis-web)

Useful mongoose plugin "findOrCreate", which was made using es6 Promises.

## Usage

Import 

```javascript
const import findOrCreate from 'findorcreate-promise';
```


```javascript
const import mongoose from 'mongoose';
const Schema = mongoose.Schema;

mongoose.Promise = Promise;

const TestSchema = new Schema({
    name: { type: String },
});

TestSchema.plugin(findOrCreate);

const Test = mongoose.model('Test', TestSchema);
```