const mongoose = require('mongoose');
const keys = require('../config/keys');
const redis = require('redis');
const client = redis.createClient(keys.redisURL);

const util = require('util');
client.hget = util.promisify(client.hget);

const exec = mongoose.Query.prototype.exec;

mongoose.Query.prototype.cache = function (options = {}) {
  this.useCache = true;
  this.hashKey = JSON.stringify(options.key);

  return this;
}

mongoose.Query.prototype.exec = async function () {
  console.log('--- Running Query ---');

  // console.log(this.getQuery());
  // console.log(this.mongooseCollection.name);

  if (!this.useCache) {
    return exec.apply(this, arguments);
  }

  const key = JSON.stringify(Object.assign({}, this.getQuery(), { collection: this.mongooseCollection.name }));
  // console.log(key);

  const cachedBlogs = await client.hget(this.hashKey, key);
  if (cachedBlogs) {
    //console.log(cachedBlogs);

    const doc = JSON.parse(cachedBlogs);

    return Array.isArray(doc) ? doc.map(d => new this.model(d)) : new this.model(doc);
    // return JSON.parse(cachedBlogs);
  }

  const result = await exec.apply(this, arguments);

  client.hset(this.hashKey, key, JSON.stringify(result), 'EX', 10);

  // console.log(result);
  return result;
}

module.exports = {
  clearHash(hashKey) {
    client.del(JSON.stringify(hashKey));
  }
}