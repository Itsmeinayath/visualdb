import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Table from "../../components/Table";
import Query from "../../components/Query";
import ChallengePanel from "../../components/ChallengePanel";
import { CheckCircle2, Cpu, ArrowDownAZ, ArrowRight, Lightbulb, ChevronUp, BookOpen , Code as CodeIcon, Book as BookIcon } from "lucide-react";
import ModuleLayout from "../../components/ModuleLayout";
import { useExecutionEngine } from "../../hooks/useExecutionEngine";
import { useChallenges } from "../../hooks/useChallenges";

const CHALLENGES = [
  {
    id: "orderby-age-asc",
    question: (<>Sort all students by their <code className="text-pink-400 text-xs">age</code> in ascending order (youngest first).</>),
    hint: "ORDER BY age ASC",
    validate: (rs) => rs.length === 5 && [19, 20, 21, 22, 23].every((v, i) => rs[i]?.age === v),
  },
  {
    id: "orderby-name-asc",
    question: (<>Sort the students alphabetically by <code className="text-pink-400 text-xs">name</code> from A to Z.</>),
    hint: "ORDER BY name ASC",
    validate: (rs) => {
      if (!rs.length) return false;
      for (let i = 1; i < rs.length; i++) { if (rs[i].name < rs[i-1].name) return false; }
      return true;
    },
  },
  {
    id: "orderby-gpa-asc",
    question: (<>Sort students by <code className="text-pink-400 text-xs">gpa</code> from lowest to highest (ascending).</>),
    hint: "ORDER BY gpa ASC",
    validate: (rs) => {
      if (!rs.length) return false;
      for (let i = 1; i < rs.length; i++) { if (rs[i].gpa < rs[i-1].gpa) return false; }
      return true;
    },
  },
];

export default function OrderByModule() {
  const {
    queryInput, setQueryInput,
    isPlaying, isPaused, isFinished, step,
    activeTable, tableData, parsedAST,
    resultSetData, runQuery, resetQuery,
    pauseQuery, stepQuery, speed, setSpeed, parseError,
  } = useExecutionEngine("SELECT *\nFROM students\nORDER BY gpa DESC;");

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
    <span key="3"><span className="text-pink-500 font-semibold">ORDER BY</span> gpa <span className="text-pink-500 font-semibold">DESC</span>;</span>,
  ];

  return (
    <ModuleLayout
      theoryContent={
        <>
<div className="p-5 flex flex-col gap-6">
          <header className="flex flex-col gap-2">
            <span className="bg-emerald-400/10 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-400/20 self-start">Step 3 · Beginner</span>
            <h1 className="text-3xl font-bold tracking-tight">The ORDER BY Clause</h1>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Databases do <strong>not</strong> guarantee any order to their rows. Without <code className="mx-1 px-1.5 py-0.5 rounded bg-muted text-foreground border border-border text-xs font-mono">ORDER BY</code>, your results could come back in a completely random sequence every time. This clause sorts your results before they are returned.
            </p>
          </header>

          <div className="flex flex-col gap-3">
            <div className="panel p-4 bg-zinc-900/50">
              <h3 className="font-semibold text-sm text-zinc-300 mb-2">The Concept</h3>
              <p className="text-xs text-zinc-400 leading-relaxed mb-2">
                When the engine sees <code className="text-pink-400 text-xs">ORDER BY</code>, it scans all the rows into a temporary internal buffer in memory, then sorts that buffer by the column you specified.
              </p>
              <p className="text-xs text-zinc-400 leading-relaxed">
                <code className="text-pink-400 text-xs">ASC</code> means smallest to largest (A→Z, 1→9). <code className="text-pink-400 text-xs">DESC</code> means largest to smallest (Z→A, 9→1). ASC is the default if you don't specify.
              </p>
            </div>
            <div className="panel p-4 bg-zinc-900/50">
              <h3 className="font-semibold text-sm text-zinc-300 mb-2">Syntax Examples</h3>
              <div className="flex flex-col gap-2 font-mono text-[11px]">
                <div className="bg-zinc-950 p-2 rounded border border-border">
                  <span className="text-zinc-500 block text-[10px] mb-1">-- Sort youngest to oldest (default ASC)</span>
                  <span className="text-pink-500">SELECT</span> * <span className="text-pink-500">FROM</span> <span className="text-blue-400">students</span> <span className="text-pink-500">ORDER BY</span> age;
                </div>
                <div className="bg-zinc-950 p-2 rounded border border-border">
                  <span className="text-zinc-500 block text-[10px] mb-1">-- Sort highest GPA first</span>
                  <span className="text-pink-500">SELECT</span> * <span className="text-pink-500">FROM</span> <span className="text-blue-400">students</span> <span className="text-pink-500">ORDER BY</span> gpa <span className="text-pink-500">DESC</span>;
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
                    Notice the <strong className="text-zinc-200">Source table</strong> above still shows the original row order — ORDER BY doesn't modify the actual table data. It only changes the order of the rows in the <strong className="text-zinc-200">Result Set</strong> that gets sent back to you. The database stays untouched.
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between pt-3 border-t border-zinc-800 mt-1">
            <Link to="/where" className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors flex items-center gap-1">
              ← WHERE
            </Link>
            <Link
              to="/limit"
              className="inline-flex items-center gap-2 px-4 py-2 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium transition-all hover:scale-[1.02] group"
            >
              Next: LIMIT
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
              {step === -1 && <div className="text-zinc-500 pt-2">Ready. Click "Run Query" to see the sort.</div>}
              {step === 0 && <div className="text-zinc-300 animate-pulse">Reading your query...</div>}
              {step === 1 && <div className="text-zinc-300 animate-pulse">Found the <span className="text-blue-400">students</span> table. Loading all rows...</div>}
              {step === 2 && <div className="text-zinc-300 animate-pulse">All rows scanned, preparing to sort...</div>}
              {step === 4 && (
                <div className="flex flex-col gap-2 mt-2">
                  <div className="text-accent flex items-center gap-2 animate-pulse">
                    <div className="w-3 h-3 rounded-full border border-accent border-t-transparent animate-spin" />
                    Sorting by: <span className="text-zinc-200">gpa</span> ({parsedAST?.orderby?.[0]?.type || "DESC"})
                  </div>
                  <div className="bg-zinc-900 border border-zinc-800 p-3 rounded text-xs text-zinc-500">
                    <ArrowDownAZ size={12} className="inline mr-1 text-accent" />
                    Comparing all rows and rearranging them...
                  </div>
                </div>
              )}
              {isFinished && (
                <div className="text-emerald-400 font-medium flex flex-col gap-1 mt-2">
                  <div className="flex items-center gap-2"><CheckCircle2 size={14} /> Sort complete!</div>
                  <div className="text-zinc-500 text-xs">All {resultSetData.length} rows are now in order.</div>
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
          <Table data={tableData} title={`Source table: ${activeTable} (original order)`} highlightedColumns={step >= 4 ? ["gpa"] : []} />
        </div>
        <div className="flex-1 flex flex-col min-h-[250px] shrink-0">
          {resultSetData.length > 0 || isFinished ? (
            <Table data={resultSetData} title="Result Set (sorted by GPA, highest first)" highlightedColumns={step >= 4 ? ["gpa"] : []} />
          ) : (
            <div className="panel h-full w-full flex items-center justify-center text-zinc-500 font-mono text-xs border-dashed border-2">
              Sorted result will appear here after you click Run Query
            </div>
          )}
        </div>
        </>
      }
    />  );
}
