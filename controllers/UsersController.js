import sha1 from 'sha1';
import Queue from 'bull/lib/queue';
import dbClient from '../utils/db';

// Create a queue for email sending tasks
const userQueue = new Queue('email sending');

/**
 * UsersController class handles user-related HTTP requests.
 */
export default class UsersController {
  /**
   * Handles the creation of a new user.
   * @param req - The request object.
   * @param res - The response object.
   */
  static async postNew(req, res) {
    const email = req.body ? req.body.email : null;
    const password = req.body ? req.body.password : null;

    // Check if email is provided
    if (!email) {
      res.status(400).json({ error: 'Missing email' });
      return;
    }

    // Check if password is provided
    if (!password) {
      res.status(400).json({ error: 'Missing password' });
      return;
    }

    // Check if a user with the same email already exists
    const user = await (await dbClient.usersCollection()).findOne({ email });
    if (user) {
      res.status(400).json({ error: 'Already exist' });
      return;
    }

    // Insert the new user into the database
    const insertionInfo = await (await dbClient.usersCollection())
      .insertOne({ email, password: sha1(password) });
    const userId = insertionInfo.insertedId.toString();

    // Add the new user to the email sending queue
    userQueue.add({ userId });
    
    // Respond with the created user's email and ID
    res.status(201).json({ email, id: userId });
  }

  /**
   * Retrieves the currently authenticated user's information.
   * @param req - The request object.
   * @param res - The response object.
   */
  static async getMe(req, res) {
    const { user } = req;

    // Respond with the authenticated user's email and ID
    res.status(200).json({ email: user.email, id: user._id.toString() });
  }
}
