import { Link } from "react-router-dom";
import Table from "../../components/Table";
import Query from "../../components/Query";
import { CheckCircle2, XCircle, Terminal, Cpu, ArrowRight, Lightbulb } from "lucide-react";
import { useExecutionEngine } from "../../hooks/useExecutionEngine";

export default function WhereModule() {
  const {
    queryInput,
    setQueryInput,
    isPlaying,
    isFinished,
    step,
    currentRowIdx,
    activeTable,
    tableData,
    highlightedRows,
    checkingCondition,
    resultSetData,
    runQuery,
    resetQuery,
    parseError,
  } = useExecutionEngine("SELECT *\nFROM students\nWHERE age > 20;");

  const queryLines = [
    <span key="1"><span className="text-pink-500 font-semibold">SELECT</span> *</span>,
    <span key="2"><span className="text-pink-500 font-semibold">FROM</span> <span className="text-blue-400">students</span></span>,
    <span key="3"><span className="text-pink-500 font-semibold">WHERE</span> age <span className="text-orange-400">&gt; 20</span>;</span>,
  ];

  return (
    <div className="flex flex-col p-6 md:p-8 max-w-7xl mx-auto gap-8">

      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <span className="bg-emerald-400/10 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-400/20">Step 2 · Beginner</span>
        </div>
        <header>
          <h1 className="text-3xl font-bold mb-3 tracking-tight">The WHERE Clause</h1>
          <p className="text-muted-foreground text-base max-w-3xl leading-relaxed">
            The <code className="mx-1 px-1.5 py-0.5 rounded bg-muted text-foreground border border-border text-sm font-mono">WHERE</code> clause is a filter. The engine checks your condition against <strong>every single row</strong> in the table. Rows that pass go into the Result Set. Rows that fail are discarded.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="panel p-5 bg-zinc-900/50">
            <h3 className="font-semibold text-sm text-zinc-300 mb-3">The Concept</h3>
            <p className="text-sm text-zinc-400 leading-relaxed mb-3">
              Think of <code className="text-pink-400 text-xs">WHERE</code> like a bouncer at a door checking IDs. The engine walks up to each row and asks: <em>"Does this row's age pass the condition age &gt; 20?"</em>
            </p>
            <p className="text-sm text-zinc-400 leading-relaxed">
              If the answer is <strong className="text-emerald-400">True</strong>, the row is allowed in. If it's <strong className="text-red-400">False</strong>, the row is skipped entirely.
            </p>
          </div>
          <div className="panel p-5 bg-zinc-900/50">
            <h3 className="font-semibold text-sm text-zinc-300 mb-3">Syntax Examples</h3>
            <div className="flex flex-col gap-3 font-mono text-[13px]">
              <div className="bg-zinc-950 p-3 rounded border border-border">
                <span className="text-zinc-500 block text-xs mb-1">-- Filter by number comparison</span>
                <span className="text-pink-500">SELECT</span> * <span className="text-pink-500">FROM</span> <span className="text-blue-400">students</span> <span className="text-pink-500">WHERE</span> age <span className="text-orange-400">&gt; 20</span>;
              </div>
              <div className="bg-zinc-950 p-3 rounded border border-border">
                <span className="text-zinc-500 block text-xs mb-1">-- Filter by exact text match</span>
                <span className="text-pink-500">SELECT</span> * <span className="text-pink-500">FROM</span> <span className="text-blue-400">students</span> <span className="text-pink-500">WHERE</span> major = <span className="text-green-400">'CS'</span>;
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="h-px w-full bg-border" />
      <div className="flex items-center gap-2 -mb-4">
        <h2 className="text-lg font-bold">Live Execution Trace</h2>
        <span className="px-2 py-0.5 rounded-full bg-accent/10 text-accent text-xs font-semibold">Interactive — try editing the query!</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 min-h-[600px]">
        <div className="col-span-1 lg:col-span-4 flex flex-col gap-6">
          <div className="h-52 shrink-0">
            <Query
              queryLines={queryLines}
              value={queryInput}
              onChange={setQueryInput}
              activeLineIndex={step === 0 ? 0 : step === 1 ? 1 : step >= 2 && step <= 4 ? 2 : -1}
              onRun={() => runQuery()}
              onReset={resetQuery}
              isPlaying={isPlaying}
              isFinished={isFinished}
            />
          </div>
          {parseError && (
            <div className="panel p-3 border-red-500/30 bg-red-500/5 text-red-400 text-xs font-mono">{parseError}</div>
          )}
          <div className="panel p-4 flex flex-col gap-4">
            <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2 border-b border-border pb-2">
              <Cpu size={14} /> What's happening
            </div>
            <div className="h-44 flex flex-col justify-start font-mono text-[13px] gap-1 overflow-y-auto">
              {step === -1 && <div className="text-zinc-500 text-center pt-8">Ready. Click "Run Query" to watch the filter work.</div>}
              {step === 0 && <div className="text-zinc-300 animate-pulse">Reading your query...</div>}
              {step === 1 && <div className="text-zinc-300 animate-pulse">Found the <span className="text-blue-400">students</span> table.</div>}
              {step === 2 && <div className="text-zinc-300 animate-pulse">Getting ready to check each row...</div>}
              {step === 4 && currentRowIdx >= 0 && currentRowIdx < tableData.length && (
                <div className="flex flex-col gap-3">
                  <div className="text-zinc-400">
                    Checking Row <span className="text-zinc-200 font-semibold">#{currentRowIdx + 1}</span>: {tableData[currentRowIdx]?.name}
                  </div>
                  <div className="bg-zinc-900 border border-zinc-800 p-3 rounded">
                    <div className="flex justify-between mb-2 text-xs">
                      <span className="text-zinc-500">age value:</span>
                      <span className="text-zinc-200 font-bold">{tableData[currentRowIdx].age}</span>
                    </div>
                    {checkingCondition ? (
                      <div className="flex items-center gap-2 text-accent text-xs animate-pulse">
                        <div className="w-3 h-3 rounded-full border border-accent border-t-transparent animate-spin" />
                        Is {tableData[currentRowIdx].age} &gt; 20?
                      </div>
                    ) : (
                      <div className={`flex items-center gap-1.5 text-xs font-semibold ${tableData[currentRowIdx].age > 20 ? 'text-emerald-400' : 'text-red-400'}`}>
                        {tableData[currentRowIdx].age > 20 ? (
                          <><CheckCircle2 size={14} /> TRUE — row added to results</>
                        ) : (
                          <><XCircle size={14} /> FALSE — row skipped</>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
              {isFinished && (
                <div className="text-emerald-400 font-medium flex flex-col gap-1">
                  <div className="flex items-center gap-2"><CheckCircle2 size={16} /> Filter complete!</div>
                  <div className="text-zinc-500 text-xs">{resultSetData.length} of {tableData.length} rows passed.</div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="col-span-1 lg:col-span-8 flex flex-col gap-6 overflow-hidden">
          <div className="flex-1 overflow-hidden min-h-[220px]">
            <Table
              data={tableData}
              title={`Source table: ${activeTable}`}
              highlightedRows={step === 4 && checkingCondition ? [tableData[currentRowIdx]?.id || currentRowIdx] : []}
              highlightedColumns={step >= 2 ? ["age"] : []}
            />
          </div>
          <div className="flex-1 overflow-hidden min-h-[220px]">
            {resultSetData.length > 0 || isFinished ? (
              <Table data={resultSetData} title="Result Set (rows that passed the filter)" highlightedColumns={step >= 2 ? ["age"] : []} />
            ) : (
              <div className="panel h-full w-full flex items-center justify-center text-zinc-500 font-mono text-sm border-dashed border-2">
                Rows that pass the WHERE condition will appear here
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
                The engine scanned all <strong className="text-zinc-200">{tableData.length} rows</strong> one by one and evaluated the condition on each. Only <strong className="text-zinc-200">{resultSetData.length} rows</strong> had an age greater than 20. The rest were discarded completely — they never appear in the output. This is how WHERE filters work in every real database.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between pt-2 border-t border-zinc-800">
        <Link to="/select" className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors flex items-center gap-1">
          ← SELECT
        </Link>
        <Link
          to="/orderby"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-sm font-medium transition-all hover:scale-[1.02] group"
        >
          Next: ORDER BY
          <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
