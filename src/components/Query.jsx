import { cn } from "../utils/cn";
import { Play, RotateCcw, Terminal, PencilLine, Lock, Pause, SkipForward, Gauge, Trash2, Copy, Check } from "lucide-react";
import { useState } from "react";

const SPEED_OPTIONS = [
  { label: "0.5×", value: 0.5 },
  { label: "1×",   value: 1   },
  { label: "2×",   value: 2   },
  { label: "3×",   value: 3   },
];

export default function Query({
  queryLines = [],
  value = "",
  onChange,
  activeLineIndex = -1,
  onRun,
  onReset,
  onPause,
  onStep,
  isPlaying = false,
  isFinished = false,
  isPaused = false,
  speed = 1,
  onSpeedChange,
}) {
  const isEditable = !isPlaying && !isFinished;
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="panel overflow-hidden flex flex-col border border-border h-full">
      {/* Editor Header */}
      <div className="bg-zinc-950 px-3 py-2 border-b border-border flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Terminal size={14} className="text-zinc-500" />
          <span className="text-xs font-mono text-zinc-400">query.sql</span>
        </div>
        <div className="flex items-center gap-2">
          {isEditable && value && (
            <button
              onClick={() => onChange?.("")}
              className="flex items-center gap-1 px-2 py-1 rounded text-xs text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 transition cursor-pointer"
              title="Clear editor"
            >
              <Trash2 size={13} />
            </button>
          )}
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 px-2 py-1 rounded text-xs text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100 transition cursor-pointer"
          >
            {copied ? (
              <>
                <Check size={14} className="text-emerald-500" />
                <span className="text-[11px]">Copied!</span>
              </>
            ) : (
              <>
                <Copy size={14} className="text-zinc-400" />
                <span className="text-[11px]">Copy</span>
              </>
            )}
          </button>
          <span className="text-[10px] font-medium ml-1">
            {isEditable ? (
              <span className="text-emerald-400 flex items-center gap-1"><PencilLine size={10} /> Editable</span>
            ) : isPaused ? (
              <span className="text-amber-400 flex items-center gap-1"><Pause size={10} /> Paused</span>
            ) : (
              <span className="text-zinc-500 flex items-center gap-1"><Lock size={10} /> Running...</span>
            )}
          </span>
        </div>
      </div>

      {/* Body — editable textarea when idle, highlighted lines during animation */}
      {isEditable ? (
        <textarea
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          className="query-textarea bg-zinc-950 flex-1 p-4 font-mono text-[13px] text-zinc-200 resize-none focus:outline-none leading-relaxed placeholder:text-zinc-600 min-h-[80px]"
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
      <div className="px-3 py-2 bg-zinc-900 border-t border-border flex flex-wrap justify-between items-center gap-2 shrink-0">
        {/* Speed selector — visible when playing/paused */}
        {(isPlaying || isPaused) && onSpeedChange ? (
          <div className="flex items-center gap-1.5">
            <Gauge size={12} className="text-zinc-500" />
            <div className="flex gap-1">
              {SPEED_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => onSpeedChange(opt.value)}
                  className={cn(
                    "px-1.5 py-0.5 rounded text-[10px] font-mono font-bold transition-all",
                    speed === opt.value
                      ? "bg-accent text-white"
                      : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800"
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-[10px] text-zinc-600 font-mono hidden sm:block">
            {isEditable ? "Edit the query above, then press Run" : ""}
          </div>
        )}

        <div className="flex gap-2 ml-auto">
          <button
            onClick={onReset}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium text-zinc-300 transition-colors hover:bg-zinc-800 border border-transparent"
          >
            <RotateCcw size={13} />
            Reset
          </button>

          {/* Pause/Step controls when animation is live */}
          {isPlaying && !isFinished && (
            <>
              {onPause && (
                <button
                  onClick={onPause}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium border border-zinc-700 text-zinc-300 hover:bg-zinc-800 transition-colors"
                >
                  {isPaused ? <Play size={13} fill="currentColor" /> : <Pause size={13} />}
                  {isPaused ? "Resume" : "Pause"}
                </button>
              )}
              {isPaused && onStep && (
                <button
                  onClick={onStep}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium border border-accent/50 text-accent hover:bg-accent/10 transition-colors"
                >
                  <SkipForward size={13} />
                  Step
                </button>
              )}
            </>
          )}

          {/* Run button when idle */}
          {!isPlaying && (
            <button
              onClick={onRun}
              disabled={isFinished}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded bg-accent text-white text-xs font-medium transition-all hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm active:scale-95"
            >
              <Play size={13} fill="currentColor" />
              Run Query
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
