const express = require('express');
const router = express.Router();

// 1. Impor fungsi yang diperlukan dari express-validator
const { body, validationResult } = require('express-validator');

// Impor Controller & Middleware
const presensiController = require('../controllers/presensiController');
const { addUserData } = require('../middleware/permissionMiddleware');
const { deletePresensi } = require('../controllers/presensiController');
const presensiRecords = require('../data/presensiData');

// Middleware untuk semua rute di file ini
router.use(addUserData);

// === RUTE YANG SUDAH ADA ===

router.get('/', (req, res) => {
    res.json({
        data: presensiRecords,
        timestamp: new Date().toISOString()
    });
});

router.post('/check-in', presensiController.CheckIn);
router.post('/check-out', presensiController.CheckOut);

// === MODIFIKASI UNTUK TUGAS 2 ===

// 2. Definisikan aturan validasi
// Sesuai instruksi: validasi 'waktuCheckIn' dan 'waktuCheckOut'
const updatePresensiValidator = [
  body('waktuCheckIn')
    .optional() // 'optional' berarti field ini tidak wajib ada, tapi jika ada, akan divalidasi
    .isISO8601() // Memastikan format tanggal valid (misal: "2025-11-02T14:30:00.000Z")
    .withMessage('Format waktuCheckIn harus tanggal yang valid (ISO8601).'),
  
  body('waktuCheckOut')
    .optional()
    .isISO8601()
    .withMessage('Format waktuCheckOut harus tanggal yang valid (ISO8601).')
];

// 3. Middleware untuk menangani hasil validasi
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // Jika ada error, kirim respons 400 (Bad Request)
    return res.status(400).json({ errors: errors.array() });
  }
  // Jika tidak ada error, lanjut ke controller
  next();
};

// 4. Terapkan validator dan error handler ke rute PUT
router.put(
  "/:id", 
  updatePresensiValidator,  // Jalankan validasi terlebih dahulu
  handleValidationErrors,   // Periksa hasil validasi
  presensiController.updatePresensi // Jika lolos, jalankan controller
);

// Rute DELETE (tidak berubah)
router.delete('/:id', deletePresensi);


module.exports = router;