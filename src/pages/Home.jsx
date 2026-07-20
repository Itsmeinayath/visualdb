import { Link } from "react-router-dom";
import { ArrowRight, Database, Play } from "lucide-react";

export default function Home() {
  return (
    <div className="h-full flex flex-col items-center justify-center p-8 text-center">
      <div className="max-w-3xl space-y-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel text-primary border border-primary/20 shadow-[0_0_15px_rgba(59,130,246,0.15)] mb-4">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
          </span>
          <span className="text-sm font-medium">Version 1.0 is live</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-white via-white/90 to-white/30 drop-shadow-sm">
          See Databases.
          <br />
          <span className="text-muted-foreground">Don't Just Read About Them.</span>
        </h1>
        
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          The best free visual DBMS learning platform on the internet. 
          Stop memorizing syntax and start understanding how SQL thinks through interactive animations.
        </p>

        <div className="flex items-center justify-center gap-4 pt-8">
          <Link 
            to="/select" 
            className="group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-md bg-primary px-8 font-medium text-white transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_rgba(59,130,246,0.4)]"
          >
            <span className="mr-2">Start Learning</span>
            <Play size={18} className="transition-transform group-hover:translate-x-1" fill="currentColor" />
          </Link>
          <a 
            href="https://github.com/visualdb" 
            target="_blank" 
            rel="noreferrer"
            className="inline-flex h-12 items-center justify-center rounded-md border border-white/10 bg-white/5 px-8 font-medium text-foreground transition-colors hover:bg-white/10"
          >
            View on GitHub
          </a>
        </div>
        
        <div className="pt-20 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          {[
            { title: "Visual First", desc: "Animation before explanation. Watch how queries affect data row by row." },
            { title: "Interactive", desc: "Experiment with queries and instantly see the results visualized." },
            { title: "Free Forever", desc: "Open source and built for the community. No paywalls, ever." }
          ].map((feature, i) => (
            <div key={i} className="glass-panel p-6 rounded-xl">
              <h3 className="font-display font-semibold text-lg mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
