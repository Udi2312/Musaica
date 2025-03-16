const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const connectDB = require('./config/db');
require('dotenv').config();

// Initialize Express
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Vite frontend
    methods: ["GET", "POST"]
  }
});
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(fileUpload());

// Database Connection
connectDB();

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/audio', require('./routes/audio'));

// Start Server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

server.listen(PORT, () => {
    console.log(`Socket.io ready`);
  });