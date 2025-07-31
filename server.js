const express = require("express");
const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");
const app = express();
const PORT = process.env.PORT || 3000;

app.get("/api/impact", (req, res) => {
  const filePath = "/opt/render/project/go/src/github.com/Frankie783/impact/impact.json";
  console.log("📦 Reading impact.json from:", filePath);

  try {
    const data = fs.readFileSync(filePath, "utf8");
    res.setHeader("Content-Type", "application/json");
    res.send(data);
  } catch (err) {
    console.error("❌ Could not read impact.json:", err.message);
    res.status(500).send({ error: "Data not available" });
  }
});

app.get("/api/refresh", (req, res) => {
  console.log("🔄 Running fetchData.js to refresh impact.json...");

  exec("node fetchData.js", (error, stdout, stderr) => {
    if (error) {
      console.error("❌ Fetch script failed:", error.message);
      console.error("stderr:", stderr);
      return res.status(500).json({ success: false, error: error.message });
    }

    console.log("✅ fetchData.js output:\n", stdout);
    res.json({ success: true, message: "Impact data refreshed." });
  });
});

app.listen(PORT, () => {
  console.log("🚀 Server running on port", PORT);
});
