import { cn } from "../utils/cn";
import { Play, RotateCcw, Terminal, PencilLine, Lock } from "lucide-react";

export default function Query({
  queryLines = [],
  value = "",
  onChange,
  activeLineIndex = -1,
  onRun,
  onReset,
  isPlaying = false,
  isFinished = false,
}) {
  const isEditable = !isPlaying && !isFinished;

  return (
    <div className="panel overflow-hidden flex flex-col border border-border h-full">
      {/* Editor Header */}
      <div className="bg-zinc-950 px-3 py-2 border-b border-border flex items-center gap-2">
        <Terminal size={14} className="text-zinc-500" />
        <span className="text-xs font-mono text-zinc-400">query.sql</span>
        <span className="ml-auto flex items-center gap-1 text-[10px] font-medium">
          {isEditable ? (
            <span className="text-emerald-400 flex items-center gap-1"><PencilLine size={10} /> Editable</span>
          ) : (
            <span className="text-zinc-500 flex items-center gap-1"><Lock size={10} /> Running...</span>
          )}
        </span>
      </div>

      {/* Body — editable textarea when idle, highlighted lines during animation */}
      {isEditable ? (
        <textarea
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          className="bg-zinc-950 flex-1 p-4 font-mono text-[13px] text-zinc-200 resize-none focus:outline-none leading-relaxed placeholder:text-zinc-600 min-h-[80px]"
          spellCheck={false}
          placeholder={"SELECT *\nFROM students;"}
        />
      ) : (
        <div className="bg-zinc-950 flex-1 p-4 font-mono text-[13px] leading-relaxed flex flex-col overflow-hidden">
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
      )}

      {/* Action Bar */}
      <div className="p-3 bg-zinc-900 border-t border-border flex justify-between items-center gap-2 shrink-0">
        <div className="text-[10px] text-zinc-600 font-mono hidden sm:block">
          {isEditable ? "Edit the query above, then press Run" : ""}
        </div>
        <div className="flex gap-2 ml-auto">
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
            className="flex items-center gap-1.5 px-4 py-1.5 rounded bg-accent text-white text-xs font-medium transition-all hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm active:scale-95"
          >
            <Play size={14} fill="currentColor" />
            Run Query
          </button>
        </div>
      </div>
    </div>
  );
}
