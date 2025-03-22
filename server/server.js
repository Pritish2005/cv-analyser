require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const pdf = require('pdf-parse');
const mongoose = require('mongoose');

const { GoogleGenerativeAI } = require("@google/generative-ai");
const Analysis = require('./model/analysisData');

const app = express();
const upload = multer({ storage: multer.memoryStorage() });
const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY);

app.use(cors());
app.use(express.json());

const PROMPT =`You are an advanced AI-based Resume Evaluator. Analyze the resume and return only a structured JSON object with the following keys: {"Overall_Score": <Final score out of 100>,
            "Scoring_Breakdown": {
                "Skills_Score": <Score out of 30>,
                "Work_Experience_Score": <Score out of 25>,
                "Projects_Score": <Score out of 20>,
                "Education_Score": <Score out of 10>,
                "Achievements_Score": <Score out of 15>
            },
            "Reason_for_Score": {
                "Skills": "<Analysis of candidate's skills>",
                "Work_Experience": "<Evaluation of work experience>",
                "Projects": "<Impact assessment>",
                "Education": "<Academic evaluation>",
                "Achievements": "<Leadership and awards impact>"
            },
            "Areas_of_Improvement": {
                "Skills": "<Suggested skills to improve>",
                "Work_Experience": "<Experience enhancement tips>",
                "Projects": "<Ways to improve project impact>",
                "Education": "<Academic improvement tips>",
                "Achievements": "<Leadership and awards suggestions>"
            }, 
            "Top_10_Job_Roles": ["Role1", "Role2", ..., "Role10"]
        }

        **Return only valid JSON with no extra text, explanations, or markdown formatting.** 
` ;

// console.log('PROMPT'+PROMPT)

app.post('/analyze', upload.single('resume'), async (req, res) => {
  try {
    // Parse PDF
    const data = await pdf(req.file.buffer);
    if (!data.text) throw new Error('Could not extract text from PDF');
    
    // Analyze with Gemini
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    // const result = PROMPT+data.text;
    // console.log('result', result)
    const result = await model.generateContent(PROMPT + data.text);
    let responseText = result.response.text().trim();
    
    // Improved JSON extraction
    const jsonStart = responseText.indexOf('{');
    const jsonEnd = responseText.lastIndexOf('}') + 1;
    const jsonString = responseText.slice(jsonStart, jsonEnd);
    const analysis = JSON.parse(jsonString);

    const newAnalysis = new Analysis({
      overallScore: analysis.score,
      analysisData: analysis,
      analysisType: 'overall'
    })

    await newAnalysis.save();

    res.json(JSON.parse(jsonString));
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Job Matching Endpoint
app.post('/match-job', upload.single('resume'), async (req, res) => {
  try {
    const jobDescription = req.body.jobDescription;
    const pdfData = await pdf(req.file.buffer);
    
    const prompt = `
    Analyze how well this resume matches the following job description:
    ${jobDescription}

    Return JSON response with:
    {
      "score": <compatibility_score_out_of_100>,
      "strengths": ["list", "of", "matching", "points"],
      "improvements": ["list", "of", "gap", "areas"]
    }
    `;

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent(prompt + pdfData.text);
    let responseText = result.response.text().trim();
    
    // Improved JSON extraction
    const jsonStart = responseText.indexOf('{');
    const jsonEnd = responseText.lastIndexOf('}') + 1;
    const jsonString = responseText.slice(jsonStart, jsonEnd);
    const analysis = JSON.parse(jsonString);

    const newAnalysis = new Analysis({
      overallScore: analysis.score,
      analysisData: analysis,
      analysisType: 'specific'
    })

    await newAnalysis.save();

    res.json(JSON.parse(jsonString));
  } catch (error) {
    res.status(500).json({ error: 'Job matching failed' });
  }
});

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));