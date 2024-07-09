#!/usr/bin/node
import { promisify } from 'node:util';

const redis = require('redis');

class RedisClient {
  constructor() {
    try {
      this.client = redis.createClient();
      this.connected = true;
    } catch (error) {
      console.error(error);
      this.connected = false;
    }
  }

  isAlive() {
    return this.connected;
  }

  async get(key) {
    const value = await promisify(this.client.get).bind(this.client)(key);
    return value;
  }

  async set(key, value, duration) {
    await promisify(this.client.set).bind(this.client)(key, value, 'EX', duration);
  }

  async del(key) {
    await promisify(this.client.del).bind(this.client)(key);
  }
}

const redisClient = new RedisClient();
export default redisClient;
