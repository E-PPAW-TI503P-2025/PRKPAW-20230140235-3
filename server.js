const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const app = express();
const PORT = 3001;

// Routers
const booksRouter = require('./routes/books');
const presensiRoutes = require("./routes/presensi");
const reportRoutes = require("./routes/reports");

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev")); // Logger yang lebih detail

// Custom logger middleware
app.use((req, res, next) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${req.method} ${req.url} - IP: ${req.ip}`);
    next();
});

// Routes
app.get('/', (req, res) => {
    res.json({
        message: 'Welcome to Library Management API',
        endpoints: {
            books: '/api/books',
            presensi: '/api/presensi',
            reports: '/api/reports',
            health: '/health'
        }
    });
});

app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// API Routes
app.use('/api/books', booksRouter);
app.use("/api/presensi", presensiRoutes);
app.use("/api/reports", reportRoutes);

// 404 Not Found Handler (harus setelah semua rute)
app.use((req, res) => {
    res.status(404).json({
        error: 'Not Found',
        message: `Route ${req.method} ${req.originalUrl} not found`,
        timestamp: new Date().toISOString()
    });
});

// Generic Error Handler (harus di paling akhir)
app.use((err, req, res, next) => {
    console.error(`[${new Date().toISOString()}] Error:`, err.stack);
    
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    
    res.status(statusCode).json({
        error: statusCode === 500 ? 'Internal Server Error' : message,
        message: statusCode === 500 ? 'Something went wrong on the server' : message,
        timestamp: new Date().toISOString(),
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
});

// Start the server (hanya sekali)
app.listen(PORT, () => {
    console.log(`Express server running at http://localhost:${PORT}/`);
    console.log(`Library Management API is ready!`);
});