// FILE: server.js
const express = require("express");
const cors = require("cors");
const app = express();
const db = require("./models");

const PORT = 3001;

app.use(cors());
app.use(express.json());

// Import Rute
const authRoutes = require('./routes/auth');
const presensiRoutes = require("./routes/presensi");
const reportRoutes = require("./routes/reports");

// Pasang Rute
app.use('/api/auth', authRoutes);
app.use("/api/presensi", presensiRoutes);
app.use("/api/reports", reportRoutes);

// --- PERHATIKAN: KITA PAKAI 'force: true' UNTUK MEMBERSIHKAN DATABASE ---
db.sequelize.sync({ alter: true }).then(() => {
    console.log(">>> DATABASE BERHASIL DI-RESET TOTAL! DATA KOTOR SUDAH HILANG. <<<");
    
    app.listen(PORT, () => {
        console.log(`Server Backend berjalan di http://localhost:${PORT}`);
    });
}).catch((err) => {
    console.error("Gagal koneksi database:", err);
});