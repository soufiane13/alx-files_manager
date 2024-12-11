import express from 'express';
import AppController from '../controllers/AppController';
import UsersController from '../controllers/UsersController';
import AuthController from '../controllers/AuthController';
import FilesController from '../controllers/FilesController';

const router = express.Router();

/**
 * Sets up the route controller and defines the API endpoints.
 * @param {express.Application} app - The express application instance.
 */
const routeController = (app) => {
  // Use the router for all routes starting with '/'
  app.use('/', router);

  // Endpoint to get the status of the application
  router.get('/status', (req, res) => {
    AppController.getStatus(req, res);
  });

  // Endpoint to get application statistics
  router.get('/stats', (req, res) => {
    AppController.getStats(req, res);
  });

  // Endpoint to create a new user
  router.post('/users', (req, res) => {
    UsersController.postNew(req, res);
  });

  // Endpoint to handle user connection (login)
  router.get('/connect', (req, res) => {
    AuthController.getConnect(req, res);
  });

  // Endpoint to handle user disconnection (logout)
  router.get('/disconnect', (req, res) => {
    AuthController.getDisconnect(req, res);
  });

  // Endpoint to get the current user's information
  router.get('/users/me', (req, res) => {
    UsersController.getMe(req, res);
  });

  // Endpoint to upload a file
  router.post('/files', (req, res) => {
    FilesController.postUpload(req, res);
  });

  // Endpoint to get a file by its ID
  router.get('/files/:id', (req, res) => {
    FilesController.getShow(req, res);
  });

  // Endpoint to get a list of all files
  router.get('/files', (req, res) => {
    FilesController.getIndex(req, res);
  });

  // Endpoint to publish a file by its ID
  router.put('/files/:id/publish', (req, res) => {
    FilesController.putPublish(req, res);
  });

  // Endpoint to unpublish a file by its ID
  router.put('/files/:id/unpublish', (req, res) => {
    FilesController.putUnpublish(req, res);
  });

  // Endpoint to get file data by its ID
  router.post('/files/:id/data', (req, res) => {
    FilesController.getFile(req, res);
  });
};

export default routeController;
