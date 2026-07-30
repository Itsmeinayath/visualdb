import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Table from "../../components/Table";
import Query from "../../components/Query";
import ChallengePanel from "../../components/ChallengePanel";
import { CheckCircle2, XCircle, Terminal, Cpu, ArrowRight, Lightbulb, ChevronUp, BookOpen , Code as CodeIcon, Book as BookIcon } from "lucide-react";
import ModuleLayout from "../../components/ModuleLayout";
import { useExecutionEngine } from "../../hooks/useExecutionEngine";
import { useChallenges } from "../../hooks/useChallenges";

const CHALLENGES = [
  {
    id: "where-gpa",
    question: (<>Modify the query to retrieve all students whose <code className="text-pink-400 text-xs">gpa</code> is greater than 3.5.</>),
    hint: "WHERE gpa > 3.5",
    validate: (rs) => rs.length === 3 && rs.every(r => r.gpa > 3.5),
  },
  {
    id: "where-age",
    question: (<>Filter the students table to find all students whose <code className="text-pink-400 text-xs">age</code> is exactly 22.</>),
    hint: "WHERE age = 22",
    validate: (rs) => rs.length > 0 && rs.every(r => r.age === 22),
  },
  {
    id: "where-major",
    question: (<>Retrieve all students whose <code className="text-pink-400 text-xs">major</code> is <code className="text-blue-400 text-xs">'CS'</code>.</>),
    hint: "WHERE major = 'CS'",
    validate: (rs) => rs.length > 0 && rs.every(r => r.major === 'CS'),
  },
];

