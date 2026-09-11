import { Activity, AlertTriangle, BarChart3, FolderKanban, LayoutDashboard, MessageSquare } from "lucide-react";

const navigation = [
  ["Overview", LayoutDashboard],
  ["Projects", FolderKanban],
  ["Analytics", BarChart3],
  ["Alerts", AlertTriangle],
  ["Assistant", MessageSquare],
] as const;

function App() {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark"><Activity size={20} /></div>
          <div>
            <strong>PRAGATI AI</strong>
            <span>Infrastructure Intelligence</span>
          </div>
        </div>

        <nav>
          {navigation.map(([label, Icon], index) => (
            <button className={`nav-item ${index === 0 ? "active" : ""}`} key={label}>
              <Icon size={18} />
              {label}
            </button>
          ))}
        </nav>
      </aside>

      <main className="main">
        <header className="topbar">
          <div>
            <p className="eyebrow">NATIONAL INFRASTRUCTURE MONITORING</p>
            <h1>Pragati AI</h1>
          </div>
          <div className="status">● System ready</div>
        </header>

        <section className="hero">
          <p>Predict. Prevent. Progress.</p>
          <h2>Infrastructure intelligence for proactive intervention.</h2>
          <span>The dashboard skeleton is ready. Connect real PAIMANA data, ML predictions and risk intelligence next.</span>
        </section>

        <section className="cards">
          {[
            ["1,981", "Projects monitored"],
            ["247", "High-risk projects"],
            ["182", "Cost-risk projects"],
            ["134", "Delay-risk projects"],
          ].map(([value, label]) => (
            <div className="card" key={label}>
              <strong>{value}</strong>
              <span>{label}</span>
            </div>
          ))}
        </section>

        <section className="grid">
          <div className="panel large">
            <div className="panel-heading">
              <div>
                <p className="eyebrow">RISK OVERVIEW</p>
                <h3>Project risk distribution</h3>
              </div>
              <span className="muted">Demo data</span>
            </div>
            <div className="placeholder-chart">
              <div className="bar low" style={{ height: "72%" }}><span>Low</span></div>
              <div className="bar medium" style={{ height: "48%" }}><span>Medium</span></div>
              <div className="bar high" style={{ height: "30%" }}><span>High</span></div>
              <div className="bar critical" style={{ height: "16%" }}><span>Critical</span></div>
            </div>
          </div>

          <div className="panel">
            <div className="panel-heading">
              <div>
                <p className="eyebrow">EARLY WARNING</p>
                <h3>Attention required</h3>
              </div>
            </div>
            <div className="warning">
              <AlertTriangle size={18} />
              <div>
                <strong>Risk engine pending</strong>
                <p>ML predictions and alert rules will appear here after integration.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
