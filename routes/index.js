// routes/index.js
const AppController = require('../controllers/AppController');
const UsersController = require('../controllers/UsersController');
const AuthController = require('../controllers/AuthController');
const FilesController = require('../controllers/FilesController');
const path = require('path');
const express = require('express');

module.exports = () => {
    const router = express.Router();

    // GET routes
    router.get('/status', (req, res) => {
        AppController.getStatus(req, res);
    });
    router.get('/stats', (req, res) => {
        AppController.getStats(req, res);
    });
    router.get('/files', (req, res) => {
        FilesController.getIndex(req, res);
    });
    router.get('/files/:id', (req, res) => {
        FilesController.getShow(req, res);
    });
    router.get('/files/:id/data', (req, res) => {
        FilesController.getFile(req, res);
    });
    router.get('/static', (req, res) => {
        res.sendFile(path.resolve('public/image.jpeg'));
    });

    // User auth routes GET
    router.get('/connect', (req, res) => {
        AuthController.getConnect(req, res);
    });
    router.get('/disconnect', (req, res) => {
        AuthController.getDisconnect(req, res);
    });
    router.get('/users/me', (req, res) => {
        UsersController.getMe(req, res);
    });

    // POST routes
    router.post('/users', (req, res) => {
        UsersController.postNew(req, res);
    });
    router.post('/files', (req, res) => {
        FilesController.postUpload(req, res);
    });

    // PUT routes
    router.put('/files/:id/publish', (req, res) => {
        FilesController.putPublish(req, res);
    });
    router.put('/files/:id/unpublish', (req, res) => {
        FilesController.putUnpublish(req, res);
    });

    return router;
};