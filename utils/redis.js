const redis = require('redis');
const { promisify } = require('util');

/**
 * RedisClient class wraps Redis client operations with Promises.
 */
class RedisClient {
  constructor() {
    // Create a Redis client instance
    this.client = redis.createClient();

    // Promisify the get method for async/await usage
    this.getAsync = promisify(this.client.get).bind(this.client);

    // Log an error message if the Redis client encounters an error
    this.client.on('error', (error) => {
      console.log(`Redis client not connected to the server: ${error.message}`);
    });
  }

  /**
   * Checks if the Redis client is connected.
   * @returns {boolean} - True if connected, false otherwise.
   */
  isAlive() {
    return this.client.connected;
  }

  /**
   * Retrieves the value associated with the given key from Redis.
   * @param {string} key - The Redis key.
   * @returns {Promise<string | null>} - Promise resolving to the value or null if not found.
   */
  async get(key) {
    return this.getAsync(key);
  }

  /**
   * Sets a value with an expiration time in Redis.
   * @param {string} key - The Redis key.
   * @param {string} value - The value to set.
   * @param {number} duration - Expiration time in seconds.
   * @returns {Promise<void>}
   */
  async set(key, value, duration) {
    this.client.setex(key, duration, value);
  }

  /**
   * Deletes the key-value pair associated with the given key in Redis.
   * @param {string} key - The Redis key.
   * @returns {Promise<void>}
   */
  async del(key) {
    this.client.del(key);
  }
}

// Create an instance of RedisClient
const redisClient = new RedisClient();

export default redisClient;
