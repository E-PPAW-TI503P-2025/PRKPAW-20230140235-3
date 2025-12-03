const db = require("../models");

// --- FIX UTAMA: DETEKSI MODEL ---
// Mencari model 'Presensi' (Besar) atau 'presensi' (Kecil) secara otomatis.
const Presensi = db.Presensi || db.presensi;

exports.checkIn = async (req, res) => {
  try {
    // 1. Cek Model Database
    if (!Presensi) {
        console.error("FATAL: Model Presensi tidak ditemukan di db object.");
        return res.status(500).json({ message: "Server Error: Database bermasalah." });
    }

    // 2. Cek User dari Token
    if (!req.user || !req.user.id) {
        return res.status(401).json({ message: "User tidak dikenali! Silakan login ulang." });
    }

    const userId = req.user.id;
    // 3. Ambil Lokasi dari Frontend
    const { latitude, longitude } = req.body; 
    
    const today = new Date().toISOString().slice(0, 10);

    // 4. Cek apakah sudah absen?
    const existing = await Presensi.findOne({
        where: { userId: userId, tanggal: today }
    });

    if (existing) {
        return res.status(400).json({ message: "Anda sudah Check-in hari ini!" });
    }

    // 5. Simpan Data
    await Presensi.create({
        userId: userId,
        jamMasuk: new Date(),
        tanggal: today,
        latitude: latitude || null,
        longitude: longitude || null
    });

    res.status(200).json({ message: "Check-in Berhasil!" });

  } catch (error) {
    console.error("Error CheckIn:", error);
    res.status(500).json({ message: "Gagal Check-in: " + error.message });
  }
};

exports.checkOut = async (req, res) => {
  try {
    if (!Presensi) {
        return res.status(500).json({ message: "Server Error: Database bermasalah." });
    }

    const userId = req.user.id;
    const today = new Date().toISOString().slice(0, 10);
    
    const presensi = await Presensi.findOne({
      where: { userId: userId, tanggal: today }
    });

    if (!presensi) {
      return res.status(404).json({ message: "Anda belum Check-in hari ini." });
    }

    // Update waktu keluar
    presensi.jamKeluar = new Date();
    presensi.checkOut = new Date();
    await presensi.save();

    res.status(200).json({ message: "Check-out Berhasil!" });

  } catch (error) {
    console.error("Error CheckOut:", error);
    res.status(500).json({ message: "Gagal Check-out: " + error.message });
  }
};