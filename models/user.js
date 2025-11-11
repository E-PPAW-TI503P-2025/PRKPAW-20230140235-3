'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index.js` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // Contoh: User.hasMany(models.Presensi, { foreignKey: 'userId' });
    }
  }
  User.init({
    // ID (Primary Key)
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    // NAMA
    nama: {
      type: DataTypes.STRING,
      allowNull: false
    },
    // EMAIL
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    // PASSWORD
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    // ROLE
    role: {
      type: DataTypes.ENUM('mahasiswa', 'admin'),
      allowNull: false,
      defaultValue: 'mahasiswa'
    }
    // createdAt dan updatedAt akan ditambahkan secara otomatis oleh Sequelize
  }, {
    sequelize,
    modelName: 'User',
    // PENTING: Sequelize akan otomatis mencari tabel 'Users' (jamak dari 'User')
    // yang mana sudah benar sesuai file migrasi Anda (createTable('Users',...))
  });
  return User;
};