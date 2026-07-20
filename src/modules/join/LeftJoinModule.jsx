import { Link } from "react-router-dom";
import Table from "../../components/Table";
import Query from "../../components/Query";
import { CheckCircle2, Cpu, Combine, ArrowRight, Lightbulb } from "lucide-react";
import { useExecutionEngine } from "../../hooks/useExecutionEngine";

export default function LeftJoinModule() {
  const {
    queryInput, setQueryInput,
    isPlaying, isFinished, step,
    activeTable, tableData, rightTableData,
    currentRowIdx, currentRightRowIdx,
    parsedAST, resultSetData, checkingCondition,
    runQuery, resetQuery, parseError,
  } = useExecutionEngine("SELECT *\nFROM students\nLEFT JOIN courses\n  ON students.course_id = courses.id;");

  const queryLines = [
    <span key="1"><span className="text-pink-500 font-semibold">SELECT</span> *</span>,
    <span key="2"><span className="text-pink-500 font-semibold">FROM</span> <span className="text-blue-400">students</span></span>,
    <span key="3"><span className="text-pink-500 font-semibold">LEFT JOIN</span> <span className="text-orange-400">courses</span></span>,
    <span key="4">  <span className="text-pink-500 font-semibold">ON</span> <span className="text-blue-400">students</span>.course_id = <span className="text-orange-400">courses</span>.id;</span>,
  ];

  return (
    <div className="flex flex-col p-6 md:p-8 max-w-7xl mx-auto gap-8">

      <div className="flex flex-col gap-4">
        <span className="bg-amber-400/10 text-amber-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-400/20 self-start">Step 7 · Intermediate</span>
        <header>
          <h1 className="text-3xl font-bold mb-3 tracking-tight">The LEFT JOIN</h1>
          <p className="text-muted-foreground text-base max-w-3xl leading-relaxed">
            <code className="mx-1 px-1.5 py-0.5 rounded bg-muted text-foreground border border-border text-sm font-mono">LEFT JOIN</code> is like INNER JOIN, but with a crucial guarantee: <strong>every row from the left table is always returned</strong> — even if there's no matching row in the right table. When no match is found, the right-side columns are filled with <code className="mx-1 px-1.5 py-0.5 rounded bg-muted text-red-400 border border-border text-sm font-mono">NULL</code>.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="panel p-5 bg-zinc-900/50">
            <h3 className="font-semibold text-sm text-zinc-300 mb-3">INNER JOIN vs LEFT JOIN</h3>
            <div className="flex flex-col gap-2 text-sm text-zinc-400">
              <div className="flex items-start gap-2">
                <span className="text-red-400 font-bold mt-0.5">✗</span>
                <span><strong className="text-zinc-300">INNER JOIN:</strong> A student with no matching course is completely excluded from the results.</span>
              </div>
              <div className="flex items-start gap-2 mt-1">
                <span className="text-emerald-400 font-bold mt-0.5">✓</span>
                <span><strong className="text-zinc-300">LEFT JOIN:</strong> A student with no matching course still appears in the results — their course columns are filled with <code className="text-red-400 text-xs">NULL</code>.</span>
              </div>
            </div>
          </div>
          <div className="panel p-5 bg-zinc-900/50">
            <h3 className="font-semibold text-sm text-zinc-300 mb-3">Real-world Use Case</h3>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Use LEFT JOIN when you want to see <strong>all records from one table</strong>, regardless of whether there are related records in another. Example: "Show me all students, and if they have a course, show that too. If not, that's fine."
            </p>
          </div>
        </div>
      </div>

      <div className="h-px w-full bg-border" />
      <div className="flex items-center gap-2 -mb-4">
        <h2 className="text-lg font-bold">Live Execution Trace</h2>
        <span className="px-2 py-0.5 rounded-full bg-accent/10 text-accent text-xs font-semibold">Watch for the NULL row!</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 min-h-[700px]">
        <div className="col-span-1 lg:col-span-4 flex flex-col gap-6">
          <div className="h-56 shrink-0">
            <Query
              queryLines={queryLines}
              value={queryInput}
              onChange={setQueryInput}
              activeLineIndex={step === 0 ? 0 : step === 1 ? 1 : step === 2 ? 2 : step === 4 ? 3 : -1}
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
            <div className="h-44 flex flex-col justify-start font-mono text-[13px] gap-1 overflow-y-auto">
              {step === -1 && <div className="text-zinc-500 text-center pt-4">Ready. Watch for Evan Wright's NULL row!</div>}
              {step === 0 && <div className="text-zinc-300 animate-pulse">Reading your query...</div>}
              {step === 1 && <div className="text-zinc-300 animate-pulse">Loaded left table: <span className="text-blue-400">students</span></div>}
              {step === 2 && <div className="text-zinc-300 animate-pulse">Loaded right table: <span className="text-orange-400">{parsedAST?.from?.[1]?.table}</span></div>}
              {step === 3 && <div className="text-zinc-300 animate-pulse">Starting Nested Loop with LEFT JOIN rules...</div>}
              {step === 4 && (
                <div className="flex flex-col gap-3">
                  <div className="text-accent flex items-center gap-2 animate-pulse">
                    <div className="w-3 h-3 rounded-full border border-accent border-t-transparent animate-spin" />
                    Comparing rows...
                  </div>
                  <div className="bg-zinc-900 border border-zinc-800 p-3 rounded">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-300 mb-2">
                      <Combine size={14} className="text-accent" /> Outer loop: student #{currentRowIdx + 1}
                    </div>
                    {checkingCondition && currentRightRowIdx >= 0 && (
                      <div className="text-zinc-500 text-[11px]">
                        Checking course #{currentRightRowIdx + 1}: Do course_ids match?
                      </div>
                    )}
                  </div>
                </div>
              )}
              {isFinished && (
                <div className="text-emerald-400 font-medium flex flex-col gap-1">
                  <div className="flex items-center gap-2"><CheckCircle2 size={16} /> Left Join complete!</div>
                  <div className="text-zinc-500 text-xs">{resultSetData.length} rows returned (including NULLs).</div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="col-span-1 lg:col-span-8 flex flex-col gap-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 h-[280px]">
            <Table
              data={tableData}
              title="Left: students (all included)"
              highlightedRows={currentRowIdx !== -1 ? [tableData[currentRowIdx]?.id || currentRowIdx] : []}
              highlightedColumns={["course_id"]}
            />
            <Table
              data={rightTableData}
              title="Right: courses"
              highlightedRows={currentRightRowIdx !== -1 ? [rightTableData[currentRightRowIdx]?.id || currentRightRowIdx] : []}
              highlightedColumns={["id"]}
            />
          </div>
          <div className="flex-1 min-h-[280px]">
            {resultSetData.length > 0 || isFinished ? (
              <Table data={resultSetData} title="Result Set — all students included, NULL where no course match" />
            ) : (
              <div className="panel h-full w-full flex items-center justify-center text-zinc-500 font-mono text-sm border-dashed border-2">
                Result rows appear here — including students with no matching course
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
                The LEFT JOIN returned <strong className="text-zinc-200">{resultSetData.length} rows</strong> — one per student. Notice "Evan Wright" appears in the result even though his <code className="text-pink-400 text-xs">course_id</code> doesn't match any course. His course columns all show <span className="text-red-400 font-mono text-xs">NULL</span>. The INNER JOIN would have silently dropped him. This distinction is critical in real-world database design.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between pt-2 border-t border-zinc-800">
        <Link to="/innerjoin" className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors">← INNER JOIN</Link>
        <Link to="/playground" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-accent hover:bg-accent/90 text-white text-sm font-medium transition-all hover:scale-[1.02] group">
          Go to Playground <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
