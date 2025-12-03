const db = require("../models");
const Presensi = db.presensi;

exports.checkIn = async (req, res) => {
  try {
    // Cek apakah user terdeteksi oleh middleware?
    if (!req.user || !req.user.id) {
        return res.status(401).json({ message: "User tidak dikenali! Silakan Logout dan Login lagi." });
    }

    const userId = req.user.id;
    const today = new Date().toISOString().slice(0, 10);

    // Cek duplikat
    const existing = await Presensi.findOne({
        where: { userId: userId, tanggal: today }
    });

    if (existing) {
        return res.status(400).json({ message: "Anda sudah Check-in hari ini!" });
    }

    // Simpan
    await Presensi.create({
      userId: userId,
      jamMasuk: new Date(),
      tanggal: today
    });

    res.status(200).json({ message: "Check-in berhasil!" });
  } catch (error) {
    console.error("Error CheckIn:", error);
    res.status(500).json({ message: "Server Error: " + error.message });
  }
};

exports.checkOut = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
        return res.status(401).json({ message: "User tidak dikenali! Silakan Logout dan Login lagi." });
    }

    const userId = req.user.id;
    const today = new Date().toISOString().slice(0, 10);
    
    const presensi = await Presensi.findOne({
      where: { userId: userId, tanggal: today }
    });

    if (!presensi) {
      return res.status(404).json({ message: "Anda belum Check-in hari ini" });
    }

    presensi.jamKeluar = new Date();
    await presensi.save();

    res.status(200).json({ message: "Check-out berhasil!" });
  } catch (error) {
    res.status(500).json({ message: "Server Error: " + error.message });
  }
};