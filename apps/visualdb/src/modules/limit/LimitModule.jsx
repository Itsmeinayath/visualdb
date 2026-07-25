import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Table from "../../components/Table";
import Query from "../../components/Query";
import ChallengePanel from "../../components/ChallengePanel";
import { CheckCircle2, Cpu, Scissors, ArrowRight, Lightbulb, ChevronUp, BookOpen , Code as CodeIcon, Book as BookIcon } from "lucide-react";
import ModuleLayout from "../../components/ModuleLayout";
import { useExecutionEngine } from "../../hooks/useExecutionEngine";
import { useChallenges } from "../../hooks/useChallenges";

const CHALLENGES = [
  {
    id: "limit-top1",
    question: (<>Retrieve only the student with the highest GPA. Combine <code className="text-pink-400 text-xs">ORDER BY gpa DESC</code> and <code className="text-pink-400 text-xs">LIMIT 1</code>.</>),
    hint: "SELECT * FROM students ORDER BY gpa DESC LIMIT 1;",
    validate: (rs) => rs.length === 1 && rs[0].name === "Diana Prince",
  },
  {
    id: "limit-2rows",
    question: (<>Retrieve exactly <strong>2</strong> students sorted by <code className="text-pink-400 text-xs">age</code> youngest first.</>),
    hint: "SELECT * FROM students ORDER BY age ASC LIMIT 2;",
    validate: (rs) => rs.length === 2 && rs[0].age <= rs[1].age,
  },
  {
    id: "limit-no-order",
    question: (<>Use <code className="text-pink-400 text-xs">LIMIT 3</code> without any ORDER BY — just get the first 3 rows from students.</>),
    hint: "SELECT * FROM students LIMIT 3;",
    validate: (rs, ast) => rs.length === 3 && !ast?.orderby,
  },
];

export default function LimitModule() {
  const {
    queryInput, setQueryInput,
    isPlaying, isPaused, isFinished, step,
    activeTable, tableData, parsedAST,
    resultSetData, runQuery, resetQuery,
    pauseQuery, stepQuery, speed, setSpeed, parseError,
  } = useExecutionEngine("SELECT *\nFROM students\nORDER BY gpa DESC\nLIMIT 3;");

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
    <span key="3"><span className="text-pink-500 font-semibold">ORDER BY</span> gpa <span className="text-pink-500 font-semibold">DESC</span></span>,
    <span key="4"><span className="text-pink-500 font-semibold">LIMIT</span> <span className="text-orange-400">3</span>;</span>,
  ];

  const limitVal = parsedAST?.limit?.value?.[0]?.value || 3;

  return (
    <ModuleLayout
      theoryContent={
        <>
<div className="p-5 flex flex-col gap-6">
          <header className="flex flex-col gap-2">
            <span className="bg-emerald-400/10 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-400/20 self-start">Step 4 · Beginner</span>
            <h1 className="text-3xl font-bold tracking-tight">The LIMIT Clause</h1>
            <p className="text-muted-foreground text-sm leading-relaxed">
              The <code className="mx-1 px-1.5 py-0.5 rounded bg-muted text-foreground border border-border text-xs font-mono">LIMIT</code> clause caps the number of rows the engine is allowed to return. It runs at the very end of the execution pipeline — after all filtering and sorting — and simply cuts off any extra rows.
            </p>
          </header>

          <div className="flex flex-col gap-3">
            <div className="panel p-4 bg-zinc-900/50">
              <h3 className="font-semibold text-sm text-zinc-300 mb-2">The Concept</h3>
              <p className="text-xs text-zinc-400 leading-relaxed mb-2">
                Without <code className="text-pink-400 text-xs">LIMIT</code>, a database with a million rows would try to send you all one million. That would be incredibly slow and would crash most apps.
              </p>
              <p className="text-xs text-zinc-400 leading-relaxed">
                <code className="text-pink-400 text-xs">LIMIT</code> is like a pair of scissors — it slices off the top N rows and discards everything below. It's almost always paired with <code className="text-pink-400 text-xs">ORDER BY</code> to make a "Top N" list.
              </p>
            </div>
            <div className="panel p-4 bg-zinc-900/50">
              <h3 className="font-semibold text-sm text-zinc-300 mb-2">Syntax Examples</h3>
              <div className="flex flex-col gap-2 font-mono text-[11px]">
                <div className="bg-zinc-950 p-2 rounded border border-border">
                  <span className="text-zinc-500 block text-[10px] mb-1">-- Get only the first 5 rows</span>
                  <span className="text-pink-500">SELECT</span> * <span className="text-pink-500">FROM</span> <span className="text-blue-400">students</span> <span className="text-pink-500">LIMIT</span> <span className="text-orange-400">5</span>;
                </div>
                <div className="bg-zinc-950 p-2 rounded border border-border">
                  <span className="text-zinc-500 block text-[10px] mb-1">-- Get the top 3 students by GPA</span>
                  <span className="text-pink-500">SELECT</span> * <span className="text-pink-500">FROM</span> <span className="text-blue-400">students</span> <span className="text-pink-500">ORDER BY</span> gpa <span className="text-pink-500">DESC</span> <span className="text-pink-500">LIMIT</span> <span className="text-orange-400">3</span>;
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
                    LIMIT is the very <strong className="text-zinc-200">last step</strong> in the pipeline. First the engine sorts all rows by GPA (highest first), then it cuts the list at {limitVal}. That's why ORDER BY + LIMIT together is the standard "Top N" pattern used in every real-world application.
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between pt-3 border-t border-zinc-800 mt-1">
            <Link to="/orderby" className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors flex items-center gap-1">
              ← ORDER BY
            </Link>
            <Link
              to="/groupby"
              className="inline-flex items-center gap-2 px-4 py-2 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium transition-all hover:scale-[1.02] group"
            >
              Next: GROUP BY
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
            activeLineIndex={step === 0 ? 0 : step === 1 ? 1 : step >= 2 && step <= 4 ? 2 : step === 5 ? 3 : -1}
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
              {step === -1 && <div className="text-zinc-500 pt-2">Ready.</div>}
              {step === 0 && <div className="text-zinc-300 animate-pulse">Reading your query...</div>}
              {step === 1 && <div className="text-zinc-300 animate-pulse">Found the <span className="text-blue-400">students</span> table.</div>}
              {step === 2 && <div className="text-zinc-300 animate-pulse">All rows loaded. Sorting by gpa...</div>}
              {step === 4 && <div className="text-zinc-300 animate-pulse">Rows are sorted. Applying LIMIT...</div>}
              {step === 5 && (
                <div className="flex flex-col gap-2 mt-2">
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
                <div className="text-emerald-400 font-medium flex flex-col gap-1 mt-2">
                  <div className="flex items-center gap-2"><CheckCircle2 size={14} /> Done!</div>
                  <div className="text-zinc-500 text-xs">Returned top {resultSetData.length} rows only.</div>
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
          <Table data={tableData} title={`Source table: ${activeTable} (all rows)`} />
        </div>
        <div className="flex-1 flex flex-col min-h-[250px] shrink-0">
          {resultSetData.length > 0 || isFinished ? (
            <Table data={resultSetData} title={isFinished ? `Final Result Set (top ${resultSetData.length} rows only)` : "Intermediate: Sorted by GPA DESC"} />
          ) : (
            <div className="panel h-full w-full flex items-center justify-center text-zinc-500 font-mono text-xs border-dashed border-2">
              Top N rows will appear here after sorting + limiting
            </div>
          )}
        </div>
        </>
      }
    />  );
}
