import mongoose from 'mongoose';

const MarketMetricSchema = new mongoose.Schema({
  title: String,
  value: mongoose.Schema.Types.Mixed,
  lastUpdated: Date
});

export default mongoose.models.MarketMetric || mongoose.model('MarketMetric', MarketMetricSchema);
