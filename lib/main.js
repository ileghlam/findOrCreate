function findOrCreates(schema) {
  schema.statics.findOrCreate = function findOrCreate(searchObj, newObj) {
    return new Promise((resolve, reject) => {
      const Collection = this;
      this.findOne(searchObj, (err, doc) => {
        if (err) return reject(err);
        if (doc) return resolve(doc);
        const obj = new Collection(searchObj);
        return obj.save()
          .then(resolve)
          .catch(reject);
      });
    });
  };
}


module.exports = findOrCreates;