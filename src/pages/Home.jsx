import { Link } from "react-router-dom";
import { Database, Play, Terminal, ArrowRight, Code2, Layers, Zap } from "lucide-react";

export default function Home() {
  return (
    <div className="relative min-h-full flex flex-col items-center overflow-hidden">
      {/* SaaS Background Grid */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.2] pointer-events-none" />
      
      {/* Subtle Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-accent/20 blur-[120px] rounded-full pointer-events-none opacity-50" />

      <div className="relative z-10 w-full max-w-6xl mx-auto px-6 pt-24 md:pt-32 pb-16 flex flex-col items-center text-center">
        
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent border border-accent/20 mb-8 backdrop-blur-sm">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
          </span>
          <span className="text-[11px] font-semibold tracking-widest uppercase">VisualDB Engine v1.0</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-foreground leading-[1.05] mb-6 max-w-4xl">
          Learn SQL & Database<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-100 to-zinc-500">
            Concepts Visually.
          </span>
        </h1>
        
        <p className="text-lg md:text-xl text-zinc-400 max-w-2xl leading-relaxed mb-10 font-light">
          Animations. Interactive Simulations. Open Source.<br/>
          Built for students, educators, and self-learners to understand how databases think.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center">
          <Link 
            to="/select" 
            className="group inline-flex h-11 items-center justify-center rounded-md bg-zinc-100 px-8 font-medium text-zinc-950 transition-all hover:bg-white hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-white/5"
          >
            <Play size={16} className="mr-2" fill="currentColor" />
            Start Execution Trace
            <ArrowRight size={16} className="ml-2 opacity-50 group-hover:opacity-100 transition-opacity group-hover:translate-x-1 duration-200" />
          </Link>
          <a 
            href="https://github.com/Itsmeinayath/visualdb" 
            target="_blank" 
            rel="noreferrer"
            className="inline-flex h-11 items-center justify-center rounded-md border border-zinc-800 bg-zinc-950/50 backdrop-blur-sm px-8 font-medium text-zinc-300 transition-colors hover:bg-zinc-900 hover:text-white"
          >
            <Terminal size={16} className="mr-2 opacity-70" />
            View Documentation
          </a>
        </div>
      </div>

      {/* Hero Visual - Mock IDE */}
      <div className="relative z-10 w-full max-w-5xl mx-auto px-6 pb-24 perspective-[1000px]">
        <div className="panel bg-zinc-950/80 backdrop-blur-xl border-zinc-800/80 shadow-2xl overflow-hidden transform-gpu hover:-translate-y-1 transition-transform duration-500">
          
          {/* Mac Window Controls */}
          <div className="h-10 border-b border-zinc-800/80 flex items-center px-4 gap-2 bg-zinc-900/50">
            <div className="w-3 h-3 rounded-full bg-zinc-700"></div>
            <div className="w-3 h-3 rounded-full bg-zinc-700"></div>
            <div className="w-3 h-3 rounded-full bg-zinc-700"></div>
            <div className="ml-4 text-[11px] font-mono text-zinc-500">execution_trace.sql — VisualDB</div>
          </div>
          
          {/* Mock Code & Visualization */}
          <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
            <div className="font-mono text-sm leading-loose">
              <div className="text-zinc-500 mb-2">-- Animate a filtering operation</div>
              <div><span className="text-pink-500 font-semibold">SELECT</span> <span className="text-zinc-300">name, role</span></div>
              <div><span className="text-pink-500 font-semibold">FROM</span> <span className="text-blue-400">users</span></div>
              <div><span className="text-pink-500 font-semibold">WHERE</span> <span className="text-zinc-300">role</span> = <span className="text-green-400">'admin'</span>;</div>
              
              <div className="mt-8 flex items-center gap-2 text-xs text-accent">
                <div className="w-2 h-2 rounded-full bg-accent animate-pulse"></div>
                Evaluating AST Node...
              </div>
            </div>
            
            <div className="border border-zinc-800/50 rounded bg-zinc-900/30 p-4 flex flex-col gap-2">
               <div className="text-[10px] uppercase tracking-widest font-semibold text-zinc-500 mb-2">Memory Buffer</div>
               <div className="h-8 rounded bg-zinc-800/50 border border-zinc-800 flex items-center px-3 text-xs text-zinc-400 font-mono">Row 1: Skipped (role='user')</div>
               <div className="h-8 rounded bg-zinc-800/50 border border-accent/30 flex items-center px-3 text-xs text-zinc-200 font-mono shadow-[0_0_15px_rgba(99,102,241,0.1)]">Row 2: Pushed to Result Set (role='admin')</div>
               <div className="h-8 rounded bg-zinc-800/50 border border-zinc-800 flex items-center px-3 text-xs text-zinc-400 font-mono">Row 3: Skipped (role='user')</div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full border-t border-zinc-800/50 bg-zinc-950/50">
        <div className="max-w-6xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            { 
              icon: Code2,
              title: "Execution Visualization", 
              desc: "Watch how queries affect data row by row, condition by condition. Real-time feedback on SQL operations." 
            },
            { 
              icon: Database,
              title: "Interactive Data Grids", 
              desc: "Experiment with queries and instantly see the results visualized in high-density, professional data tables." 
            },
            { 
              icon: Zap,
              title: "Production Ready", 
              desc: "Designed like the tools you'll use in the industry. Open source and built for the developer community." 
            }
          ].map((feature, i) => (
            <div key={i} className="flex flex-col gap-4">
              <div className="w-10 h-10 rounded-lg bg-zinc-900/80 flex items-center justify-center border border-zinc-800/80 shadow-sm">
                <feature.icon size={18} className="text-zinc-300" />
              </div>
              <h3 className="font-semibold text-zinc-100 text-sm tracking-wide">{feature.title}</h3>
              <p className="text-sm text-zinc-500 leading-relaxed font-light">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
