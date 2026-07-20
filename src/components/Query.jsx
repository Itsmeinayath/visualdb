import { cn } from "../utils/cn";
import { Play, RotateCcw, Terminal } from "lucide-react";

export default function Query({ 
  queryLines = [], 
  activeLineIndex = -1,
  onRun,
  onReset,
  isPlaying = false,
  isFinished = false
}) {
  return (
    <div className="panel overflow-hidden flex flex-col border border-border h-full">
      {/* Editor Header */}
      <div className="bg-zinc-950 px-3 py-2 border-b border-border flex items-center gap-2">
        <Terminal size={14} className="text-zinc-500" />
        <span className="text-xs font-mono text-zinc-400">query.sql</span>
      </div>
      
      {/* Code Editor Body */}
      <div className="bg-zinc-950 flex-1 p-4 font-mono text-[13px] leading-relaxed flex flex-col relative overflow-hidden">
        {queryLines.map((line, idx) => (
          <div 
            key={idx}
            className={cn(
              "flex transition-colors duration-150 rounded px-2 -mx-2 py-0.5",
              activeLineIndex === idx 
                ? "bg-accent/20 border-l-2 border-accent text-zinc-100" 
                : activeLineIndex > idx
                  ? "text-zinc-600 border-l-2 border-transparent"
                  : "text-zinc-300 border-l-2 border-transparent"
            )}
          >
            <div className="w-6 shrink-0 text-right pr-3 text-zinc-600 select-none tabular-nums">
              {idx + 1}
            </div>
            <div>{line}</div>
          </div>
        ))}
      </div>

      {/* Action Bar */}
      <div className="p-3 bg-zinc-900 border-t border-border flex justify-end gap-2 shrink-0">
        <button
          onClick={onReset}
          disabled={isPlaying && !isFinished}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium text-zinc-300 transition-colors hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed border border-transparent"
        >
          <RotateCcw size={14} />
          Reset
        </button>
        <button
          onClick={onRun}
          disabled={isPlaying || isFinished}
          className="flex items-center gap-1.5 px-4 py-1.5 rounded bg-accent text-white text-xs font-medium transition-all hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
        >
          <Play size={14} fill="currentColor" />
          Run
        </button>
      </div>
    </div>
  );
}
