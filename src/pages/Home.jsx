import { Link } from "react-router-dom";
import { Database, Play, Code2, Layers } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-full flex flex-col p-8 md:p-12 lg:p-24 max-w-6xl mx-auto">
      <div className="max-w-3xl space-y-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent border border-accent/20 mb-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
          </span>
          <span className="text-xs font-semibold tracking-wide uppercase">VisualDB v1.0</span>
        </div>
        
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-foreground leading-[1.1]">
          See Databases.<br />
          <span className="text-muted-foreground">Don't Just Read About Them.</span>
        </h1>
        
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed">
          The professional visual DBMS learning platform. 
          Stop memorizing syntax and start understanding how SQL execution engines process data row by row.
        </p>

        <div className="flex flex-wrap items-center gap-4 pt-4">
          <Link 
            to="/select" 
            className="inline-flex h-10 items-center justify-center rounded-md bg-foreground px-6 font-medium text-background transition-colors hover:bg-foreground/90 shadow-sm"
          >
            <Play size={16} className="mr-2" fill="currentColor" />
            Start Learning
          </Link>
          <a 
            href="https://github.com/visualdb" 
            target="_blank" 
            rel="noreferrer"
            className="inline-flex h-10 items-center justify-center rounded-md border border-border bg-transparent px-6 font-medium text-foreground transition-colors hover:bg-muted"
          >
            View Documentation
          </a>
        </div>
      </div>

      <div className="mt-24 border-t border-border pt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
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
            icon: Layers,
            title: "Production Ready", 
            desc: "Designed like the tools you'll use in the industry. Open source and built for the developer community." 
          }
        ].map((feature, i) => (
          <div key={i} className="flex flex-col gap-3">
            <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center border border-border">
              <feature.icon size={20} className="text-foreground" />
            </div>
            <h3 className="font-semibold text-foreground text-base tracking-tight">{feature.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{feature.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
