import redisClient from '../utils/redis';
import dbClient from '../utils/db';

/**
 * @class AppController
 * @description Handles the main routes of the service
 */
class AppController {
  /**
   * @description Returns the status of the service
   * @param {Request} request - Express request object
   * @param {Response} response - Express response object
   * @returns {void} - Returns nothing
   */
  static getStatus(request, response) {
    try {
      const redis = redisClient.isAlive();
      const db = dbClient.isAlive();
      response.status(200).send({ redis, db });
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * @description Returns some statistics of the service
   * @param {Request} request - Express request object
   * @param {Response} response - Express response object
   * @returns {void} - Returns nothing
   */
  static async getStats(request, response) {
    try {
      const users = await dbClient.nbUsers();
      const files = await dbClient.nbFiles();
      response.status(200).send({ users, files });
    } catch (error) {
      console.log(error);
    }
  }
}

export default AppController;
