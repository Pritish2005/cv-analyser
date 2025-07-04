const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY);

const PROMPT =`You are an advanced AI-based Resume Evaluator.

Analyze the resume and return only a structured JSON object with the following keys:

{
  "feedback": {
    "score": <Final score out of 100>,
    "strengths": [
      "<One strong point about resume>",
      "<Another strength>",
      "<Another strength>"
    ],
    "improvements": [
      "<One area to improve>",
      "<Another improvement suggestion>",
      "<Another improvement suggestion>"
    ]
  }
}

Return only valid JSON. Do not include any explanations, markdown, or text outside the JSON object.
` ;

const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

const getModelReponse=async(data)=>{
    const result = await model.generateContent(PROMPT + data.text);
    let responseText = result.response.text().trim();

    const jsonStart = responseText.indexOf('{');
    const jsonEnd = responseText.lastIndexOf('}') + 1;
    const jsonString = responseText.slice(jsonStart, jsonEnd);
    const analysis = JSON.parse(jsonString);
    return analysis;
}

module.exports={getModelReponse}