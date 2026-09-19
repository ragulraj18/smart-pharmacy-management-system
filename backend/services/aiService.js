const axios = require('axios');
 
const AI_BASE_URL = process.env.AI_SERVICE_URL || 'http://127.0.0.1:8000';
 
// Sends any image (prescription OR medicine strip/package) to the Python
// FastAPI OCR service and returns the extracted text + confidence score.
// This is assistive only — a pharmacist always makes the final approve/
// reject decision on prescriptions, and medicine identification is always
// labeled a "possible match" that the customer should verify.
const extractTextFromImage = async (imagePath) => {
  const { data } = await axios.post(
    `${AI_BASE_URL}/ai/analyze-prescription`,
    { imagePath },
    { timeout: 15000 },
  );
  return data; // { text, confidence } or { text, confidence, message } if low-confidence
};
 
// Sends historical order quantities for a medicine to the Python forecasting
// endpoint and gets back an estimated demand + reorder recommendation.
// Always labelled as an estimate — Node/React must never present this as
// a guaranteed number.
const forecastDemand = async (medicineId, historicalQuantities, currentStock) => {
  const { data } = await axios.post(
    `${AI_BASE_URL}/ai/forecast-demand`,
    { medicineId, historicalQuantities, currentStock },
    { timeout: 15000 },
  );
  return data; // { currentStock, predictedDemand, recommendation, note }
};
 
module.exports = { extractTextFromImage, forecastDemand };
