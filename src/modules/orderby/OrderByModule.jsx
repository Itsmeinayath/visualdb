import { useEffect } from "react";
import { Link } from "react-router-dom";
import Table from "../../components/Table";
import Query from "../../components/Query";
import ChallengePanel from "../../components/ChallengePanel";
import { CheckCircle2, Cpu, ArrowDownAZ, ArrowRight, Lightbulb } from "lucide-react";
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
    <div className="flex flex-col p-6 md:p-8 max-w-7xl mx-auto gap-8">

      <div className="flex flex-col gap-4">
        <span className="bg-emerald-400/10 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-400/20 self-start">Step 3 · Beginner</span>
        <header>
          <h1 className="text-3xl font-bold mb-3 tracking-tight">The ORDER BY Clause</h1>
          <p className="text-muted-foreground text-base max-w-3xl leading-relaxed">
            Databases do <strong>not</strong> guarantee any order to their rows. Without <code className="mx-1 px-1.5 py-0.5 rounded bg-muted text-foreground border border-border text-sm font-mono">ORDER BY</code>, your results could come back in a completely random sequence every time. This clause sorts your results before they are returned.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="panel p-5 bg-zinc-900/50">
            <h3 className="font-semibold text-sm text-zinc-300 mb-3">The Concept</h3>
            <p className="text-sm text-zinc-400 leading-relaxed mb-3">
              When the engine sees <code className="text-pink-400 text-xs">ORDER BY</code>, it scans all the rows into a temporary internal buffer in memory, then sorts that buffer by the column you specified.
            </p>
            <p className="text-sm text-zinc-400 leading-relaxed">
              <code className="text-pink-400 text-xs">ASC</code> means smallest to largest (A→Z, 1→9). <code className="text-pink-400 text-xs">DESC</code> means largest to smallest (Z→A, 9→1). ASC is the default if you don't specify.
            </p>
          </div>
          <div className="panel p-5 bg-zinc-900/50">
            <h3 className="font-semibold text-sm text-zinc-300 mb-3">Syntax Examples</h3>
            <div className="flex flex-col gap-3 font-mono text-[13px]">
              <div className="bg-zinc-950 p-3 rounded border border-border">
                <span className="text-zinc-500 block text-xs mb-1">-- Sort youngest to oldest (default ASC)</span>
                <span className="text-pink-500">SELECT</span> * <span className="text-pink-500">FROM</span> <span className="text-blue-400">students</span> <span className="text-pink-500">ORDER BY</span> age;
              </div>
              <div className="bg-zinc-950 p-3 rounded border border-border">
                <span className="text-zinc-500 block text-xs mb-1">-- Sort highest GPA first</span>
                <span className="text-pink-500">SELECT</span> * <span className="text-pink-500">FROM</span> <span className="text-blue-400">students</span> <span className="text-pink-500">ORDER BY</span> gpa <span className="text-pink-500">DESC</span>;
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
          <div className="h-52 shrink-0">
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
          {parseError && <div className="panel p-3 border-red-500/30 bg-red-500/5 text-red-400 text-xs font-mono">{parseError}</div>}
          <div className="panel p-4 flex flex-col gap-4">
            <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2 border-b border-border pb-2">
              <Cpu size={14} /> What's happening
            </div>
            <div className="h-36 flex flex-col justify-start font-mono text-[13px] gap-1">
              {step === -1 && <div className="text-zinc-500 text-center pt-4">Ready. Click "Run Query" to see the sort.</div>}
              {step === 0 && <div className="text-zinc-300 animate-pulse">Reading your query...</div>}
              {step === 1 && <div className="text-zinc-300 animate-pulse">Found the <span className="text-blue-400">students</span> table. Loading all rows...</div>}
              {step === 2 && <div className="text-zinc-300 animate-pulse">All rows scanned, preparing to sort...</div>}
              {step === 4 && (
                <div className="flex flex-col gap-3">
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
                <div className="text-emerald-400 font-medium flex flex-col gap-1">
                  <div className="flex items-center gap-2"><CheckCircle2 size={16} /> Sort complete!</div>
                  <div className="text-zinc-500 text-xs">All {resultSetData.length} rows are now in order.</div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="col-span-1 lg:col-span-8 flex flex-col gap-6 overflow-hidden">
          <div className="flex-1 overflow-hidden min-h-[220px]">
            <Table data={tableData} title={`Source table: ${activeTable} (original order)`} highlightedColumns={step >= 4 ? ["gpa"] : []} />
          </div>
          <div className="flex-1 overflow-hidden min-h-[220px]">
            {resultSetData.length > 0 || isFinished ? (
              <Table data={resultSetData} title="Result Set (sorted by GPA, highest first)" highlightedColumns={step >= 4 ? ["gpa"] : []} />
            ) : (
              <div className="panel h-full w-full flex items-center justify-center text-zinc-500 font-mono text-sm border-dashed border-2">
                Sorted result will appear here after you click Run Query
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
                Notice the <strong className="text-zinc-200">Source table</strong> above still shows the original row order — ORDER BY doesn't modify the actual table data. It only changes the order of the rows in the <strong className="text-zinc-200">Result Set</strong> that gets sent back to you. The database stays untouched.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between pt-2 border-t border-zinc-800">
        <Link to="/where" className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors">← WHERE</Link>
        <Link to="/limit" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-sm font-medium transition-all hover:scale-[1.02] group">
          Next: LIMIT <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
