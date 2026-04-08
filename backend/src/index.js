const express = require("express");
const cors = require("cors");
const { connectDB } = require('./config/db');
const config = require("./config");
const errorHandler = require("./middleware/errorHandler");
const healthRoutes = require("./routes/healthRoutes");
const resumeRoutes = require("./routes/resumeRoutes");
const authRoutes = require('./routes/authRoutes');
const interviewRoutes = require('./routes/interviewRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

const app = express();

// Connect to MongoDB
connectDB();

// --------------- Middleware ---------------
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// --------------- Routes ---------------
app.use("/api", healthRoutes);
app.use("/api", resumeRoutes);
app.use("/api/auth", authRoutes);
app.use("/api", interviewRoutes);
app.use("/api", dashboardRoutes);


// --------------- Error Handling ---------------
app.use(errorHandler);

// --------------- Start Server ---------------
app.listen(config.port, () => {
  console.log(`Server is running on http://localhost:${config.port}`);
});