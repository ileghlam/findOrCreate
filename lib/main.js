function moduleFindOrCreate(schema) {
  schema.statics.findOrCreate = function findOrCreate(search, data, options) {
    return new Promise((resolve, reject) => {
      const Collection = this;
      let _id = null;

      if (options && typeof options.create === 'undefined') options.create = true;

      if (data && (typeof data.upsert !== 'undefined' || typeof data.create !== 'undefined')) {
        options = data;
        data = {};
      }

      this.findOne(search)
        .then(result => {
          if (result) {
            if (options && options.upsert) {
              _id = result._id;
              return Collection.update(search, data);
            }
            resolve({ result, created: false });
            return null;
          } else if (options && !options.create) {
            resolve({ result: null, created: false });
          } else {
            resolve(
              Collection.create(data ? Object.assign({}, search, data) : search)
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