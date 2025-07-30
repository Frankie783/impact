const express = require("express");
const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");
const app = express();
const PORT = process.env.PORT || 3000;

app.get("/api/impact", (req, res) => {
  try {
    const data = fs.readFileSync(path.join(__dirname, "impact.json"), "utf8");
    res.setHeader("Content-Type", "application/json");
    res.send(data);
  } catch (err) {
    res.status(500).send({ error: "Data not available" });
  }
});

// ✅ NEW: Refresh endpoint to run fetchData.js
app.get("/api/refresh", (req, res) => {
  exec("node fetchData.js", (error, stdout, stderr) => {
    if (error) {
      console.error("Fetch script failed:", error.message);
      return res.status(500).json({ success: false, error: error.message });
    }
    res.json({ success: true, message: "Impact data refreshed." });
  });
});

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
