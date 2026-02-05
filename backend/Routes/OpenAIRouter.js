const express = require("express");
const { generateCode } = require("../Controllers/openaiController");

const router = express.Router();

router.post("/generate", generateCode);

module.exports = router;
