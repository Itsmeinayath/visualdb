import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Table from "../../components/Table";
import Query from "../../components/Query";
import { CheckCircle2, Cpu, Layers, ArrowRight, Lightbulb, Trophy } from "lucide-react";
import { useExecutionEngine } from "../../hooks/useExecutionEngine";

export default function DistinctModule() {
  const {
    queryInput, setQueryInput,
    isPlaying, isFinished, step,
    activeTable, tableData, parsedAST,
    resultSetData, runQuery, resetQuery, parseError,
  } = useExecutionEngine("SELECT major\nFROM students;");

  const [challengeCompleted, setChallengeCompleted] = useState(false);

  useEffect(() => {
    if (isFinished && parsedAST && resultSetData.length > 0) {
      const keys = Object.keys(resultSetData[0]);
      const isDistinct = parsedAST.distinct === 'DISTINCT';
      const hasMajor = keys.length === 1 && keys[0] === 'major';
      const has4Rows = resultSetData.length === 4;
      setChallengeCompleted(isDistinct && hasMajor && has4Rows);
    } else if (!isFinished) {
      setChallengeCompleted(false);
    }
  }, [isFinished, parsedAST, resultSetData]);

  const queryLines = [
    <span key="1"><span className="text-pink-500 font-semibold">SELECT</span> major</span>,
    <span key="2"><span className="text-pink-500 font-semibold">FROM</span> <span className="text-blue-400">students</span>;</span>,
  ];

  return (
    <div className="flex flex-col p-6 md:p-8 max-w-7xl mx-auto gap-8">

      <div className="flex flex-col gap-4">
        <span className="bg-amber-400/10 text-amber-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-400/20 self-start">Step 9 · Intermediate</span>
        <header>
          <h1 className="text-3xl font-bold mb-3 tracking-tight">The DISTINCT Keyword</h1>
          <p className="text-muted-foreground text-base max-w-3xl leading-relaxed">
            The <code className="mx-1 px-1.5 py-0.5 rounded bg-muted text-foreground border border-border text-sm font-mono">DISTINCT</code> keyword is used inside the <code className="text-pink-400 text-xs">SELECT</code> clause to eliminate duplicate rows from your results. It guarantees that every row returned in the final result set is completely unique.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="panel p-5 bg-zinc-900/50">
            <h3 className="font-semibold text-sm text-zinc-300 mb-3">The Concept</h3>
            <p className="text-sm text-zinc-400 leading-relaxed mb-3">
              When a database engine evaluates a query with <code className="text-pink-400 text-xs">DISTINCT</code>, it processes each row and compares it against an internal **Deduplication Buffer** (often a Hash Set) in memory.
            </p>
            <p className="text-sm text-zinc-400 leading-relaxed">
              If the projected values of a row have already been seen in the buffer, the row is discarded. If they are new, they are added to both the buffer and the final Result Set.
            </p>
          </div>
          <div className="panel p-5 bg-zinc-900/50">
            <h3 className="font-semibold text-sm text-zinc-300 mb-3">Syntax Examples</h3>
            <div className="flex flex-col gap-3 font-mono text-[13px]">
              <div className="bg-zinc-950 p-3 rounded border border-border">
                <span className="text-zinc-500 block text-xs mb-1">-- Find all unique major names</span>
                <span className="text-pink-500">SELECT DISTINCT</span> major <span className="text-pink-500">FROM</span> <span className="text-blue-400">students</span>;
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="h-px w-full bg-border" />
      <div className="flex items-center gap-2 -mb-4">
        <h2 className="text-lg font-bold">Live Execution Trace</h2>
        <span className="px-2 py-0.5 rounded-full bg-accent/10 text-accent text-xs font-semibold">Interactive — try DISTINCT!</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 min-h-[600px]">
        <div className="col-span-1 lg:col-span-4 flex flex-col gap-6">
          <div className="panel p-4 bg-accent/5 border border-accent/20 flex flex-col gap-2">
            <div className="text-xs font-semibold text-accent uppercase tracking-wider flex items-center gap-2">
              <Trophy size={14} /> Challenge Goal
            </div>
            <p className="text-[13px] text-zinc-300">
              Modify the query to return only the **unique** major names from the students table (hint: insert the <code className="text-pink-400 text-xs">DISTINCT</code> keyword).
            </p>
            {isFinished && (
              <div className="mt-1 text-xs font-semibold">
                {challengeCompleted ? (
                  <span className="text-emerald-400 flex items-center gap-1">🎉 Challenge Passed! You got it right!</span>
                ) : (
                  <span className="text-amber-400 flex items-center gap-1">Try again! Make sure to add DISTINCT before major.</span>
                )}
              </div>
            )}
          </div>
          <div className="h-52 shrink-0">
            <Query
              queryLines={queryLines}
              value={queryInput}
              onChange={setQueryInput}
              activeLineIndex={step === 0 ? 0 : step === 1 ? 1 : step >= 2 && step <= 4 ? 0 : -1}
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
              {step === -1 && <div className="text-zinc-500 text-center pt-4">Ready.</div>}
              {step === 0 && <div className="text-zinc-300 animate-pulse">Reading query...</div>}
              {step === 1 && <div className="text-zinc-300 animate-pulse">Scanning the <span className="text-blue-400">students</span> table...</div>}
              {step >= 2 && step <= 4 && <div className="text-zinc-300 animate-pulse">Loading rows into memory...</div>}
              {step === 7 && parsedAST.distinct === 'DISTINCT' && (
                <div className="flex flex-col gap-3">
                  <div className="text-accent flex items-center gap-2 animate-pulse">
                    <div className="w-3 h-3 rounded-full border border-accent border-t-transparent animate-spin" />
                    Deduplicating rows...
                  </div>
                  <div className="bg-zinc-900 border border-zinc-800 p-3 rounded">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-300">
                      <Layers size={14} className="text-accent" /> Comparing keys in Deduplication Buffer...
                    </div>
                  </div>
                </div>
              )}
              {isFinished && (
                <div className="text-emerald-400 font-medium flex flex-col gap-1">
                  <div className="flex items-center gap-2"><CheckCircle2 size={16} /> Query execution complete!</div>
                  <div className="text-zinc-500 text-xs">Returned {resultSetData.length} unique rows.</div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="col-span-1 lg:col-span-8 flex flex-col gap-6 overflow-hidden">
          <div className="flex-1 overflow-hidden min-h-[220px]">
            <Table data={tableData} title={`Source table: ${activeTable}`} highlightedColumns={["major"]} />
          </div>
          <div className="flex-1 overflow-hidden min-h-[220px]">
            {resultSetData.length > 0 || isFinished ? (
              <Table data={resultSetData} title="Result Set" highlightedColumns={["major"]} />
            ) : (
              <div className="panel h-full w-full flex items-center justify-center text-zinc-500 font-mono text-sm border-dashed border-2">
                Unique rows will appear here
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
                Notice that the original students table has 5 rows (2 with 'Computer Science'). When using <code className="text-pink-400 text-xs">DISTINCT</code>, the duplicates are removed, returning only 4 rows. If you write the query without `DISTINCT`, all 5 rows are returned.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between pt-2 border-t border-zinc-800">
        <Link to="/leftjoin" className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors">← LEFT JOIN</Link>
        <Link to="/playground" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-accent hover:bg-accent/90 text-white text-sm font-medium transition-all hover:scale-[1.02] group">
          Go to Playground <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