export default function WhereModule() {
  const {
    queryInput,
    setQueryInput,
    isPlaying,
    isPaused,
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
    pauseQuery,
    stepQuery,
    speed,
    setSpeed,
    parseError,
    parsedAST,
  } = useExecutionEngine("SELECT *\nFROM students\nWHERE age > 20;");

  const challenges = useChallenges(CHALLENGES);

  useEffect(() => {
    if (isFinished && resultSetData.length > 0) {
      challenges.checkAnswer(resultSetData, parsedAST);
    } else if (!isFinished) {
      challenges.resetChallenge();
    }
  }, [isFinished, resultSetData]);

  const queryLines = [
    <span key="1"><span className="text-pink-500 font-semibold">SELECT</span> *</span>,
    <span key="2"><span className="text-pink-500 font-semibold">FROM</span> <span className="text-blue-400">students</span></span>,
    <span key="3"><span className="text-pink-500 font-semibold">WHERE</span> age <span className="text-orange-400">&gt; 20</span>;</span>,
  ];

  return (
    <ModuleLayout
      theoryContent={
        <>
<div className="p-5 flex flex-col gap-6">
          <header className="flex flex-col gap-2">
            <span className="bg-amber-400/10 text-amber-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-400/20 self-start">Step 2 · Beginner</span>
            <h1 className="text-3xl font-bold tracking-tight">The WHERE Clause</h1>
            <p className="text-muted-foreground text-sm leading-relaxed">
              The <code className="mx-1 px-1.5 py-0.5 rounded bg-muted text-foreground border border-border text-xs font-mono">WHERE</code> clause is a filter. The engine checks your condition against <strong>every single row</strong> in the table. Rows that pass go into the Result Set. Rows that fail are discarded.
            </p>
          </header>

          <div className="flex flex-col gap-3">
            <div className="panel p-4 bg-zinc-900/50">
              <h3 className="font-semibold text-sm text-zinc-300 mb-2">The Concept</h3>
              <p className="text-xs text-zinc-400 leading-relaxed mb-2">
                Think of <code className="text-pink-400 text-xs">WHERE</code> like a bouncer at a door checking IDs. The engine walks up to each row and asks: <em>"Does this row's age pass the condition age &gt; 20?"</em>
              </p>
              <p className="text-xs text-zinc-400 leading-relaxed">
                If the answer is <strong className="text-emerald-400">True</strong>, the row is allowed in. If it's <strong className="text-red-400">False</strong>, the row is skipped entirely.
              </p>
            </div>
            <div className="panel p-4 bg-zinc-900/50">
              <h3 className="font-semibold text-sm text-zinc-300 mb-2">Syntax Examples</h3>
              <div className="flex flex-col gap-2 font-mono text-[11px]">
                <div className="bg-zinc-950 p-2 rounded border border-border">
                  <span className="text-zinc-500 block text-[10px] mb-1">-- Filter by number comparison</span>
                  <span className="text-pink-500">SELECT</span> * <span className="text-pink-500">FROM</span> <span className="text-blue-400">students</span> <span className="text-pink-500">WHERE</span> age <span className="text-orange-400">&gt; 20</span>;
                </div>
                <div className="bg-zinc-950 p-2 rounded border border-border">
                  <span className="text-zinc-500 block text-[10px] mb-1">-- Filter by exact text match</span>
                  <span className="text-pink-500">SELECT</span> * <span className="text-pink-500">FROM</span> <span className="text-blue-400">students</span> <span className="text-pink-500">WHERE</span> major = <span className="text-green-400">'CS'</span>;
                </div>
              </div>
            </div>
          </div>

          <ChallengePanel
            current={challenges.current}
            currentIdx={challenges.currentIdx}
            total={challenges.total}
            currentStatus={challenges.currentStatus}
            statuses={challenges.statuses}
            isFinished={isFinished}
            onPrev={challenges.goPrev}
            onNext={challenges.goNext}
          />

          {isFinished && (
            <div className="panel p-4 bg-amber-400/5 border border-amber-400/20">
              <div className="flex items-start gap-3">
                <Lightbulb size={16} className="text-amber-400 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-semibold text-amber-300 text-sm mb-1">Key Takeaway</div>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    The engine scanned all <strong className="text-zinc-200">{tableData.length} rows</strong> one by one and evaluated the condition on each. Only <strong className="text-zinc-200">{resultSetData.length} rows</strong> had an age greater than 20. The rest were discarded completely.
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between pt-3 border-t border-zinc-800 mt-1">
            <Link to="/select" className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors flex items-center gap-1">
              ← SELECT
            </Link>
            <Link
              to="/orderby"
              className="inline-flex items-center gap-2 px-4 py-2 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium transition-all hover:scale-[1.02] group"
            >
              Next: ORDER BY
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
        </>
      }
      editorContent={
        <>

        <div className="h-1/2 flex flex-col border-b border-border">
          <Query
            queryLines={queryLines}
            value={queryInput}
            onChange={setQueryInput}
            activeLineIndex={step === 0 ? 0 : step === 1 ? 1 : step >= 2 && step <= 4 ? 2 : -1}
            onRun={() => runQuery()}
            onReset={resetQuery}
            onPause={pauseQuery}
            onStep={stepQuery}
            isPlaying={isPlaying}
            isFinished={isFinished}
            isPaused={isPaused}
            speed={speed}
            onSpeedChange={setSpeed}
          />
        </div>

        {parseError ? (
          <div className="p-4 bg-red-500/5 text-red-400 text-xs font-mono">{parseError}</div>
        ) : (
          <div className="h-1/2 flex flex-col bg-zinc-950/50">
            <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2 px-4 py-3 border-b border-border bg-zinc-900/30">
              <Cpu size={14} /> Execution Trace
            </div>
            <div className="flex-1 p-4 font-mono text-xs gap-1.5 overflow-y-auto flex flex-col leading-relaxed">
              {step === -1 && <div className="text-zinc-500 pt-2">Ready. Click "Run" to watch the filter work.</div>}
              {step === 0 && <div className="text-zinc-300 animate-pulse">Reading your query...</div>}
              {step === 1 && <div className="text-zinc-300 animate-pulse">Found the <span className="text-blue-400">students</span> table.</div>}
              {step === 2 && <div className="text-zinc-300 animate-pulse">Getting ready to check each row...</div>}
              {step === 4 && currentRowIdx >= 0 && currentRowIdx < tableData.length && (
                <div className="flex flex-col gap-2 mt-2">
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
                          <><CheckCircle2 size={14} /> TRUE — row added</>
                        ) : (
                          <><XCircle size={14} /> FALSE — row skipped</>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
              {isFinished && (
                <div className="text-emerald-400 font-medium flex flex-col gap-1 mt-2">
                  <div className="flex items-center gap-2"><CheckCircle2 size={14} /> Filter complete!</div>
                  <div className="text-zinc-500 text-xs">{resultSetData.length} of {tableData.length} rows passed.</div>
                </div>
              )}
            </div>
          </div>
        )}
      </>
      }
      dataContent={
        <>
<div className="flex-1 flex flex-col min-h-[250px] shrink-0">
          <Table
            data={tableData}
            title={`Source table: ${activeTable}`}
            highlightedRows={step === 4 && checkingCondition ? [tableData[currentRowIdx]?.id || currentRowIdx] : []}
            highlightedColumns={step >= 2 ? ["age"] : []}
          />
        </div>
        <div className="flex-1 flex flex-col min-h-[250px] shrink-0">
          {resultSetData.length > 0 || isFinished ? (
            <Table data={resultSetData} title="Result Set (rows that passed)" highlightedColumns={step >= 2 ? ["age"] : []} />
          ) : (
            <div className="panel h-full w-full flex items-center justify-center text-zinc-500 font-mono text-xs border-dashed border-2">
              Rows that pass the WHERE condition will appear here
            </div>
          )}
        </div>
        </>
      }
    />  );
}
