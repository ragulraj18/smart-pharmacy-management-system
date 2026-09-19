const path = require('path');
const Medicine = require('../models/Medicine');
const ChatHistory = require('../models/ChatHistory');
const aiService = require('../services/aiService');
 
// Very small local fallback matcher — used if the AI service can't parse intent.
const extractMedicineKeyword = (message) => {
  const cleaned = message
    .toLowerCase()
    .replace(/is|available|do you have|show|the|a|an|mg|tablet|tablets|\?/g, ' ')
    .trim();
  return cleaned.split(/\s+/).slice(0, 3).join(' ');
};
 
// POST /api/ai/chat  { message }
const chat = async (req, res, next) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ success: false, message: 'Message is required' });
 
    const keyword = extractMedicineKeyword(message);
 
    const medicine = await Medicine.findOne({
      $text: { $search: keyword },
    }).catch(() => null) || await Medicine.findOne({
      name: { $regex: keyword, $options: 'i' },
    });
 
    let responseText;
    if (!medicine) {
      responseText = `I couldn't find a medicine matching "${keyword}" in our records. Please check the spelling or browse the Medicines page.`;
    } else if (medicine.stock > 0) {
      responseText = `Yes. ${medicine.name} ${medicine.strength || ''} is currently available.\nStock: ${medicine.stock}\nPrice: ₹${medicine.price}`;
    } else {
      responseText = `${medicine.name} ${medicine.strength || ''} is currently out of stock.`;
    }
 
    if (req.user) {
      await ChatHistory.create({ userId: req.user._id, message, response: responseText });
    }
 
    res.json({ success: true, response: responseText, medicine: medicine || null });
  } catch (error) {
    next(error);
  }
};
 
// Pulls out anything that looks like a candidate medicine name/keyword from
// raw OCR text. Strips numbers-only tokens, keeps words 3+ characters.
const extractCandidateWords = (text) => {
  return text
    .split(/\s+/)
    .map((w) => w.replace(/[^a-zA-Z]/g, ''))
    .filter((w) => w.length >= 3);
};
 
// POST /api/ai/identify-medicine  (multipart file upload, field name "image")
// Runs OCR on the uploaded photo, then matches the extracted text against
// the real medicine catalog. This NEVER invents a match — if OCR confidence
// is low or nothing in the catalog matches, it says so plainly.
const identifyMedicine = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'An image file is required' });
    }
 
    const absolutePath = path.join(__dirname, '..', 'uploads', req.file.filename);
 
    let ocrResult;
    try {
      ocrResult = await aiService.extractTextFromImage(absolutePath);
    } catch (aiError) {
      return res.status(502).json({
        success: false,
        message: 'AI service is unreachable. Make sure it is running on port 8000.',
      });
    }
 
    if (ocrResult.message || !ocrResult.text) {
      return res.json({
        match: null,
        confidence: ocrResult.confidence || 0,
        message: ocrResult.message || 'Unable to identify reliably. Please upload a clearer image or consult a pharmacist.',
      });
    }
 
    // Try each candidate word from the OCR text against the catalog until
    // one produces a real match — never guess if nothing matches.
    const candidates = extractCandidateWords(ocrResult.text);
    let medicine = null;
 
    for (const word of candidates) {
      medicine = await Medicine.findOne({ name: { $regex: word, $options: 'i' } })
        || await Medicine.findOne({ genericName: { $regex: word, $options: 'i' } })
        || await Medicine.findOne({ brandName: { $regex: word, $options: 'i' } });
      if (medicine) break;
    }
 
    if (!medicine) {
      return res.json({
        match: null,
        confidence: ocrResult.confidence,
        extractedText: ocrResult.text,
        message: 'No matching medicine found in our catalog for the text detected. Please verify the packaging or consult a pharmacist.',
      });
    }
 
    res.json({
      match: {
        _id: medicine._id,
        name: medicine.name,
        genericName: medicine.genericName,
        strength: medicine.strength,
        available: medicine.stock > 0,
        stock: medicine.stock,
        price: medicine.price,
      },
      confidence: ocrResult.confidence,
      extractedText: ocrResult.text,
      message: 'Possible match — please verify against the packaging before use.',
    });
  } catch (error) {
    next(error);
  }
};
 
// GET /api/ai/health
const aiHealth = async (req, res) => {
  res.json({ success: true, message: 'AI routes are mounted. Chat availability is DB-verified.' });
};
 
module.exports = { chat, identifyMedicine, aiHealth };
