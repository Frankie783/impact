
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

    const reports = response.data;
    console.log(`🔍 Found ${reports.length} reports`);

    let impactData = null;

    for (const report of reports) {
      if (report.dpp && report.dpp.impact) {
        const impact = report.dpp.impact;

        const allKeysPresent =
          impact.water_use !== undefined &&
          impact.ecotoxicity_freshwater !== undefined &&
          impact.ozone_depletion !== undefined &&
          impact.particulate_matter !== undefined;

        if (allKeysPresent) {
          impactData = {
            water_use: impact.water_use,
            ecotoxicity_freshwater: impact.ecotoxicity_freshwater,
            ozone_depletion: impact.ozone_depletion,
            particulate_matter: impact.particulate_matter,
            last_updated: new Date().toISOString(),
          };
          break;
        }
      }
    }

    if (!impactData) {
      throw new Error("Could not find a report with all required impact values.");
    }

    const filePath = path.join(__dirname, "public", "impact.json");
    console.log("🧪 Writing to:", filePath);
    fs.writeFileSync(filePath, JSON.stringify(impactData, null, 2));
    console.log("✅ Successfully wrote impact.json at", filePath);

  } catch (error) {
    console.error("❌ Error during fetch or parse:", error.message);
  }
}

fetchImpactData();
