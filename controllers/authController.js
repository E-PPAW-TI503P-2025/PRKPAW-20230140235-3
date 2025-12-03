// FILE: controllers/authController.js
const db = require("../models");
const User = db.user;
const bcrypt = require("bcryptjs"); // Pastikan sudah npm install bcryptjs
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "rahasia";

exports.register = async (req, res) => {
  try {
    const { nama, email, password, role } = req.body;

    // 1. Cek apakah email sudah ada
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "Email sudah terdaftar!" });
    }

    // 2. Enkripsi password (biar aman)
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Simpan ke Database
    // Pastikan role default 'user' jika kosong
    const newUser = await User.create({
      nama,
      email,
      password: hashedPassword,
      role: role || "user" 
    });

    res.status(201).json({
      message: "Registrasi berhasil!",
      user: {
        id: newUser.id,
        nama: newUser.nama,
        email: newUser.email,
        role: newUser.role
      }
    });

  } catch (error) {
    console.error("Error Register:", error); // Ini akan muncul di terminal kalau error
    res.status(500).json({ message: "Terjadi kesalahan pada server: " + error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Cari user berdasarkan email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "Email tidak ditemukan." });
    }

    // 2. Cek password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Password salah!" });
    }

    // 3. Bikin Token (KTP)
    const token = jwt.sign(
      { id: user.id, role: user.role, nama: user.nama },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.status(200).json({
      message: "Login berhasil",
      token: token,
      user: {
        id: user.id,
        nama: user.nama,
        role: user.role
      }
    });

  } catch (error) {
    console.error("Error Login:", error);
    res.status(500).json({ message: "Gagal login: " + error.message });
  }
};