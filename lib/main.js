function moduleFindOrCreate(schema) {
  schema.statics.findOrCreate = function findOrCreate(search, data, options) {
    return new Promise((resolve, reject) => {
      const Collection = this;

      this.findOne(search)
        .then(doc => {
          if (doc) {
            if (options && options.upsert) {
              return Collection.update(search, data)
            }
            resolve({ obj: doc, created: false })
            return null;
          }
          const obj = new Collection(data ? Object.assign({}, search, data) : search);
          resolve(
            obj.save()
              .then(result => ({obj: result, created: true })),
          );
        })
        .then(() => Collection.findOne(search))
        .then(result => resolve({ obj: result, created: false }))
        .catch(reject);
    });
  }
}

module.exports = moduleFindOrCreate;