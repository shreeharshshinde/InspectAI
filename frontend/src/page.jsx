import React, { useEffect, useState } from "react";
import {
  FiPlus,
  FiFolder,
  FiAlertCircle,
  FiCheckCircle,
  FiClock,
  FiChevronDown,
  FiChevronRight,
  FiCode,
  FiGitBranch,
  FiZap,
  FiSettings,
  FiDownload,
  FiPlay,
  FiFilter
} from "react-icons/fi";
import JiraIssues from "./components/JiraIssues";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

/*
  This Page component extends your UI with Analytics and Reports tabs.
  It uses your existing aurora tokens/classes like card-aurora, stat-card, btn-aurora, etc.
*/

const sampleTrend = (points = 12) =>
  Array.from({ length: points }).map((_, i) => Math.round(50 + Math.sin(i / 2) * 15 + Math.random() * 10));

const Page = () => {
  const [user, setUser] = useState(null);
  const [showHistory, setShowHistory] = useState(false);
  const [activeTab, setActiveTab] = useState("jira");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Analytics state (sample)
  const [timeRange, setTimeRange] = useState("30d");
  const [languageFilter, setLanguageFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [trendData, setTrendData] = useState(sampleTrend(12));
  const [reportHistory, setReportHistory] = useState([
    { id: "r1", name: "Weekly Summary - Oct 2025", createdAt: "2025-10-26", size: "12 KB" },
    { id: "r2", name: "Vulnerability Scan - Oct 2025", createdAt: "2025-10-18", size: "8 KB" },
  ]);

  const chatHistory = [
    { id: "1", title: "Code optimization review", timestamp: "2 hours ago", type: "review" },
    { id: "2", title: "Bug in data mapping function", timestamp: "1 day ago", type: "bug" },
    { id: "3", title: "API integration error fix", timestamp: "3 days ago", type: "fix" },
    { id: "4", title: "Performance analysis", timestamp: "1 week ago", type: "analysis" },
    { id: "5", title: "Security vulnerability scan", timestamp: "2 weeks ago", type: "security" },
    { id: "6", title: "Database query optimization", timestamp: "3 weeks ago", type: "review" },
    { id: "7", title: "UI component refactoring", timestamp: "1 month ago", type: "analysis" },
  ];

  const navigate = useNavigate();

  useEffect(() => {
    const fetchJiraUser = async () => {
      try {
        const response = await axios.get("http://localhost:5000/user");
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching Jira user:", error);
      }
    };

    fetchJiraUser();
  }, []);

  const openChat = (chatId) => {
    navigate(`/chat/${chatId}`);
  };

  const getHistoryIcon = (type) => {
    switch (type) {
      case "review": return <FiCheckCircle className="text-aurora-green" />;
      case "bug": return <FiAlertCircle className="text-aurora-red" />;
      case "fix": return <FiZap className="text-aurora-yellow" />;
      case "analysis": return <FiCode className="text-aurora-blue" />;
      case "security": return <FiAlertCircle className="text-aurora-orange" />;
      default: return <FiCode className="text-gray-400" />;
    }
  };

  // Analytics helpers
  const refreshTrend = (range) => {
    // simulate different trend data per range
    const size = range === "7d" ? 7 : range === "90d" ? 18 : 12;
    setTrendData(sampleTrend(size));
    setTimeRange(range);
  };

  // Generate a small CSV report and trigger download (demo)
  const generateCsvReport = (reportName = "report") => {
    // sample rows (you can replace with real data)
    const rows = [
      ["Issue ID", "Summary", "Priority", "Status", "Created At"],
      ["ISSUE-102", "Null pointer check", "High", "Fixed", "2025-10-22"],
      ["ISSUE-215", "API response validation", "Medium", "Open", "2025-10-24"],
    ];
    const csvContent = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    const filename = `${reportName.replace(/\s+/g, "_")}_${new Date().toISOString().slice(0,10)}.csv`;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);

    // add to report history for UI feedback
    const newReport = { id: `r${Date.now()}`, name: reportName, createdAt: new Date().toISOString().slice(0,10), size: `${Math.round(blob.size/1024)} KB` };
    setReportHistory((prev) => [newReport, ...prev]);
  };

  // Download existing report (simulate by regenerating same CSV)
  const downloadReport = (report) => {
    generateCsvReport(report.name);
  };

  // small inline sparkline SVG generator
  const Sparkline = ({ data = [] , stroke = "#C48FFF"}) => {
    if (!data || data.length === 0) return null;
    const w = 220, h = 40;
    const max = Math.max(...data), min = Math.min(...data);
    const points = data.map((v, i) => {
      const x = (i / (data.length - 1)) * w;
      const y = h - ((v - min) / (max - min || 1)) * h;
      return `${x},${y}`;
    }).join(" ");
    return (
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="inline-block">
        <polyline fill="none" stroke={stroke} strokeWidth="2" points={points} strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  };

  return (
    <div className="min-h-screen aurora-bg text-white font-['Inter',_system-ui,_-apple-system]">
      <div className="relative min-h-screen flex">
        {/* left sidebar */}
        <aside
          className={`transition-width duration-300 ease-out flex flex-col justify-between
            ${isSidebarCollapsed ? "w-20" : "w-72"} p-4`}
        >
          <div className="rounded-2xl card-aurora h-full flex flex-col overflow-hidden border-aurora/20">
            {/* top */}
            <div className={`p-4 ${isSidebarCollapsed ? "flex-col items-center" : ""}`}>
              <div className="flex items-center gap-3">
                <div className="logo-aurora">
                  <FiCode className="text-2xl" />
                </div>
                {!isSidebarCollapsed && (
                  <div>
                    <h2 className="text-lg font-semibold text-white">InspectAI</h2>
                    <p className="text-xs text-aurora-muted">Code Intelligence</p>
                  </div>
                )}
              </div>
              <div className="mt-4">
                <button
                  onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                  className="text-aurora-muted text-xs px-2 py-1 rounded-md hover:bg-aurora-hover transition"
                >
                  {isSidebarCollapsed ? "Expand" : "Collapse"}
                </button>
              </div>
            </div>

            {/* middle: actions & history */}
            <div className="px-3 pb-4 overflow-auto">
              <div className="space-y-2">
                <Link to="/code-review" className="block">
                  <div className="action-item">
                    <div className="action-icon bg-aurora-soft">
                      <FiPlus />
                    </div>
                    {!isSidebarCollapsed && <span className="text-white">New Analysis</span>}
                  </div>
                </Link>

                <Link to="/code-review" className="block">
                  <div className="action-item">
                    <div className="action-icon bg-aurora-blue-soft">
                      <FiCheckCircle />
                    </div>
                    {!isSidebarCollapsed && <span className="text-white">Code Review</span>}
                  </div>
                </Link>

                <Link to="/raise-issues" className="block">
                  <div className="action-item">
                    <div className="action-icon bg-aurora-red-soft">
                      <FiAlertCircle />
                    </div>
                    {!isSidebarCollapsed && <span className="text-white">Raise Issues</span>}
                  </div>
                </Link>

                <div className="mt-4">
                  <button
                    onClick={() => setShowHistory(!showHistory)}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-aurora-hover transition"
                  >
                    <div className="flex items-center gap-3">
                      <div className="action-icon bg-aurora-yellow-soft">
                        <FiClock />
                      </div>
                      {!isSidebarCollapsed && <span className="text-white">Recent Analysis</span>}
                    </div>
                    {!isSidebarCollapsed && (
                      showHistory ? <FiChevronDown /> : <FiChevronRight />
                    )}
                  </button>

                  {showHistory && !isSidebarCollapsed && (
                    <div className="mt-3 pl-2 space-y-2 max-h-48 overflow-y-auto">
                      {chatHistory.map((item) => (
                        <button
                          key={item.id}
                          onClick={() => openChat(item.id)}
                          className="w-full flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-aurora-hover transition text-left"
                        >
                          <div className="w-8 flex-shrink-0">{getHistoryIcon(item.type)}</div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium truncate text-white">{item.title}</p>
                            <p className="text-xs text-aurora-muted">{item.timestamp}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* bottom: user */}
            <div className="p-4 border-t border-aurora/10 flex items-center gap-3">
              {user && user.avatar ? (
                <img src={user.avatar} alt="avatar" className="w-10 h-10 rounded-xl border-2 border-aurora/30" />
              ) : (
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-sm font-semibold">
                  {user ? user.name.charAt(0) : "?"}
                </div>
              )}
              {!isSidebarCollapsed && (
                <div className="min-w-0">
                  <p className="text-sm font-semibold truncate text-white">{user ? user.name : "Loading..."}</p>
                  <p className="text-xs text-aurora-muted truncate">{user ? user.email : "user@example.com"}</p>
                </div>
              )}
              {!isSidebarCollapsed && (
                <button className="ml-auto p-2 rounded-lg hover:bg-aurora-hover transition">
                  <FiSettings className="text-white" />
                </button>
              )}
            </div>
          </div>
        </aside>

        {/* main area */}
        <main className="flex-1 flex flex-col p-6">
          {/* header */}
          <header className="mb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="tabs bg-aurora-soft/20 rounded-full p-1 flex gap-2">
                  <button
                    onClick={() => setActiveTab("jira")}
                    className={`px-4 py-2 rounded-full text-sm transition ${activeTab === "jira" ? "tab-active" : "tab-inactive"}`}
                  >
                    Jira Issues
                  </button>
                  <button
                    onClick={() => setActiveTab("analytics")}
                    className={`px-4 py-2 rounded-full text-sm transition ${activeTab === "analytics" ? "tab-active" : "tab-inactive"}`}
                  >
                    Analytics
                  </button>
                  <button
                    onClick={() => setActiveTab("reports")}
                    className={`px-4 py-2 rounded-full text-sm transition ${activeTab === "reports" ? "tab-active" : "tab-inactive"}`}
                  >
                    Reports
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-xs text-aurora-muted">InspectAI v2.1.0</div>
              </div>
            </div>
          </header>

          {/* TAB CONTENT */}
          {activeTab === "jira" && (
            <>
              {/* stats */}
              <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="stat-card">
                  <div className="flex items-center gap-3">
                    <div className="stat-icon bg-aurora-green-soft">
                      <FiCheckCircle />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-white">24</p>
                      <p className="text-xs text-aurora-muted">Issues Fixed</p>
                    </div>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="flex items-center gap-3">
                    <div className="stat-icon bg-aurora-blue-soft">
                      <FiCode />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-white">156</p>
                      <p className="text-xs text-aurora-muted">Code Reviews</p>
                    </div>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="flex items-center gap-3">
                    <div className="stat-icon bg-aurora-purple-soft">
                      <FiGitBranch />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-white">89%</p>
                      <p className="text-xs text-aurora-muted">Quality Score</p>
                    </div>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="flex items-center gap-3">
                    <div className="stat-icon bg-aurora-red-soft">
                      <FiAlertCircle />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-white">12</p>
                      <p className="text-xs text-aurora-muted">Critical Issues</p>
                    </div>
                  </div>
                </div>
              </section>

              {/* content */}
              <section className="flex-1 overflow-hidden">
                <div className="h-full overflow-hidden rounded-2xl card-aurora border-aurora/20 p-4">
                  <div className="h-full overflow-auto">
                    <JiraIssues />
                  </div>
                </div>
              </section>
            </>
          )}

          {activeTab === "analytics" && (
            <>
              {/* Analytics header controls */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <button className={`px-3 py-1 rounded-lg ${timeRange === "7d" ? "tab-active" : "tab-inactive"}`} onClick={() => refreshTrend("7d")}>7d</button>
                    <button className={`px-3 py-1 rounded-lg ${timeRange === "30d" ? "tab-active" : "tab-inactive"}`} onClick={() => refreshTrend("30d")}>30d</button>
                    <button className={`px-3 py-1 rounded-lg ${timeRange === "90d" ? "tab-active" : "tab-inactive"}`} onClick={() => refreshTrend("90d")}>90d</button>
                  </div>

                  <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-aurora-soft/10">
                    <FiFilter className="text-aurora-muted" />
                    <select className="bg-transparent outline-none text-white text-sm" value={languageFilter} onChange={(e) => setLanguageFilter(e.target.value)}>
                      <option  value=""  className="text-black">All Languages</option>
                      <option value="JavaScript"  className="text-black">JavaScript</option>
                      <option value="Python"  className="text-black">Python</option>
                      <option value="TypeScript"  className="text-black">TypeScript</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-aurora-soft/10">
                    <select className="bg-transparent outline-none text-white text-sm" value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)}>
                      <option value="">All Priority</option>
                      <option value="High"  className="text-black">High</option>
                      <option value="Medium"  className="text-black">Medium</option>
                      <option value="Low"  className="text-black">Low</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button className="btn-aurora flex items-center gap-2" onClick={() => { setTrendData(sampleTrend(12)); }}>
                    <FiPlay /> Refresh
                  </button>
                  <button className="btn-aurora bg-gradient-to-r from-purple-500 to-pink-500 flex items-center gap-2" onClick={() => generateCsvReport("Analytics_Snapshot")}>
                    <FiDownload /> Export CSV
                  </button>
                </div>
              </div>

              {/* KPI + charts */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
                <div className="card-aurora p-4 rounded-lg">
                  <p className="text-xs text-aurora-muted">Active Issues (trend)</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold text-white">128</p>
                      <p className="text-xs text-aurora-muted">Open vs Closed</p>
                    </div>
                    <div><Sparkline data={trendData} stroke="#8FD3FF" /></div>
                  </div>
                </div>

                <div className="card-aurora p-4 rounded-lg">
                  <p className="text-xs text-aurora-muted">Reviews per day</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold text-white">34</p>
                      <p className="text-xs text-aurora-muted">avg / day</p>
                    </div>
                    <div><Sparkline data={trendData.map(v => v * 0.8)} stroke="#C48FFF" /></div>
                  </div>
                </div>

                <div className="card-aurora p-4 rounded-lg">
                  <p className="text-xs text-aurora-muted">Quality Score</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold text-white">89%</p>
                      <p className="text-xs text-aurora-muted">Team average</p>
                    </div>
                    <div><Sparkline data={trendData.map(v => 80 + v/3)} stroke="#6FE7C1" /></div>
                  </div>
                </div>
              </div>

              {/* More analytics: Top contributors + breakdown */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="card-aurora p-4 rounded-lg">
                  <h4 className="text-sm font-semibold text-white mb-3">Top Contributors</h4>
                  <ul className="space-y-2">
                    <li className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-md bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">AJ</div>
                        <div>
                          <p className="text-sm text-white">A. Joshi</p>
                          <p className="text-xs text-aurora-muted">24 reviews</p>
                        </div>
                      </div>
                      <div className="text-xs text-aurora-muted">+12%</div>
                    </li>

                    <li className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-md bg-gradient-to-br from-green-500 to-teal-400 flex items-center justify-center">RK</div>
                        <div>
                          <p className="text-sm text-white">R. Kumar</p>
                          <p className="text-xs text-aurora-muted">20 reviews</p>
                        </div>
                      </div>
                      <div className="text-xs text-aurora-muted">+6%</div>
                    </li>

                    <li className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-md bg-gradient-to-br from-pink-500 to-red-400 flex items-center justify-center">SM</div>
                        <div>
                          <p className="text-sm text-white">S. Mehta</p>
                          <p className="text-xs text-aurora-muted">18 reviews</p>
                        </div>
                      </div>
                      <div className="text-xs text-aurora-muted">-2%</div>
                    </li>
                  </ul>
                </div>

                <div className="card-aurora p-4 rounded-lg lg:col-span-2">
                  <h4 className="text-sm font-semibold text-white mb-3">Breakdown by Language</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="p-3 rounded-lg bg-transparent border border-aurora/8">
                      <p className="text-sm text-white font-semibold">JavaScript</p>
                      <p className="text-xs text-aurora-muted">45 issues</p>
                    </div>
                    <div className="p-3 rounded-lg bg-transparent border border-aurora/8">
                      <p className="text-sm text-white font-semibold">Python</p>
                      <p className="text-xs text-aurora-muted">28 issues</p>
                    </div>
                    <div className="p-3 rounded-lg bg-transparent border border-aurora/8">
                      <p className="text-sm text-white font-semibold">TypeScript</p>
                      <p className="text-xs text-aurora-muted">12 issues</p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === "reports" && (
            <>
              <div className="flex items-center justify-between mb-4 gap-4">
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-semibold text-white">Reports</h3>
                  <p className="text-xs text-aurora-muted">Generate and download analysis reports</p>
                </div>

                <div className="flex items-center gap-3">
                  <input type="text" placeholder="Report name (optional)" id="reportNameInput" className="input-aurora" style={{width:200}} />
                  <button
                    className="btn-aurora flex items-center gap-2"
                    onClick={() => {
                      const nameInput = document.getElementById("reportNameInput");
                      const name = nameInput?.value?.trim() || `Summary_Report`;
                      generateCsvReport(name);
                      if (nameInput) nameInput.value = "";
                    }}
                  >
                    <FiPlay /> Generate Report
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="card-aurora p-4 rounded-lg">
                  <h4 className="text-sm font-semibold text-white mb-3">Recent Reports</h4>
                  <div className="space-y-3">
                    {reportHistory.map((r) => (
                      <div key={r.id} className="flex items-center justify-between p-3 rounded-md bg-transparent border border-aurora/8">
                        <div>
                          <p className="text-sm text-white font-medium">{r.name}</p>
                          <p className="text-xs text-aurora-muted">{r.createdAt} • {r.size}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button className="inline-flex items-center gap-2 px-3 py-2 rounded-md hover:bg-aurora-hover transition" onClick={() => downloadReport(r)}>
                            <FiDownload className="text-white" />
                            <span className="text-xs text-white">Download</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="card-aurora p-4 rounded-lg lg:col-span-2">
                  <h4 className="text-sm font-semibold text-white mb-3">Report Details</h4>
                  <p className="text-xs text-aurora-muted mb-3">Use the generate button to create a CSV snapshot of recent issues and reviews. Reports include summary counts, top contributors, and raw issue rows.</p>

                  <div className="p-3 bg-transparent rounded-lg border border-aurora/8">
                    <p className="text-sm text-white font-semibold">Sample Report Preview</p>
                    <pre className="text-xs text-aurora-muted mt-2 bg-gray-900/20 p-3 rounded">{`Issue ID,Summary,Priority,Status,Created At
ISSUE-102,Null pointer check,High,Fixed,2025-10-22
ISSUE-215,API response validation,Medium,Open,2025-10-24`}</pre>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* footer */}
          <footer className="mt-6 text-center text-xs text-aurora-muted">
            <div className="flex items-center justify-center gap-4">
              <span>InspectAI v2.1.0</span>
              <span className="w-1 h-1 bg-aurora-muted rounded-full" />
              <span>AI-powered code analysis</span>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
};

export default Page;