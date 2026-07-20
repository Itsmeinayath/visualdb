import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Table from "../../components/Table";
import Query from "../../components/Query";
import { CheckCircle2, Cpu, Scissors, ArrowRight, Lightbulb, Trophy } from "lucide-react";
import { useExecutionEngine } from "../../hooks/useExecutionEngine";

export default function LimitModule() {
  const {
    queryInput, setQueryInput,
    isPlaying, isFinished, step,
    activeTable, tableData, parsedAST,
    resultSetData, runQuery, resetQuery, parseError,
  } = useExecutionEngine("SELECT *\nFROM students\nORDER BY gpa DESC\nLIMIT 3;");

  const [challengeCompleted, setChallengeCompleted] = useState(false);

  useEffect(() => {
    if (isFinished && parsedAST && resultSetData.length > 0) {
      // Validate: single row, Diana Prince (highest GPA)
      const passed = resultSetData.length === 1 && resultSetData[0].name === "Diana Prince";
      setChallengeCompleted(passed);
    } else if (!isFinished) {
      setChallengeCompleted(false);
    }
  }, [isFinished, parsedAST, resultSetData]);

  const queryLines = [
    <span key="1"><span className="text-pink-500 font-semibold">SELECT</span> *</span>,
    <span key="2"><span className="text-pink-500 font-semibold">FROM</span> <span className="text-blue-400">students</span></span>,
    <span key="3"><span className="text-pink-500 font-semibold">ORDER BY</span> gpa <span className="text-pink-500 font-semibold">DESC</span></span>,
    <span key="4"><span className="text-pink-500 font-semibold">LIMIT</span> <span className="text-orange-400">3</span>;</span>,
  ];

  const limitVal = parsedAST?.limit?.value?.[0]?.value || 3;

  return (
    <div className="flex flex-col p-6 md:p-8 max-w-7xl mx-auto gap-8">

      <div className="flex flex-col gap-4">
        <span className="bg-emerald-400/10 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-400/20 self-start">Step 4 · Beginner</span>
        <header>
          <h1 className="text-3xl font-bold mb-3 tracking-tight">The LIMIT Clause</h1>
          <p className="text-muted-foreground text-base max-w-3xl leading-relaxed">
            The <code className="mx-1 px-1.5 py-0.5 rounded bg-muted text-foreground border border-border text-sm font-mono">LIMIT</code> clause caps the number of rows the engine is allowed to return. It runs at the very end of the execution pipeline — after all filtering and sorting — and simply cuts off any extra rows.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="panel p-5 bg-zinc-900/50">
            <h3 className="font-semibold text-sm text-zinc-300 mb-3">The Concept</h3>
            <p className="text-sm text-zinc-400 leading-relaxed mb-3">
              Without <code className="text-pink-400 text-xs">LIMIT</code>, a database with a million rows would try to send you all one million. That would be incredibly slow and would crash most apps.
            </p>
            <p className="text-sm text-zinc-400 leading-relaxed">
              <code className="text-pink-400 text-xs">LIMIT</code> is like a pair of scissors — it slices off the top N rows and discards everything below. It's almost always paired with <code className="text-pink-400 text-xs">ORDER BY</code> to make a "Top N" list.
            </p>
          </div>
          <div className="panel p-5 bg-zinc-900/50">
            <h3 className="font-semibold text-sm text-zinc-300 mb-3">Syntax Examples</h3>
            <div className="flex flex-col gap-3 font-mono text-[13px]">
              <div className="bg-zinc-950 p-3 rounded border border-border">
                <span className="text-zinc-500 block text-xs mb-1">-- Get only the first 5 rows</span>
                <span className="text-pink-500">SELECT</span> * <span className="text-pink-500">FROM</span> <span className="text-blue-400">students</span> <span className="text-pink-500">LIMIT</span> <span className="text-orange-400">5</span>;
              </div>
              <div className="bg-zinc-950 p-3 rounded border border-border">
                <span className="text-zinc-500 block text-xs mb-1">-- Get the top 3 students by GPA</span>
                <span className="text-pink-500">SELECT</span> * <span className="text-pink-500">FROM</span> <span className="text-blue-400">students</span> <span className="text-pink-500">ORDER BY</span> gpa <span className="text-pink-500">DESC</span> <span className="text-pink-500">LIMIT</span> <span className="text-orange-400">3</span>;
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="h-px w-full bg-border" />
      <div className="flex items-center gap-2 -mb-4">
        <h2 className="text-lg font-bold">Live Execution Trace</h2>
        <span className="px-2 py-0.5 rounded-full bg-accent/10 text-accent text-xs font-semibold">Interactive — try changing the LIMIT number!</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 min-h-[600px]">
        <div className="col-span-1 lg:col-span-4 flex flex-col gap-6">
          <div className="panel p-4 bg-accent/5 border border-accent/20 flex flex-col gap-2">
            <div className="text-xs font-semibold text-accent uppercase tracking-wider flex items-center gap-2">
              <Trophy size={14} /> Challenge Goal
            </div>
            <p className="text-[13px] text-zinc-300">
              Modify the query to retrieve the single student with the highest GPA (hint: combine <code className="text-pink-400 text-xs">ORDER BY gpa DESC</code> and <code className="text-pink-400 text-xs">LIMIT 1</code>).
            </p>
            {isFinished && (
              <div className="mt-1 text-xs font-semibold">
                {challengeCompleted ? (
                  <span className="text-emerald-400 flex items-center gap-1">🎉 Challenge Passed! You got it right!</span>
                ) : (
                  <span className="text-amber-400 flex items-center gap-1">Try again! Make sure you sort gpa DESC and LIMIT is 1.</span>
                )}
              </div>
            )}
          </div>
          <div className="h-56 shrink-0">
            <Query
              queryLines={queryLines}
              value={queryInput}
              onChange={setQueryInput}
              activeLineIndex={step === 0 ? 0 : step === 1 ? 1 : step >= 2 && step <= 4 ? 2 : step === 5 ? 3 : -1}
              onRun={() => runQuery()}
              onReset={resetQuery}
              isPlaying={isPlaying}
              isFinished={isFinished}
            />
          </div>
          {parseError && <div className="panel p-3 border-red-500/30 bg-red-500/5 text-red-400 text-xs font-mono">{parseError}</div>}
          <div className="panel p-4 flex flex-col gap-4">
            <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2 border-b border-border pb-2">
              <Cpu size={14} /> What's happening
            </div>
            <div className="h-32 flex flex-col justify-start font-mono text-[13px] gap-1">
              {step === -1 && <div className="text-zinc-500 text-center pt-4">Ready.</div>}
              {step === 0 && <div className="text-zinc-300 animate-pulse">Reading your query...</div>}
              {step === 1 && <div className="text-zinc-300 animate-pulse">Found the <span className="text-blue-400">students</span> table.</div>}
              {step === 2 && <div className="text-zinc-300 animate-pulse">All rows loaded. Sorting by gpa...</div>}
              {step === 4 && <div className="text-zinc-300 animate-pulse">Rows are sorted. Applying LIMIT...</div>}
              {step === 5 && (
                <div className="flex flex-col gap-3">
                  <div className="text-accent flex items-center gap-2 animate-pulse">
                    <div className="w-3 h-3 rounded-full border border-accent border-t-transparent animate-spin" />
                    Cutting result to {limitVal} rows...
                  </div>
                  <div className="bg-zinc-900 border border-zinc-800 p-3 rounded text-xs text-zinc-500">
                    <Scissors size={12} className="inline mr-1 text-accent" />
                    Discarding all rows below row #{limitVal}
                  </div>
                </div>
              )}
              {isFinished && (
                <div className="text-emerald-400 font-medium flex flex-col gap-1">
                  <div className="flex items-center gap-2"><CheckCircle2 size={16} /> Done!</div>
                  <div className="text-zinc-500 text-xs">Returned top {resultSetData.length} rows only.</div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="col-span-1 lg:col-span-8 flex flex-col gap-6 overflow-hidden">
          <div className="flex-1 overflow-hidden min-h-[220px]">
            <Table data={tableData} title={`Source table: ${activeTable} (all rows)`} />
          </div>
          <div className="flex-1 overflow-hidden min-h-[220px]">
            {resultSetData.length > 0 || isFinished ? (
              <Table data={resultSetData} title={isFinished ? `Final Result Set (top ${resultSetData.length} rows only)` : "Intermediate: Sorted by GPA DESC"} />
            ) : (
              <div className="panel h-full w-full flex items-center justify-center text-zinc-500 font-mono text-sm border-dashed border-2">
                Top N rows will appear here after sorting + limiting
              </div>
            )}
          </div>
        </div>
      </div>

      {isFinished && (
        <div className="panel p-5 bg-amber-400/5 border border-amber-400/20">
          <div className="flex items-start gap-3">
            <Lightbulb size={18} className="text-amber-400 mt-0.5 flex-shrink-0" />
            <div>
              <div className="font-semibold text-amber-300 mb-1">Key Takeaway</div>
              <p className="text-sm text-zinc-400 leading-relaxed">
                LIMIT is the very <strong className="text-zinc-200">last step</strong> in the pipeline. First the engine sorts all rows by GPA (highest first), then it cuts the list at {limitVal}. That's why ORDER BY + LIMIT together is the standard "Top N" pattern used in every real-world application.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between pt-2 border-t border-zinc-800">
        <Link to="/orderby" className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors">← ORDER BY</Link>
        <Link to="/groupby" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-sm font-medium transition-all hover:scale-[1.02] group">
          Next: GROUP BY <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
