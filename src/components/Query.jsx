import { cn } from "../utils/cn";
import { Play, RotateCcw } from "lucide-react";

export default function Query({ 
  queryLines = [], 
  activeLineIndex = -1,
  onRun,
  onReset,
  isPlaying = false,
  isFinished = false
}) {
  return (
    <div className="glass-panel rounded-xl overflow-hidden shadow-2xl shadow-black/50 border border-border flex flex-col h-full">
      <div className="bg-card/50 px-4 py-3 border-b border-border flex items-center justify-between">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
          <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50"></div>
        </div>
        <div className="text-xs font-mono text-muted-foreground uppercase tracking-widest">Query Editor</div>
      </div>
      
      <div className="p-6 font-mono text-lg leading-loose flex-1 flex flex-col justify-center">
        {queryLines.map((line, idx) => (
          <div 
            key={idx}
            className={cn(
              "px-4 py-1 -mx-4 rounded-md transition-all duration-300 border border-transparent",
              activeLineIndex === idx 
                ? "bg-primary/20 text-white border-primary/50 shadow-[0_0_15px_rgba(59,130,246,0.1)] scale-[1.02] transform-gpu font-bold" 
                : activeLineIndex > idx
                  ? "text-muted-foreground opacity-50"
                  : "text-foreground"
            )}
          >
            {line}
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-border flex justify-end gap-3 bg-black/10">
        <button
          onClick={onReset}
          disabled={isPlaying && !isFinished}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all hover:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <RotateCcw size={16} />
          Reset
        </button>
        <button
          onClick={onRun}
          disabled={isPlaying || isFinished}
          className="flex items-center gap-2 px-6 py-2 rounded-lg bg-primary text-white text-sm font-medium transition-all hover:bg-primary/90 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg shadow-primary/20"
        >
          <Play size={16} fill="currentColor" />
          Run Animation
        </button>
      </div>
    </div>
  );
}
