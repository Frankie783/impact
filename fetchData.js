const axios = require("axios");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const SECRET = process.env.SECRET;

async function fetchImpactData() {
  try {
    const response = await axios.get("https://api.made2flow.com/v1/scope3/reports/2024", {
      headers: {
        "X-API-KEY": SECRET,
      },
    });

    const result = response.data[0]; // first item
    if (!result || !result.dpp || !result.dpp.impact) {
      throw new Error("No impact data found in API response.");
    }

    const impact = result.dpp.impact;

    const data = {
      water_use: impact.water_use,
      ecotoxicity_freshwater: impact.ecotoxicity_freshwater,
      ozone_depletion: impact.ozone_depletion,
      particulate_matter: impact.particulate_matter,
      last_updated: new Date().toISOString(),
    };

    const outputPath = path.join(__dirname, "impact.json");
    fs.writeFileSync(outputPath, JSON.stringify(data, null, 2));
    console.log("✅ Impact data saved to", outputPath);
  } catch (error) {
    console.error("❌ Failed to fetch or parse impact data:", error.message);
  }
}

fetchImpactData();
