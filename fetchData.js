const axios = require("axios");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const SECRET = process.env.SECRET;

async function fetchImpactData() {
  try {
    const response = await axios.get("https://api.made2flow.com/v1/scope3/reports/2024", {
      headers: {
        "X-API-KEY": SECRET
      }
    });

    const report = response.data[0];

    if (!report || !report.dpp || !report.dpp.impact) {
      console.warn("❗ No impact data found.");
      return;
    }

    const fullImpact = {
      ...report.dpp.impact,
      last_updated: new Date().toISOString()
    };

    const filePath = path.join(__dirname, "impact.json");
    fs.writeFileSync(filePath, JSON.stringify(fullImpact, null, 2));
    console.log("✅ Impact data saved:", filePath);
  } catch (error) {
    console.error("❌ Failed to fetch impact data:", error.message);
  }
}

fetchImpactData();
