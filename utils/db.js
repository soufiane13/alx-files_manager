/**
 * This module provides a client class for interacting with a MongoDB database
 * containing files_manager data.
 * @module DBClient
 * @example
 * const dbClient = new DBClient();
 * const nbUsers = await dbClient.nbUsers();
 */
import { MongoClient } from 'mongodb';

/**
 * The MongoDB host.
 * @type {String}
 */
const host = process.env.DB_HOST || 'localhost';

/**
 * The MongoDB port.
 * @type {Number}
 */
const port = process.env.DB_PORT || 27017;

/**
 * The MongoDB database name.
 * @type {String}
 */
const database = process.env.DB_DATABASE || 'files_manager';

/**
 * The MongoDB connection URL.
 * @type {String}
 */
const url = `mongodb://${host}:${port}/`;

/**
 * Class representing a MongoDB client.
 * @class
 */
class DBClient {
  /**
   * Creates a new DBClient.
   * @constructor
   * @param {Object} [options] - The options for the client.
   * @param {String} [options.host] - The MongoDB host.
   * @param {Number} [options.port] - The MongoDB port.
   * @param {String} [options.database] - The MongoDB database name.
   */
  constructor() {
    /**
     * The MongoDB database object.
     * @type {Object}
     */
    this.db = null;
    /**
     * Connect to the MongoDB database.
     * @param {String} url - The MongoDB connection URL.
     * @param {Object} [options] - The options for the client.
     * @param {Function} [callback] - The callback function to be called when the connection is established.
     */
    MongoClient.connect(url, { useUnifiedTopology: true }, (error, client) => {
      if (error) console.log(error);
      this.db = client.db(database);
      this.db.createCollection('users');
      this.db.createCollection('files');
    });
  }

  /**
   * Checks if the client is alive.
   * @returns {Boolean} - True if the client is alive, false if not.
   */
  isAlive() {
    return !!this.db;
  }

  /**
   * Gets the number of users in the database.
   * @returns {Number} - The number of users in the database.
   */
  async nbUsers() {
    return this.db.collection('users').countDocuments();
  }

  /**
   * Gets a user from the database.
   * @param {Object} query - The query to find the user.
   * @returns {Object} - The user found, or null if not found.
   */
  async getUser(query) {
    console.log('QUERY IN DB.JS', query);
    const user = await this.db.collection('users').findOne(query);
    console.log('GET USER IN DB.JS', user);
    return user;
  }

  /**
   * Gets the number of files in the database.
   * @returns {Number} - The number of files in the database.
   */
  async nbFiles() {
    return this.db.collection('files').countDocuments();
  }
}

/**
 * The singleton instance of the DBClient.
 * @type {DBClient}
 */
const dbClient = new DBClient();
export default dbClient;
