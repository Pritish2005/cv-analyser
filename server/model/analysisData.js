const mongoose = require("mongoose");

const analysisSchema=new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  overallScore: Number,
  analysisData: Object,
  analysisType: String
})

const Analysis = mongoose.model('Analysis', analysisSchema);

module.exports = Analysis;