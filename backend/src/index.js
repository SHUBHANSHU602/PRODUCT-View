const express = require("express");
const cors = require("cors");
const config = require("./config");
const errorHandler = require("./middleware/errorHandler");
const healthRoutes = require("./routes/healthRoutes");
const resumeRoutes = require("./routes/resumeRoutes");

const app = express();

// --------------- Middleware ---------------
app.use(cors());
app.use(express.json());

// --------------- Routes ---------------
app.use("/api", healthRoutes);
app.use("/api", resumeRoutes);

// --------------- Error Handling ---------------
app.use(errorHandler);

// --------------- Start Server ---------------
app.listen(config.port, () => {
  console.log(`Server is running on http://localhost:${config.port}`);
});
