import { Link } from "react-router-dom";
import { Database, Play, Terminal, ArrowRight, Code2, Layers, Zap, BookOpen, Users, Sparkles, Workflow } from "lucide-react";

export default function Home() {
  return (
    <div className="relative min-h-full flex flex-col items-center overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.2] pointer-events-none" />

      {/* Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-accent/20 blur-[120px] rounded-full pointer-events-none opacity-50" />

      {/* ── Hero ── */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-6 pt-20 md:pt-28 pb-12 flex flex-col items-center text-center">

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-400/10 text-emerald-400 border border-emerald-400/20 mb-8 backdrop-blur-sm">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
          </span>
          <span className="text-[11px] font-semibold tracking-widest uppercase">Open Source & Free Forever</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-foreground leading-[1.05] mb-6 max-w-4xl">
          Learn Computer Science by{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-100 to-zinc-500">
            Seeing It Run.
          </span>
        </h1>

        <p className="text-lg md:text-xl text-zinc-400 max-w-2xl leading-relaxed mb-4 font-light">
          A suite of highly interactive, step-by-step visualization engines for SQL, Data Structures, Algorithms, and System Design.
        </p>
        <p className="text-sm text-zinc-500 mb-10">
          Built by the community, for the community. We are actively looking for contributors!
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center">
          <a
            href="#projects"
            className="group inline-flex h-11 items-center justify-center rounded-md bg-zinc-100 px-8 font-medium text-zinc-950 transition-all hover:bg-white hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-white/5"
          >
            Explore Projects
            <ArrowDown size={16} className="ml-2 opacity-50 group-hover:opacity-100 transition-transform group-hover:translate-y-1 duration-200" />
          </a>
          <a
            href="https://github.com/Itsmeinayath/visualdb"
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-11 items-center justify-center rounded-md border border-zinc-800 bg-zinc-950/50 backdrop-blur-sm px-8 font-medium text-zinc-300 transition-colors hover:bg-zinc-900 hover:text-white"
          >
            <GithubIcon size={16} className="mr-2 opacity-70" />
            Contribute on GitHub
          </a>
        </div>
      </div>

      {/* ── Curriculum / Learning Path ── */}
      <div className="relative z-10 w-full max-w-5xl mx-auto px-6 pb-16 pt-10">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold tracking-tight mb-2">SQL Curriculum</h2>
          <p className="text-zinc-500 text-sm">Interactive modules, designed in learning order.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <Link
            to="/select"
            className="panel p-4 bg-zinc-900/30 hover:bg-zinc-900/60 transition-all duration-200 group flex flex-col gap-3 border border-zinc-800"
          >
            <div className="font-mono font-bold text-zinc-100 text-sm">SELECT</div>
            <div className="text-[12px] text-zinc-500 mt-1 leading-relaxed">Retrieve data from a table</div>
          </Link>
          <Link
            to="/where"
            className="panel p-4 bg-zinc-900/30 hover:bg-zinc-900/60 transition-all duration-200 group flex flex-col gap-3 border border-zinc-800"
          >
            <div className="font-mono font-bold text-zinc-100 text-sm">WHERE</div>
            <div className="text-[12px] text-zinc-500 mt-1 leading-relaxed">Filter rows by a condition</div>
          </Link>
        </div>
      </div>

      {/* ── Open Source Call to Action ── */}
      <div className="w-full border-t border-zinc-800/50 bg-accent/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-accent/10 via-transparent to-transparent pointer-events-none" />
        
        <div className="relative z-10 max-w-4xl mx-auto px-6 py-20 text-center flex flex-col items-center">
          <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-6 shadow-xl">
            <Users className="text-accent" size={32} />
          </div>
          <h2 className="text-3xl font-bold tracking-tight mb-4 text-zinc-100">Open for all. Built by you.</h2>
          <p className="text-lg text-zinc-400 leading-relaxed mb-8 max-w-2xl">
            We believe premium education should be free. We are actively looking for developers, designers, and educators to contribute to these engines. Whether it's adding a new SQL operator, a new algorithm, or fixing a bug — you are welcome here.
          </p>
          
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/Itsmeinayath/visualdb"
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-12 items-center justify-center rounded-md bg-zinc-100 px-8 font-semibold text-zinc-950 transition-all hover:bg-white hover:scale-[1.02] shadow-lg shadow-white/10"
            >
              <GithubIcon size={18} className="mr-2" />
              Join the GitHub Project
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

function ArrowDown({ size, className }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <line x1="12" y1="5" x2="12" y2="19"></line>
      <polyline points="19 12 12 19 5 12"></polyline>
    </svg>
  );
}

function GithubIcon({ size, className }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path>
      <path d="M9 18c-4.51 2-5-2-7-2"></path>
    </svg>
  );
}
