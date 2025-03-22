import { useState } from "react";
import axios from "axios";

export default function OverallAnalysis() {
  const [file, setFile] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    try {
      setLoading(true);
      setAnalysis(null);
      const formData = new FormData();
      formData.append("resume", file);

      const { data } = await axios.post(
        "http://localhost:3001/analyze",
        formData
      );
      setAnalysis(data);
    } catch (error) {
      alert(error.response?.data?.error || "Analysis failed");
    } finally {
      setLoading(false);
    }
  };

  const truncateFileName = (name) => {
    const maxLength = 30;
    if (name.length > maxLength) {
      return name.substring(0, 15) + "..." + name.substring(name.length - 10);
    }
    return name;
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-[#ed1c24]">
        Comprehensive Resume Analysis
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-[#ed1c24] to-[#f37121] rounded-xl blur opacity-25 group-hover:opacity-40 transition"></div>
          <div className="relative">
            <label className="flex flex-col items-center justify-center h-64 border-4 border-dashed border-[#f37121]/30 hover:border-[#f37121]/50 rounded-2xl cursor-pointer transition-colors">
              <input
                type="file"
                accept=".pdf"
                onChange={(e) => {
                  setFile(e.target.files[0]);
                  setAnalysis(null);
                }}
                className="hidden"
              />
              <svg
                className="w-12 h-12 mb-4 text-[#ed1c24]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <p className="text-gray-600 max-w-[90%] truncate px-2">
                {file
                  ? truncateFileName(file.name)
                  : "Click to upload PDF resume"}
              </p>
              <p className="text-sm text-gray-400 mt-2">(Max size: 5MB)</p>
            </label>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 px-6 bg-gradient-to-r from-[#ed1c24] to-[#f37121] text-white font-semibold rounded-xl hover:shadow-lg transition-all transform hover:scale-[1.02] disabled:opacity-50"
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg
                className="animate-spin h-5 w-5 mr-3 text-white"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Analyzing...
            </span>
          ) : (
            "Start Analysis"
          )}
        </button>
      </form>

      {analysis && (
        <div className="space-y-8 mt-8">
          <div className="bg-white p-8 rounded-2xl shadow-lg border-l-8 border-[#ed1c24]">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800">
                Overall Score
              </h2>
              <div className="w-24 h-24 bg-gradient-to-r from-[#ed1c24] to-[#f37121] rounded-full flex items-center justify-center">
                <span className="text-3xl font-bold text-white">
                  {analysis.Overall_Score}
                </span>
              </div>
            </div>
          </div>

          {analysis && analysis.Overall_Score < 75 && (
            <div className="bg-[#fee] border-l-4 border-[#ed1c24] p-4 rounded-lg mb-8 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-[#ed1c24] mb-2">
                  Need Help Improving Your Score?
                </h3>
                <p className="text-gray-600">
                  Get personalized guidance to boost your resume effectiveness
                </p>
              </div>
              <button
                onClick={() =>
                  (window.open("https://smarrtifai.com/", "_blank"))
                }
                className="px-6 py-2 bg-[#ed1c24] text-white rounded-lg hover:bg-[#cc1a1a] transition-colors"
              >
                Learn How
              </button>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <h3 className="text-xl font-bold mb-6 text-[#ed1c24]">
                Scoring Breakdown
              </h3>
              <div className="space-y-4">
                {Object.entries(analysis.Scoring_Breakdown).map(
                  ([category, score]) => (
                    <div
                      key={category}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <span className="font-medium text-gray-700">
                        {category.replace("_", " ")}
                      </span>
                      <span className="font-bold text-[#f37121]">
                        {score}/{getMaxScore(category)}
                      </span>
                    </div>
                  )
                )}
              </div>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <h3 className="text-xl font-bold mb-6 text-[#ed1c24]">
                Recommended Roles
              </h3>
              <div className="flex flex-wrap gap-2">
                {analysis.Top_10_Job_Roles.map((role, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-gradient-to-r from-[#f37121] to-[#ed1c24] text-white rounded-full text-sm font-medium"
                  >
                    {role}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <h3 className="text-xl font-bold mb-6 text-[#ed1c24]">
                Strengths Analysis
              </h3>
              <div className="space-y-4">
                {Object.entries(analysis.Reason_for_Score).map(
                  ([category, text]) => (
                    <div
                      key={category}
                      className="p-4 border-l-4 border-[#f37121] bg-gray-50 rounded-lg"
                    >
                      <h4 className="font-medium text-gray-800 mb-2">
                        {category}
                      </h4>
                      <p className="text-gray-600">{text}</p>
                    </div>
                  )
                )}
              </div>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <h3 className="text-xl font-bold mb-6 text-[#ed1c24]">
                Improvement Suggestions
              </h3>
              <div className="space-y-4">
                {Object.entries(analysis.Areas_of_Improvement).map(
                  ([category, text]) => (
                    <div
                      key={category}
                      className="p-4 border-l-4 border-[#ed1c24] bg-gray-50 rounded-lg"
                    >
                      <h4 className="font-medium text-gray-800 mb-2">
                        {category}
                      </h4>
                      <p className="text-gray-600">{text}</p>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Helper function
function getMaxScore(category) {
  const maxScores = {
    Skills_Score: 30,
    Work_Experience_Score: 25,
    Projects_Score: 20,
    Education_Score: 10,
    Achievements_Score: 15,
  };
  return maxScores[category];
}
