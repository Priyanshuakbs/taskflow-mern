require("dotenv").config();
const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const connectDB = require("./config/db");

// ================= CONNECT DATABASE =================

connectDB();

const app = express();

// ================= MIDDLEWARES =================

// CORS configuration (allow localhost + Vercel frontend)
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://taskflow-frontend-gray.vercel.app"
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
  })
);

// Parse JSON
app.use(express.json());

// Serve uploaded files
app.use("/uploads", express.static("uploads"));

// ================= ROUTES =================

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/tasks", require("./routes/taskRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/dashboard", require("./routes/dashboardRoutes"));

// Root route
app.get("/", (req, res) => {
  res.send("🚀 TaskFlow API Running...");
});

// ================= SOCKET.IO =================

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:3000",
      "https://taskflow-frontend-gray.vercel.app"
    ],
    methods: ["GET", "POST"]
  }
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// Make io accessible in controllers
app.set("io", io);

// ================= SERVER START =================

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});