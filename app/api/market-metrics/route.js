/*import connectMongo from "@/libs/mongoose";
import InterestRates from "@/models/InterestRates";
import MarketSentiment from "@/models/MarketSentiment";
import VolatilityIndex from "@/models/VolatilityIndex";
import MacroEconomic from "@/models/MacroEconomic";

export default async function handler(req, res) {
  await connectMongo();

  try {
    const interestRates = await InterestRates.findOne().lean();
    const marketSentiment = await MarketSentiment.findOne().lean();
    const volatilityIndex = await VolatilityIndex.findOne().lean();
    const macroEconomic = await MacroEconomic.findOne().lean();

    res.status(200).json({
      interestRates,
      marketSentiment,
      volatilityIndex,
      macroEconomic,
    });
  } catch (error) {
    console.error("Failed to fetch market metrics", error);
    res.status(500).json({ error: "Failed to fetch market metrics" });
  }
}*/
