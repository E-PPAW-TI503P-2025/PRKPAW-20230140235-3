// 1. Ganti sumber data dari array ke model Sequelize
const { Presensi } = require("../models");
const { format } = require("date-fns-tz");
const timeZone = "Asia/Jakarta";

exports.CheckIn = async (req, res) => {
  // 2. Gunakan try...catch untuk error handling
  try {
    const { id: userId, nama: userName } = req.user;
    const waktuSekarang = new Date();

    // 3. Ubah cara mencari data menggunakan 'findOne' dari Sequelize
    const existingRecord = await Presensi.findOne({
      where: { userId: userId, checkOut: null },
    });

    if (existingRecord) {
      return res
        .status(400)
        .json({ message: "Anda sudah melakukan check-in hari ini." });
    }

    // 4. Ubah cara membuat data baru menggunakan 'create' dari Sequelize
    const newRecord = await Presensi.create({
      userId: userId,
      nama: userName,
      checkIn: waktuSekarang,
    });

    const formattedData = {
      userId: newRecord.userId,
      nama: newRecord.nama,
      checkIn: format(newRecord.checkIn, "yyyy-MM-dd HH:mm:ssXXX", { timeZone }),
      checkOut: null,
    };

    res.status(201).json({
      message: `Halo ${userName}, check-in Anda berhasil pada pukul ${format(
        waktuSekarang,
        "HH:mm:ss",
        { timeZone }
      )} WIB`,
      data: formattedData,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Terjadi kesalahan pada server", error: error.message });
  }
};

exports.CheckOut = async (req, res) => {
  // Gunakan try...catch
  try {
    const { id: userId, nama: userName } = req.user;
    const waktuSekarang = new Date();

    // Cari data di database
    const recordToUpdate = await Presensi.findOne({
      where: { userId: userId, checkOut: null },
    });

    if (!recordToUpdate) {
      return res.status(404).json({
        message: "Tidak ditemukan catatan check-in yang aktif untuk Anda.",
      });
    }

    // 5. Update dan simpan perubahan ke database
    recordToUpdate.checkOut = waktuSekarang;
    await recordToUpdate.save();

    const formattedData = {
      userId: recordToUpdate.userId,
      nama: recordToUpdate.nama,
      checkIn: format(recordToUpdate.checkIn, "yyyy-MM-dd HH:mm:ssXXX", {
        timeZone,
      }),
      checkOut: format(recordToUpdate.checkOut, "yyyy-MM-dd HH:mm:ssXXX", {
        timeZone,
      }),
    };

    res.json({
      message: `Selamat jalan ${userName}, check-out Anda berhasil pada pukul ${format(
        waktuSekarang,
        "HH:mm:ss",
        { timeZone }
      )} WIB`,
      data: formattedData,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Terjadi kesalahan pada server", error: error.message });
  }
};

exports.deletePresensi = async (req, res) => {
  try {
    const { id } = req.params;

    // Validasi ID
    const parsedId = Number(id);
    if (!Number.isInteger(parsedId) || parsedId <= 0) {
      return res.status(400).json({ message: "ID tidak valid" });
    }

    // Cari data presensi berdasarkan primary key
    const record = await Presensi.findByPk(parsedId);
    if (!record) {
      return res.status(404).json({ message: "Data presensi tidak ditemukan" });
    }

    // Simpan salinan data sebelum dihapus (untuk response)
    const deletedData = record.toJSON();

    // Hapus data
    await record.destroy();

    return res.status(200).json({
      message: "Data presensi berhasil dihapus",
      data: deletedData,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Terjadi kesalahan pada server", error: error.message });
  }
};

// ============= PERBAIKAN DI SINI =============
exports.updatePresensi = async (req, res) => {
  try { // <-- Tanda kurung { BUKA untuk try
    const { id } = req.params;
    const { checkIn, checkOut, nama } = req.body;

    // Validasi input
    if (checkIn === undefined && checkOut === undefined && nama === undefined) {
      return res.status(400).json({ message: "Tidak ada data yang diupdate" });
    }

    // Kurung } yang salah sebelumnya ada di sini, sekarang DIHAPUS

    // Cari data yang akan diupdate
    const recordToUpdate = await Presensi.findByPk(id);
    if (!recordToUpdate) {
      return res.status(404).json({ message: "Data presensi tidak ditemukan" });
    }

    // Lakukan update pada field yang ada di body
    if (nama !== undefined) {
      recordToUpdate.nama = nama;
    }
    if (checkIn !== undefined) {
      recordToUpdate.checkIn = checkIn;
    }
    if (checkOut !== undefined) {
      recordToUpdate.checkOut = checkOut;
    }

    // Simpan perubahan
    await recordToUpdate.save();

    // Beri response sukses
    res.status(200).json({
      message: "Data presensi berhasil diupdate",
      data: recordToUpdate,
    });

  } catch (error) { // <-- Tanda kurung { BUKA untuk catch
    // Tambahkan blok catch untuk menangani error
    return res.status(500).json({
      message: "Terjadi kesalahan pada server",
      error: error.message,
    });
  } 
};