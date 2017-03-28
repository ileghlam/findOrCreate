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

      const orCreate = (result) => {

          if (result) {
            
            if (options && options.upsert) {
              /**
               * Update document
               * Find the new document
               * Return new document
               */
              _id = result._id;
              return Collection.update(query, data);
            }
            
            resolve({ result, isCreated: false });
          } else if (options && !options.create) {
            // If create is false, return null
            resolve({ result: null, isCreated: false });
          } else {
            // Create document
            resolve(
              Collection.create(data ? Object.assign({}, query, data) : query)
                .then(doc => ({ result: doc, isCreated: true }))
                .catch(err => (err))
            );
          }
          return null;
        }

      // Find document
      this.findOne(query)
        .then(orCreate)
        .then(() => Collection.findOne({ _id }))
        .then(result => resolve({ result, isCreated: false }))
        .catch(reject);
    });
  };
}

module.exports = moduleFindOrCreate;