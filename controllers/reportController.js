const db = require("../models");
const { Op } = require("sequelize");

const Presensi = db.Presensi || db.presensi; 
const User = db.User || db.user;

exports.getDailyReport = async (req, res) => {
  try {
    const { nama } = req.query;
    let whereClause = {};

    if (nama) {
        whereClause = {
            [Op.or]: [ 
                { '$User.nama$': { [Op.like]: `%${nama}%` } }
            ]
        };
    }

    const reports = await Presensi.findAll({
      where: whereClause,
      // --- PERBAIKAN: HAPUS 'status' AGAR TIDAK ERROR ---
      attributes: [
          'id', 
          'userId', 
          'tanggal', 
          'jamMasuk', 
          'jamKeluar', 
          'bukti',      
          'latitude',   
          'longitude'
          // 'status'  <-- INI SAYA HAPUS KARENA TIDAK ADA DI DB KAMU
      ],
      include: [{
        model: User, 
        as: 'User', 
        attributes: ['nama', 'email']
      }],
      order: [['tanggal', 'DESC']]
    });

    res.status(200).json({
      message: "Berhasil mengambil laporan",
      data: reports
    });

  } catch (error) {
    console.error("Error Laporan:", error);
    res.status(500).json({ message: "Gagal: " + error.message });
  }
};