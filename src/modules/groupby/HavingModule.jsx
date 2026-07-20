import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Table from "../../components/Table";
import Query from "../../components/Query";
import { CheckCircle2, Cpu, FolderTree, ArrowRight, Lightbulb, Trophy } from "lucide-react";
import { useExecutionEngine } from "../../hooks/useExecutionEngine";

export default function HavingModule() {
  const {
    queryInput, setQueryInput,
    isPlaying, isFinished, step,
    activeTable, tableData, parsedAST,
    resultSetData, runQuery, resetQuery, parseError,
  } = useExecutionEngine("SELECT major, COUNT(*)\nFROM students\nGROUP BY major\nHAVING COUNT(*) > 1;");

  const [challengeCompleted, setChallengeCompleted] = useState(false);

  useEffect(() => {
    if (isFinished && parsedAST && resultSetData.length > 0) {
      // Validate: major that has exactly 1 student. Results should have 3 rows (Math, Physics, History).
      const passed = resultSetData.length === 3 && !resultSetData.some(r => r.major === "Computer Science");
      setChallengeCompleted(passed);
    } else if (!isFinished) {
      setChallengeCompleted(false);
    }
  }, [isFinished, parsedAST, resultSetData]);

  const queryLines = [
    <span key="1"><span className="text-pink-500 font-semibold">SELECT</span> major, <span className="text-pink-500 font-semibold">COUNT</span>(*)</span>,
    <span key="2"><span className="text-pink-500 font-semibold">FROM</span> <span className="text-blue-400">students</span></span>,
    <span key="3"><span className="text-pink-500 font-semibold">GROUP BY</span> major</span>,
    <span key="4"><span className="text-pink-500 font-semibold">HAVING</span> <span className="text-pink-500 font-semibold">COUNT</span>(*) &gt; <span className="text-orange-400">1</span>;</span>,
  ];

  return (
    <div className="flex flex-col p-6 md:p-8 max-w-7xl mx-auto gap-8">

      <div className="flex flex-col gap-4">
        <span className="bg-amber-400/10 text-amber-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-400/20 self-start">Step 6 · Intermediate</span>
        <header>
          <h1 className="text-3xl font-bold mb-3 tracking-tight">The HAVING Clause</h1>
          <p className="text-muted-foreground text-base max-w-3xl leading-relaxed">
            The <code className="mx-1 px-1.5 py-0.5 rounded bg-muted text-foreground border border-border text-sm font-mono">HAVING</code> clause is used to filter <strong>groups/buckets</strong> of data. It serves the exact same purpose as the <code className="text-pink-400 text-xs">WHERE</code> clause, but operates on aggregated data <strong>after</strong> the <code className="text-pink-400 text-xs">GROUP BY</code> phase has completed.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="panel p-5 bg-zinc-900/50">
            <h3 className="font-semibold text-sm text-zinc-300 mb-3">WHERE vs HAVING</h3>
            <p className="text-sm text-zinc-400 leading-relaxed mb-3">
              You <strong>cannot</strong> use <code className="text-pink-400 text-xs">WHERE COUNT(*) &gt; 1</code>. Why? Because the <code className="text-pink-400 text-xs">WHERE</code> clause filters individual raw rows <strong>before</strong> they are grouped.
            </p>
            <p className="text-sm text-zinc-400 leading-relaxed">
              The <code className="text-pink-400 text-xs">HAVING</code> clause, on the other hand, runs <strong>after</strong> rows have been collapsed into buckets, letting you filter groups based on aggregate calculations like `COUNT`, `SUM`, or `MAX`.
            </p>
          </div>
          <div className="panel p-5 bg-zinc-900/50">
            <h3 className="font-semibold text-sm text-zinc-300 mb-3">Syntax Examples</h3>
            <div className="flex flex-col gap-3 font-mono text-[13px]">
              <div className="bg-zinc-950 p-3 rounded border border-border">
                <span className="text-zinc-500 block text-xs mb-1">-- Keep only majors with multiple students</span>
                <span className="text-pink-500">SELECT</span> major, <span className="text-pink-500">COUNT</span>(*)<br/>
                <span className="text-pink-500">FROM</span> students <span className="text-pink-500">GROUP BY</span> major <span className="text-pink-500">HAVING</span> <span className="text-pink-500">COUNT</span>(*) &gt; 1;
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="h-px w-full bg-border" />
      <div className="flex items-center gap-2 -mb-4">
        <h2 className="text-lg font-bold">Live Execution Trace</h2>
        <span className="px-2 py-0.5 rounded-full bg-accent/10 text-accent text-xs font-semibold">Interactive — try HAVING COUNT(*) = 1</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 min-h-[600px]">
        <div className="col-span-1 lg:col-span-4 flex flex-col gap-6">
          <div className="panel p-4 bg-accent/5 border border-accent/20 flex flex-col gap-2">
            <div className="text-xs font-semibold text-accent uppercase tracking-wider flex items-center gap-2">
              <Trophy size={14} /> Challenge Goal
            </div>
            <p className="text-[13px] text-zinc-300">
              Modify the query to retrieve only the majors that have exactly 1 student (hint: change the HAVING filter to <code className="text-pink-400 text-xs">COUNT(*) = 1</code>).
            </p>
            {isFinished && (
              <div className="mt-1 text-xs font-semibold">
                {challengeCompleted ? (
                  <span className="text-emerald-400 flex items-center gap-1">🎉 Challenge Passed! You got it right!</span>
                ) : (
                  <span className="text-amber-400 flex items-center gap-1">Try again! Make sure you filter HAVING COUNT(*) = 1.</span>
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
            <div className="h-36 flex flex-col justify-start font-mono text-[13px] gap-1">
              {step === -1 && <div className="text-zinc-500 text-center pt-4">Ready. Click Run Query to start.</div>}
              {step === 0 && <div className="text-zinc-300 animate-pulse">Reading query...</div>}
              {step === 1 && <div className="text-zinc-300 animate-pulse">Scanning the <span className="text-blue-400">students</span> table...</div>}
              {step >= 2 && step <= 4 && <div className="text-zinc-300 animate-pulse">Aggregating rows into buckets by major...</div>}
              {step === 5 && (
                <div className="flex flex-col gap-3">
                  <div className="text-accent flex items-center gap-2 animate-pulse">
                    <div className="w-3 h-3 rounded-full border border-accent border-t-transparent animate-spin" />
                    Applying HAVING Filter
                  </div>
                  <div className="bg-zinc-900 border border-zinc-800 p-3 rounded">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-300">
                      <FolderTree size={14} className="text-accent" /> Evaluating: COUNT(*) &gt; 1
                    </div>
                    <div className="text-zinc-500 text-[11px] mt-1">Discarding groups where number of rows is 1 or less...</div>
                  </div>
                </div>
              )}
              {isFinished && (
                <div className="text-emerald-400 font-medium flex flex-col gap-1">
                  <div className="flex items-center gap-2"><CheckCircle2 size={16} /> Filter complete!</div>
                  <div className="text-zinc-500 text-xs">Only CS passed because it has 2 students.</div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="col-span-1 lg:col-span-8 flex flex-col gap-6 overflow-hidden">
          <div className="flex-1 overflow-hidden min-h-[220px]">
            <Table data={tableData} title={`Source table: ${activeTable}`} highlightedColumns={step >= 5 ? ["major"] : []} />
          </div>
          <div className="flex-1 overflow-hidden min-h-[220px]">
            {resultSetData.length > 0 || isFinished ? (
              <Table data={resultSetData} title="Result Set (only groups passing HAVING)" highlightedColumns={step >= 5 ? ["major", "COUNT(*)"] : []} />
            ) : (
              <div className="panel h-full w-full flex items-center justify-center text-zinc-500 font-mono text-sm border-dashed border-2">
                Awaiting group evaluation...
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
                Observe the output: only the <strong className="text-zinc-200">Computer Science</strong> group is returned. The Mathematics, Physics, and History groups each had only 1 student, so they failed the <code className="text-pink-400 text-xs">HAVING COUNT(*) &gt; 1</code> condition and were discarded. This is the exact way database groups are filtered!
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between pt-2 border-t border-zinc-800">
        <Link to="/groupby" className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors">← GROUP BY</Link>
        <Link to="/innerjoin" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-sm font-medium transition-all hover:scale-[1.02] group">
          Next: INNER JOIN <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
