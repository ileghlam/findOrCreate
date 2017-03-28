/**
 * MONGOOSE FIND OR CREATE PROMISE
 * @author: Ishak Leghlam
 * @license: MIT
 **/

/**
 * @param Object query: The mongoose query to execute on the model
 * @param Object data: The document to create or update
 * @param {optional} Object options: Please see README.md for further details
 *
 * @return: Promise
 */

function moduleFindOrCreate(schema) {
  schema.statics.findOrCreate = function findOrCreate(query, data, options) {
    return new Promise((resolve, reject) => {
      const Collection = this;
      let _id = null;

      // If create option is not defined, set default value to true.
      if (options && typeof options.create === 'undefined') options.create = true;

      /**
       * Rather than returning error if only two arguments are passed, we'll check here
       * if the second argument is an 'options' object and not a 'data' object.
       * In this case, options will be initialized to data. And data will be an empty object.
       */
      if (data && (typeof data.upsert !== 'undefined' || typeof data.create !== 'undefined')) {
        options = data;
        data = {};
      }

      // Find document
      this.findOne(query)
        .then(doc => {
          // If document exist
          if (doc) {
            if (options && options.upsert) {
              /**
               * Update document
               * Find the new document
               * Return new document
               */
              _id = doc._id;
              return Collection.update(query, data);
            }
            // Return document
            resolve(([doc, false]);
            return;
          } else if (options && !options.create) {
            // If create is false, return null
            resolve(([null, false]);
          } else {
            // Create document
            resolve(
              Collection.create(data ? Object.assign({}, query, data) : query)
              .then(doc => [doc, true])
              .catch(err => throw err)
            );
          }
          return null;
        })
        .then(() => Collection.findOne({ _id }))
        .then(doc => resolve([doc, false]))
        .catch(reject);
    });
  };
}

module.exports = moduleFindOrCreate;
