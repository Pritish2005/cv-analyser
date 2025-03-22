import { useState } from 'react';
import axios from 'axios';

export default function SpecificAnalysis() {
  const [file, setFile] = useState(null);
  const [jobDesc, setJobDesc] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !jobDesc) return;
    
    try {
      setLoading(true);
      setResult(null);
      const formData = new FormData();
      formData.append('resume', file);
      formData.append('jobDescription', jobDesc);

      const { data } = await axios.post('http://localhost:3001/match-job', formData);
      setResult(data);
    } catch (error) {
      alert(error.response?.data?.error || 'Analysis failed');
    } finally {
      setLoading(false);
    }
  };

  const truncateFileName = (name) => {
    const maxLength = 30;
    if (name.length > maxLength) {
      return name.substring(0, 15) + '...' + name.substring(name.length - 10);
    }
    return name;
  };
  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-[#ed1c24]">Job-Specific Analysis</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block mb-2 font-medium">Job Description</label>
          <textarea
            value={jobDesc}
            onChange={(e) => setJobDesc(e.target.value)}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#f37121]"
            rows="5"
            required
          />
        </div>

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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-gray-600 max-w-[90%] truncate px-2">
                {file ? truncateFileName(file.name) : 'Click to upload PDF resume'}
              </p>
              <p className="text-sm text-gray-400 mt-2">(Max size: 5MB)</p>
            </label>
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-gradient-to-r from-[#ed1c24] to-[#f37121] text-white rounded-lg hover:opacity-90"
          disabled={loading}
        >
          {loading ? 'Analyzing...' : 'Match to Job'}
        </button>
      </form>

      {result && (
        <div className="space-y-8 mt-8">
          {/* Score Display */}
          <div className="bg-white p-8 rounded-2xl shadow-lg border-l-8 border-[#ed1c24]">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800">Compatibility Score</h2>
              <div className={`w-24 h-24 rounded-full flex items-center justify-center ${
                result.score >= 75 ? 'bg-gradient-to-r from-green-400 to-green-600' :
                result.score >= 65 ? 'bg-gradient-to-r from-amber-400 to-amber-500' :
                'bg-gradient-to-r from-[#ed1c24] to-[#f37121]'
              }`}>
                <span className="text-3xl font-bold text-white">
                  {result.score}
                </span>
              </div>
            </div>
          </div>

          {/* Improvement Prompt */}
          {result.score < 75 && (
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
                onClick={() => window.open("https://smarrtifai.com/", "_blank")}
                className="px-6 py-2 bg-[#ed1c24] text-white rounded-lg hover:bg-[#cc1a1a] transition-colors"
              >
                Learn How
              </button>
            </div>
          )}

          {/* Analysis Results */}
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Strengths:</h4>
              <ul className="list-disc pl-4">
                {result.strengths.map((s, i) => (
                  <li key={i} className="mb-2">{s}</li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Improvements Needed:</h4>
              <ul className="list-disc pl-4">
                {result.improvements.map((s, i) => (
                  <li key={i} className="mb-2">{s}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}