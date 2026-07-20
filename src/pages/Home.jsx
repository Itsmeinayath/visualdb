import { Link } from "react-router-dom";
import { Database, Play, Terminal, ArrowRight, Code2, Layers, Zap, BookOpen, MousePointerClick, Filter, ArrowDownAZ, Scissors, FolderTree, Combine, TerminalSquare } from "lucide-react";

const curriculum = [
  { to: "/select", label: "SELECT", desc: "Retrieve data from a table", step: 1, difficulty: "Beginner", color: "text-emerald-400", bg: "bg-emerald-400/10 border-emerald-400/20" },
  { to: "/where", label: "WHERE", desc: "Filter rows by a condition", step: 2, difficulty: "Beginner", color: "text-emerald-400", bg: "bg-emerald-400/10 border-emerald-400/20" },
  { to: "/orderby", label: "ORDER BY", desc: "Sort results by any column", step: 3, difficulty: "Beginner", color: "text-emerald-400", bg: "bg-emerald-400/10 border-emerald-400/20" },
  { to: "/limit", label: "LIMIT", desc: "Cap the number of rows returned", step: 4, difficulty: "Beginner", color: "text-emerald-400", bg: "bg-emerald-400/10 border-emerald-400/20" },
  { to: "/groupby", label: "GROUP BY", desc: "Aggregate rows into buckets", step: 5, difficulty: "Intermediate", color: "text-amber-400", bg: "bg-amber-400/10 border-amber-400/20" },
  { to: "/having", label: "HAVING", desc: "Filter aggregated groups", step: 6, difficulty: "Intermediate", color: "text-amber-400", bg: "bg-amber-400/10 border-amber-400/20" },
  { to: "/innerjoin", label: "INNER JOIN", desc: "Merge matching rows from 2 tables", step: 7, difficulty: "Intermediate", color: "text-amber-400", bg: "bg-amber-400/10 border-amber-400/20" },
  { to: "/leftjoin", label: "LEFT JOIN", desc: "Include all rows from the left table", step: 8, difficulty: "Intermediate", color: "text-amber-400", bg: "bg-amber-400/10 border-amber-400/20" },
  { to: "/playground", label: "Playground", desc: "Write your own queries freely", step: null, difficulty: "Practice", color: "text-rose-400", bg: "bg-rose-400/10 border-rose-400/20" },
];

