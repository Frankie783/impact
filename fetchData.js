const axios = require("axios");
const fs = require("fs");
const path = require("path"); // ← ADD THIS
require("dotenv").config();

const USER_ID = process.env.USER_ID;
const SECRET = process.env.SECRET;

async function fetchImpactData() {
  try {
    const response = await axios.get("https://api.made2flow.com/v1/scope3/reports/2025", {
      headers: {
        "X-API-KEY": SECRET
      }
    });

    const result = response.data[0]; // Assuming first report is desired
    const data = {
      water_use: result.water_use,
      ecotoxicity_freshwater: result.ecotoxicity_freshwater,
      ozone_depletion: result.ozone_depletion,
      particulate_matter: result.particulate_matter,
      last_updated: new Date().toISOString()
    };

    const filePath = path.join(__dirname, "impact.json"); // ← ✅ SAVE IN SAME FOLDER
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    console.log("✅ Impact data saved:", filePath);
  } catch (error) {
    console.error("❌ Failed to fetch impact data:", error.message);
  }
}

fetchImpactData();
