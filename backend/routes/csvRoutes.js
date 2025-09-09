const express = require('express');
const router = express.Router();
const csvController = require('../controllers/csvController');

// Simple CSV upload endpoint
router.post('/upload', csvController.uploadCSV);

// Serve CSV data to frontend
router.get('/data/:fileType', csvController.getCSVData);

module.exports = router;
