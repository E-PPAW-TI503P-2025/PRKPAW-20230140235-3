'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const Presensi = sequelize.define('Presensi', {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    tanggal: {
      type: DataTypes.DATEONLY,
      defaultValue: DataTypes.NOW
    },
    jamMasuk: {
      type: DataTypes.TIME,
      defaultValue: DataTypes.NOW
    },
    jamKeluar: {
      type: DataTypes.TIME
    },
    checkOut: { 
      type: DataTypes.DATE, // Jika ini menyimpan timestamp lengkap
      allowNull: true
    },
    // --- KOLOM PENTING YANG SEBELUMNYA HILANG ---
    bukti: {
      type: DataTypes.STRING, // Menyimpan path gambar (misal: "uploads/foto.jpg")
      allowNull: true
    },
    // --------------------------------------------
    latitude: {
      type: DataTypes.DECIMAL(10, 8),
      allowNull: true
    },
    longitude: {
      type: DataTypes.DECIMAL(11, 8),
      allowNull: true
    }
  }, {
    tableName: 'presensis',
    timestamps: true // Biasanya true agar ada createdAt/updatedAt
  });

  Presensi.associate = function(models) {
    Presensi.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'User' 
    });
  };

  return Presensi;
};