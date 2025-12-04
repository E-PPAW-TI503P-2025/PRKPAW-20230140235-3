const express = require('express');
const router = express.Router();

// Import Controller yang baru saja direvisi
const presensiController = require('../controllers/presensiController');

// Import Middleware Auth
// Pastikan path '../middleware/permissionMiddleware' ini BENAR ada di folder kamu.
// Jika error "Module not found", cek apakah nama filenya benar permissionMiddleware.js atau authJwt.js
const { authenticateToken } = require('../middleware/permissionMiddleware');

// =================================================================
// 1. ROUTE CHECK-IN (POST)
// =================================================================
// Urutan Eksekusi:
// 1. authenticateToken: Memastikan user login & mengambil ID user.
// 2. upload.single('bukti'): Menerima file foto dari Frontend (field 'bukti').
// 3. checkIn: Menyimpan data lokasi & path foto ke database.
router.post(
    '/check-in', 
    authenticateToken, 
    presensiController.upload.single('bukti'), 
    presensiController.checkIn
);

// =================================================================
// 2. ROUTE CHECK-OUT (POST)
// =================================================================
router.post(
    '/check-out', 
    authenticateToken, 
    presensiController.checkOut
);

module.exports = router;