const { Presensi } = require("../models");
const { Op } = require("sequelize");

exports.getDailyReport = async (req, res) => {
  try {
    // 1. Ambil query params baru (tanggalMulai & tanggalSelesai)
    const { nama, tanggalMulai, tanggalSelesai } = req.query;
    let options = { where: {} };

    // 2. Filter 'nama' (Kode yang sudah ada, tidak diubah)
    if (nama) {
      options.where.nama = {
        [Op.like]:` %${nama}%`,
      };
    }

    // 3. (TAMBAHAN) Filter rentang tanggal
    if (tanggalMulai && tanggalSelesai) {
      // Set 'startDate' ke awal hari (00:00:00)
      const startDate = new Date(tanggalMulai);
      startDate.setHours(0, 0, 0, 0);

      // Set 'endDate' ke akhir hari (23:59:59)
      const endDate = new Date(tanggalSelesai);
      endDate.setHours(23, 59, 59, 999);

      // Terapkan [Op.between] pada field 'checkIn'
      // Asumsi Anda ingin memfilter berdasarkan kapan mereka check-in
      options.where.checkIn = {
        [Op.between]: [startDate, endDate],
      };
    }

    // 4. Cari data dengan semua filter yang aktif
    const records = await Presensi.findAll(options);

    res.json({
      reportDate: new Date().toLocaleDateString(),
      data: records,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Gagal mengambil laporan", error: error.message });
  }
};