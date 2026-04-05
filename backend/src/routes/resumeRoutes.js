const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const { uploadResume } = require("../controllers/resumeController");

router.post("/resume/upload", upload.single("resume"), uploadResume);

module.exports = router;
