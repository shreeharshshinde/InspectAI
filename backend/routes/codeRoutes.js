const express = require("express");
const { uploadCode } = require("../controllers/codeController");

const router = express.Router();

router.post("/upload", uploadCode);

module.exports = router;
