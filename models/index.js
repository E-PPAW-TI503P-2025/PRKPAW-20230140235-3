const Sequelize = require('sequelize');
const config = require('../config/config.json');
const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];
const db = {};

let sequelize;
if (dbConfig.use_env_variable) {
  sequelize = new Sequelize(process.env[dbConfig.use_env_variable], dbConfig);
} else {
  sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, dbConfig);
}

// --- BAGIAN INI KITA PAKSA MANUAL BIAR TIDAK ERROR ---
db.user = require("./user.js")(sequelize, Sequelize);
db.presensi = require("./presensi.js")(sequelize, Sequelize);

// Definisi Relasi (Hubungan antar tabel)
// Kita cek dulu apakah modelnya ada biar tidak crash
if (db.user && db.presensi) {
    db.user.hasMany(db.presensi, { foreignKey: 'userId' });
    db.presensi.belongsTo(db.user, { foreignKey: 'userId' });
}

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;