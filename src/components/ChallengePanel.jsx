import { ChevronLeft, ChevronRight, Trophy, CheckCircle2, XCircle, Circle } from "lucide-react";
import { cn } from "../utils/cn";

/**
 * Shared multi-challenge panel used by every module.
 *
 * Props:
 *  current        – the challenge object: { question, hint? }
 *  currentIdx     – 0-based index of visible challenge
 *  total          – total challenges count
 *  currentStatus  – "idle" | "pass" | "fail"
 *  statuses       – array of all statuses, for the dot indicators
 *  isFinished     – whether the query execution just completed
 *  onPrev / onNext – navigation
 */
export default function ChallengePanel({
  current,
  currentIdx,
  total,
  currentStatus,
  statuses,
  isFinished,
  onPrev,
  onNext,
}) {
  return (
    <div
      className={cn(
        "panel p-4 flex flex-col gap-3 border transition-colors",
        currentStatus === "pass"
          ? "bg-emerald-500/5 border-emerald-500/25"
          : currentStatus === "fail"
          ? "bg-red-500/5 border-red-500/25"
          : "bg-accent/5 border-accent/20"
      )}
    >
      {/* Header row */}
      <div className="flex items-center justify-between">
        <div className="text-xs font-semibold text-accent uppercase tracking-wider flex items-center gap-2">
          <Trophy size={13} />
          Challenge {currentIdx + 1} of {total}
        </div>

        {/* Dot indicators */}
        <div className="flex items-center gap-1.5">
          {statuses.map((s, i) => (
            <span key={i}>
              {s === "pass" ? (
                <CheckCircle2 size={13} className="text-emerald-400" />
              ) : s === "fail" ? (
                <XCircle size={13} className="text-red-400" />
              ) : (
                <Circle
                  size={13}
                  className={
                    i === currentIdx ? "text-accent" : "text-zinc-600"
                  }
                />
              )}
            </span>
          ))}
        </div>
      </div>

      {/* Question text */}
      <p className="text-[13px] text-zinc-300 leading-relaxed">
        {current.question}
      </p>

      {/* Hint (optional) */}
      {current.hint && (
        <p className="text-[11px] text-zinc-500 font-mono">{current.hint}</p>
      )}

      {/* Result feedback */}
      {isFinished && (
        <div className="text-xs font-semibold mt-1">
          {currentStatus === "pass" ? (
            <span className="text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 size={13} /> Challenge passed! 🎉
            </span>
          ) : currentStatus === "fail" ? (
            <span className="text-amber-400 flex items-center gap-1.5">
              <XCircle size={13} /> Not quite — re-read the hint and try again.
            </span>
          ) : null}
        </div>
      )}

      {/* Navigation */}
      {total > 1 && (
        <div className="flex justify-between mt-1 pt-2 border-t border-border/40">
          <button
            onClick={onPrev}
            disabled={currentIdx === 0}
            className="flex items-center gap-1 text-[11px] text-zinc-500 hover:text-zinc-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft size={13} /> Prev
          </button>
          <button
            onClick={onNext}
            disabled={currentIdx === total - 1}
            className="flex items-center gap-1 text-[11px] text-zinc-500 hover:text-zinc-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            Next <ChevronRight size={13} />
          </button>
        </div>
      )}
    </div>
  );
}