export default function Home() {
  return (
    <div className="relative min-h-full flex flex-col items-center overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.2] pointer-events-none" />

      {/* Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-accent/20 blur-[120px] rounded-full pointer-events-none opacity-50" />

      {/* ── Hero ── */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-6 pt-20 md:pt-28 pb-12 flex flex-col items-center text-center">

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent border border-accent/20 mb-8 backdrop-blur-sm">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
          </span>
          <span className="text-[11px] font-semibold tracking-widest uppercase">VisualDB Engine v1.0 — Open Source</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-foreground leading-[1.05] mb-6 max-w-4xl">
          Learn SQL by{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-100 to-zinc-500">
            Seeing It Run.
          </span>
        </h1>

        <p className="text-lg md:text-xl text-zinc-400 max-w-2xl leading-relaxed mb-4 font-light">
          Watch every query execute step-by-step, row by row. From beginner to advanced — with animated visualizations, not just static notes.
        </p>
        <p className="text-sm text-zinc-500 mb-10">
          No signup. No cost. Built for students and educators.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center">
          <Link
            to="/select"
            className="group inline-flex h-11 items-center justify-center rounded-md bg-zinc-100 px-8 font-medium text-zinc-950 transition-all hover:bg-white hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-white/5"
          >
            <Play size={16} className="mr-2" fill="currentColor" />
            Start Learning
            <ArrowRight size={16} className="ml-2 opacity-50 group-hover:opacity-100 transition-opacity group-hover:translate-x-1 duration-200" />
          </Link>
          <a
            href="https://github.com/Itsmeinayath/visualdb"
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-11 items-center justify-center rounded-md border border-zinc-800 bg-zinc-950/50 backdrop-blur-sm px-8 font-medium text-zinc-300 transition-colors hover:bg-zinc-900 hover:text-white"
          >
            <Terminal size={16} className="mr-2 opacity-70" />
            View on GitHub
          </a>
        </div>
      </div>

      {/* ── How It Works ── */}
      <div className="relative z-10 w-full max-w-5xl mx-auto px-6 pb-16">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold tracking-tight mb-2">How it works</h2>
          <p className="text-zinc-500 text-sm">Three steps. No setup required.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { step: "01", title: "Pick a Topic", desc: "Choose any SQL concept from the sidebar — start with SELECT if you're new, or jump to JOINs if you're experienced.", icon: BookOpen },
            { step: "02", title: "Read the Concept", desc: "Every module has a plain-English explanation and real-world analogies so you always understand the 'why', not just the syntax.", icon: Code2 },
            { step: "03", title: "Watch & Experiment", desc: "Click Run to watch the engine process your query row by row. Edit the query yourself and see what changes in real-time.", icon: Play },
          ].map((item, i) => (
            <div key={i} className="panel p-6 bg-zinc-900/30 hover:bg-zinc-900/50 transition-colors relative overflow-hidden group">
              <div className="absolute top-3 right-4 text-5xl font-black text-zinc-800/50 select-none">{item.step}</div>
              <div className="w-9 h-9 rounded-lg bg-zinc-800 flex items-center justify-center mb-4 border border-zinc-700 group-hover:border-accent/40 transition-colors">
                <item.icon size={16} className="text-zinc-300" />
              </div>
              <h3 className="font-semibold text-zinc-100 mb-2">{item.title}</h3>
              <p className="text-sm text-zinc-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Curriculum / Learning Path ── */}
      <div className="relative z-10 w-full max-w-5xl mx-auto px-6 pb-16">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold tracking-tight mb-2">Full Curriculum</h2>
          <p className="text-zinc-500 text-sm">7 interactive modules, designed in learning order.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {curriculum.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="panel p-4 bg-zinc-900/30 hover:bg-zinc-900/60 transition-all duration-200 group hover:-translate-y-0.5 flex flex-col gap-3 border border-zinc-800 hover:border-zinc-700"
            >
              <div className="flex items-center justify-between">
                {item.step ? (
                  <span className="text-[10px] font-bold text-zinc-500 bg-zinc-800 rounded px-1.5 py-0.5">Step {item.step}</span>
                ) : (
                  <span className="text-[10px] font-bold text-zinc-500 bg-zinc-800 rounded px-1.5 py-0.5">Free</span>
                )}
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${item.bg} ${item.color}`}>
                  {item.difficulty}
                </span>
              </div>
              <div>
                <div className="font-mono font-bold text-zinc-100 text-sm group-hover:text-white transition-colors">{item.label}</div>
                <div className="text-[12px] text-zinc-500 mt-1 leading-relaxed">{item.desc}</div>
              </div>
              <div className="flex items-center gap-1 text-[11px] text-zinc-600 group-hover:text-accent transition-colors mt-auto">
                <span>Open module</span>
                <ArrowRight size={10} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* ── Mock IDE Hero ── */}
      <div className="relative z-10 w-full max-w-5xl mx-auto px-6 pb-24">
        <div className="panel bg-zinc-950/80 backdrop-blur-xl border-zinc-800/80 shadow-2xl overflow-hidden hover:-translate-y-1 transition-transform duration-500">
          {/* Window Controls — real colors */}
          <div className="h-10 border-b border-zinc-800/80 flex items-center px-4 gap-2 bg-zinc-900/50">
            <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
            <div className="ml-4 text-[11px] font-mono text-zinc-500">execution_trace.sql — VisualDB</div>
          </div>
          <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
            <div className="font-mono text-sm leading-loose">
              <div className="text-zinc-500 mb-2">-- Animate a filtering operation</div>
              <div><span className="text-pink-500 font-semibold">SELECT</span> <span className="text-zinc-300">name, age</span></div>
              <div><span className="text-pink-500 font-semibold">FROM</span> <span className="text-blue-400">students</span></div>
              <div><span className="text-pink-500 font-semibold">WHERE</span> <span className="text-zinc-300">age</span> <span className="text-orange-400">&gt; 20</span>;</div>
              <div className="mt-8 flex items-center gap-2 text-xs text-accent">
                <div className="w-2 h-2 rounded-full bg-accent animate-pulse"></div>
                Checking row 3: age = 22 → ✓ passes filter
              </div>
            </div>
            <div className="border border-zinc-800/50 rounded bg-zinc-900/30 p-4 flex flex-col gap-2">
              <div className="text-[10px] uppercase tracking-widest font-semibold text-zinc-500 mb-2">Engine Output</div>
              <div className="h-8 rounded bg-zinc-800/50 border border-zinc-800 flex items-center px-3 text-xs text-zinc-500 font-mono">Row 1: age=19 → ✗ skipped</div>
              <div className="h-8 rounded bg-zinc-800/50 border border-zinc-800 flex items-center px-3 text-xs text-zinc-500 font-mono">Row 2: age=20 → ✗ skipped</div>
              <div className="h-8 rounded bg-zinc-800/50 border border-accent/30 flex items-center px-3 text-xs text-zinc-200 font-mono shadow-[0_0_15px_rgba(99,102,241,0.1)]">Row 3: age=22 → ✓ added to result</div>
              <div className="h-8 rounded bg-zinc-800/50 border border-accent/30 flex items-center px-3 text-xs text-zinc-200 font-mono shadow-[0_0_15px_rgba(99,102,241,0.1)]">Row 4: age=23 → ✓ added to result</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Footer Features ── */}
      <div className="w-full border-t border-zinc-800/50 bg-zinc-950/50">
        <div className="max-w-6xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            {
              icon: Code2,
              title: "Execution Visualization",
              desc: "Watch queries affect data row by row. Real-time feedback on every SQL operation.",
              to: "/select"
            },
            {
              icon: Database,
              title: "Interactive Data Grids",
              desc: "Experiment with queries and instantly see results in animated, professional data tables.",
              to: "/where"
            },
            {
              icon: Zap,
              title: "Open Source",
              desc: "Built for students and educators. Contribute on GitHub and help improve the platform.",
              to: null
            }
          ].map((feature, i) => (
            <div key={i} className="flex flex-col gap-4">
              <div className="w-10 h-10 rounded-lg bg-zinc-900/80 flex items-center justify-center border border-zinc-800/80 shadow-sm">
                <feature.icon size={18} className="text-zinc-300" />
              </div>
              <h3 className="font-semibold text-zinc-100 text-sm tracking-wide">{feature.title}</h3>
              <p className="text-sm text-zinc-500 leading-relaxed font-light">{feature.desc}</p>
              {feature.to && (
                <Link to={feature.to} className="text-xs text-accent hover:underline flex items-center gap-1">
                  Try it <ArrowRight size={10} />
                </Link>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
