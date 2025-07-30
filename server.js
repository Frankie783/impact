
const express = require("express");
const fs = require("fs");
const path = require("path");
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

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
