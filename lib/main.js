/**
 * MONGOOSE FIND OR CREATE PROMISE
 * @author: Ishak Leghlam
 * @license: MIT
 **/

/**
 * @param Object query: The mongoose query to execute on the model
 * @param Object data: The document to create/update
 * @param {optional} Object options: Please see README.md for further details
 *
 * @return: Promise
 */

function moduleFindOrCreate(schema) {
  schema.statics.findOrCreate = function findOrCreate(query, data, options) {
    return new Promise((resolve, reject) => {
      const Collection = this;
      let _id = null;

      // Define default value for create if is undefined
      if (options && typeof options.create === 'undefined') options.create = true;

      // Create object data if is not defined
      if (data && (typeof data.upsert !== 'undefined' || typeof data.create !== 'undefined')) {
        options = data;
        data = {};
      }

      // Find document
      this.findOne(query)
        .then(result => {
          // If document exist
          if (result) {
            if (options && options.upsert) {
              /**
               * Update document
               * Find the new document
               * Return this
               */
              _id = result._id;
              return Collection.update(query, data);
            }
            // Return document
            resolve({ result, created: false });
            return null;
          } else if (options && !options.create) {
            // If create has false return null
            resolve({ result: null, created: false });
          } else {
            // Create document
            resolve(
              Collection.create(data ? Object.assign({}, query, data) : query)
              .then(doc => ({ result: doc, created: true }))
              .catch(err => (err))
            );
          }
          return null;
        })
        .then(() => Collection.findOne({ _id }))
        .then(result => resolve({ result, created: false }))
        .catch(reject);
    });
  };
}

module.exports = moduleFindOrCreate;