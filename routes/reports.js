// FILE: routes/reports.js
const express = require('express');
const router = express.Router();
// Pastikan path ini benar mengarah ke controller
const reportController = require('../controllers/reportController'); 
const { authenticateToken, isAdmin } = require('../middleware/permissionMiddleware');

// Pastikan fungsi getDailyReport dipanggil dengan benar
router.get('/daily', authenticateToken, isAdmin, reportController.getDailyReport);

module.exports = router;