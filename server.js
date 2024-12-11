import express from 'express';
import controllerRouting from './routes/index';

/**
 * @constant {express.Application} app - Express application
 */
const app = express();
/**
 * @constant {number} port - Port number for the server
 */
const port = process.env.PORT || 5000;

/**
 * @description Parse application/json
 */
app.use(express.json());
/**
 * @description Route management for the application
 * @param {express.Application} app - Express application
 */
controllerRouting(app);

/**
 * @description Start the server
 */
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

/**
 * @description Export the express application
 * @type {express.Application}
 */
export default app;
