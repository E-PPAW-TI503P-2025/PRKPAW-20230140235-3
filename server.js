const express = require("express");
const cors = require("cors");
const app = express();
const db = require("./models");
const path = require('path'); // Tambahkan modul 'path'

const PORT = 3001;

app.use(cors());
app.use(express.json());

// --- KONFIGURASI FOLDER STATIS (Folder 'uploads') ---
// Folder 'uploads' sekarang bisa diakses publik melalui URL /uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Import Rute
const authRoutes = require('./routes/auth');
const presensiRoutes = require("./routes/presensi");
const reportRoutes = require("./routes/reports");

// Pasang Rute
app.use('/api/auth', authRoutes);
app.use("/api/presensi", presensiRoutes);
app.use("/api/reports", reportRoutes);

// --- PERHATIKAN: KITA PAKAI 'force: true' UNTUK MEMBERSIHKAN DATABASE ---
db.sequelize.sync({ force: true }).then(() => {
    console.log("Drop and re-sync db.");
    
    app.listen(PORT, () => {
        console.log(`Server Backend berjalan di http://localhost:${PORT}`);
    });
}).catch((err) => {
    console.error("Gagal koneksi database:", err);
});