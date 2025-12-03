// FILE: routes/presensi.js
const express = require('express');
const router = express.Router();
const presensiController = require('../controllers/presensiController');
const { authenticateToken } = require('../middleware/permissionMiddleware');

// HANYA DUA INI SAJA (Sesuai Controller yang kita buat)
// Jangan ada router.put atau router.delete lain
router.post('/check-in', authenticateToken, presensiController.checkIn);
router.post('/check-out', authenticateToken, presensiController.checkOut);

module.exports = router;