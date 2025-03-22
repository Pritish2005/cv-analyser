// App.jsx (Main Layout)
import { Link, Outlet } from 'react-router-dom';

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fed7d7] to-[#fff]">
      {/* Main Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img 
              src="https://smarrtifai.com/wp-content/uploads/2024/09/Smarrtifai_FINAL_19th-Sept--600x600.png" 
              alt="logo" 
              className="h-20 w-20 rounded-full"
            />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-[#ed1c24] to-[#f37121] bg-clip-text text-transparent">
              Resume Analyzer Pro
            </h1>
          </div>
        </div>
      </header>

      {/* Analysis Type Navigation */}
      <div className="bg-[#fff5f5] border-b border-[#fed7d7]">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <nav className="flex gap-6">
            <Link 
              to="/specific-analysis" 
              className="px-4 py-2 rounded-lg hover:bg-[#fed7d7] transition-colors font-medium text-[#ed1c24] text-sm"
            >
              Job-Specific Analysis
            </Link>
            <Link 
              to="/overall-analysis" 
              className="px-4 py-2 rounded-lg hover:bg-[#fed7d7] transition-colors font-medium text-[#ed1c24] text-sm"
            >
              Comprehensive Analysis
            </Link>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}