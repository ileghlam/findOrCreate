function moduleFindOrCreate(schema) {
  schema.statics.findOrCreate = function findOrCreate(search, data, options) {
    return new Promise((resolve, reject) => {
      const Collection = this;

      this.findOne(search)
        .then(result => {
          if (result) {
            if (options && options.upsert) {
              return Collection.update(search, data);
            }
            resolve({ result, created: false });
            return null;
          }
          const obj = new Collection(data ? Object.assign({}, search, data) : search);
          resolve(
            obj.save()
              .then(res => ({ result: res, created: true }))
          );
          return null;
        })
        .then(() => Collection.findOne(search))
        .then(result => resolve({ result, created: false }))
        .catch(reject);
    });
  };
}

module.exports = moduleFindOrCreate;