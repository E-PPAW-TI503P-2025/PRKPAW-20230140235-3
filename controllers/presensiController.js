const db = require("../models");
const multer = require('multer'); 
const path = require('path'); 
const fs = require('fs'); // WAJIB ADA: Untuk menghapus file jika error

const Presensi = db.Presensi || db.presensi;

// =================================================================
// 1. KONFIGURASI MULTER (UPLOAD FOTO)
// =================================================================

// Pastikan folder 'uploads' ada, jika tidak, buat dulu
const uploadDir = 'uploads/';
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        // Format: USERID-TIMESTAMP.jpg
        const userId = req.userId || (req.user && req.user.id) || 'unknown';
        cb(null, `${userId}-${Date.now()}${path.extname(file.originalname)}`);
    }
});

const fileFilter = (req, file, cb) => {
    // Hanya terima file gambar (jpg, jpeg, png)
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Hanya file gambar yang diperbolehkan!'), false);
    }
};

// Export middleware upload ini untuk dipakai di ROUTES
exports.upload = multer({ 
    storage: storage, 
    fileFilter: fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // Limit 5MB
});

// =================================================================
// 2. FUNGSI CHECK-IN (FIXED)
// =================================================================

exports.checkIn = async (req, res) => {
    try {
        // A. Validasi User (Dari Middleware Auth)
        // Cek req.userId (biasa dari verifyToken) atau req.user.id
        const userId = req.userId || (req.user && req.user.id);

        if (!userId) {
            // Hapus foto jika terlanjur ke-upload tapi user tidak valid
            if (req.file && req.file.path) fs.unlinkSync(req.file.path);
            return res.status(401).json({ message: "Unauthorized: User tidak dikenali." });
        }

        // B. Validasi Input Foto
        // req.file dibuat oleh Multer di Route
        if (!req.file) {
            return res.status(400).json({ message: "Gagal: Foto bukti wajib diupload!" });
        }

        const buktiPath = req.file.path; // Path file, misal: "uploads/1-123456.jpg"
        const { latitude, longitude } = req.body;
        
        // Gunakan format tanggal YYYY-MM-DD
        const today = new Date().toISOString().split('T')[0];

        // C. Cek apakah sudah absen hari ini?
        const existing = await Presensi.findOne({
            where: { userId: userId, tanggal: today }
        });

        if (existing) {
            // PENTING: Hapus foto baru yang terupload karena batal disimpan
            fs.unlinkSync(buktiPath);
            return res.status(400).json({ message: "Anda sudah Check-in hari ini!" });
        }

        // D. Simpan ke Database
        const presensiBaru = await Presensi.create({
            userId: userId,
            tanggal: today,
            jamMasuk: new Date().toLocaleTimeString('en-GB', { hour12: false }), // Format HH:mm:ss
            latitude: latitude || null,
            longitude: longitude || null,
            
            // --- BAGIAN KRUSIAL ---
            // Nama properti kiri ('bukti') HARUS sama dengan nama kolom di Database & Model
            bukti: buktiPath, 
            status: 'Masuk' // Opsional jika ada kolom status
        });

        res.status(200).json({ 
            message: "Check-in Berhasil!", 
            data: presensiBaru 
        });

    } catch (error) {
        console.error("Error CheckIn:", error);
        // Clean up: Hapus foto jika terjadi error database
        if (req.file && req.file.path) {
            try { fs.unlinkSync(req.file.path); } catch(e) {}
        }
        res.status(500).json({ message: "Gagal Check-in: " + error.message });
    }
};

// =================================================================
// 3. FUNGSI CHECK-OUT
// =================================================================

exports.checkOut = async (req, res) => {
    try {
        const userId = req.userId || (req.user && req.user.id);
        const today = new Date().toISOString().split('T')[0];
        
        const presensi = await Presensi.findOne({
            where: { userId: userId, tanggal: today }
        });

        if (!presensi) {
            return res.status(404).json({ message: "Anda belum Check-in hari ini." });
        }

        if (presensi.jamKeluar) {
             return res.status(400).json({ message: "Anda sudah Check-out hari ini." });
        }

        // Update waktu keluar
        presensi.jamKeluar = new Date().toLocaleTimeString('en-GB', { hour12: false });
        // presensi.checkOut = new Date(); // Jika menggunakan timestamp lengkap
        await presensi.save();

        res.status(200).json({ message: "Check-out Berhasil!" });

    } catch (error) {
        console.error("Error CheckOut:", error);
        res.status(500).json({ message: "Gagal Check-out: " + error.message });
    }
};