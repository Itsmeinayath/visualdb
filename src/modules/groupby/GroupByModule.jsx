import { useEffect } from "react";
import { Link } from "react-router-dom";
import Table from "../../components/Table";
import Query from "../../components/Query";
import ChallengePanel from "../../components/ChallengePanel";
import { CheckCircle2, Cpu, FolderTree, ArrowRight, Lightbulb } from "lucide-react";
import { useExecutionEngine } from "../../hooks/useExecutionEngine";
import { useChallenges } from "../../hooks/useChallenges";

const CHALLENGES = [
  {
    id: "groupby-max-gpa",
    question: (<>Find the maximum GPA per major. Use <code className="text-pink-400 text-xs">MAX(gpa)</code> with <code className="text-pink-400 text-xs">GROUP BY major</code>.</>),
    hint: "SELECT major, MAX(gpa) FROM students GROUP BY major;",
    validate: (rs) => {
      const keys = Object.keys(rs[0] || {});
      return keys.includes("major") && keys.some(k => k.toUpperCase().includes("MAX")) && rs.length === 4;
    },
  },
  {
    id: "groupby-avg-gpa",
    question: (<>Find the average GPA per major. Use <code className="text-pink-400 text-xs">AVG(gpa)</code>.</>),
    hint: "SELECT major, AVG(gpa) FROM students GROUP BY major;",
    validate: (rs) => {
      const keys = Object.keys(rs[0] || {});
      return keys.some(k => k.toUpperCase().includes("AVG")) && rs.length === 4;
    },
  },
  {
    id: "groupby-count-major",
    question: (<>Count how many students are in each major using <code className="text-pink-400 text-xs">COUNT(*)</code> grouped by <code className="text-pink-400 text-xs">major</code>.</>),
    hint: "SELECT major, COUNT(*) FROM students GROUP BY major;",
    validate: (rs) => {
      const keys = Object.keys(rs[0] || {});
      return keys.includes("major") && keys.some(k => k.toUpperCase().includes("COUNT")) && rs.length === 4;
    },
  },
];

export default function GroupByModule() {
  const {
    queryInput, setQueryInput,
    isPlaying, isPaused, isFinished, step,
    activeTable, tableData, parsedAST,
    resultSetData, runQuery, resetQuery,
    pauseQuery, stepQuery, speed, setSpeed, parseError,
  } = useExecutionEngine("SELECT major, COUNT(*)\nFROM students\nGROUP BY major;");

  const challenges = useChallenges(CHALLENGES);

  useEffect(() => {
    if (isFinished && resultSetData.length > 0) {
      challenges.checkAnswer(resultSetData, parsedAST);
    } else if (!isFinished) {
      challenges.resetChallenge();
    }
  }, [isFinished, resultSetData]);

  const queryLines = [
    <span key="1"><span className="text-pink-500 font-semibold">SELECT</span> major, <span className="text-pink-500 font-semibold">COUNT</span>(*)</span>,
    <span key="2"><span className="text-pink-500 font-semibold">FROM</span> <span className="text-blue-400">students</span></span>,
    <span key="3"><span className="text-pink-500 font-semibold">GROUP BY</span> major;</span>,
  ];

  return (
    <div className="flex flex-col p-6 md:p-8 max-w-7xl mx-auto gap-8">

      <div className="flex flex-col gap-4">
        <span className="bg-amber-400/10 text-amber-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-400/20 self-start">Step 5 · Intermediate</span>
        <header>
          <h1 className="text-3xl font-bold mb-3 tracking-tight">The GROUP BY Clause</h1>
          <p className="text-muted-foreground text-base max-w-3xl leading-relaxed">
            <code className="mx-1 px-1.5 py-0.5 rounded bg-muted text-foreground border border-border text-sm font-mono">GROUP BY</code> fundamentally changes how data is returned. Instead of returning individual rows, it <strong>collapses rows that share a value</strong> into a single summary row. It's how you answer questions like "How many students are in each major?"
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="panel p-5 bg-zinc-900/50">
            <h3 className="font-semibold text-sm text-zinc-300 mb-3">The Concept</h3>
            <p className="text-sm text-zinc-400 leading-relaxed mb-3">
              Imagine sorting physical folders into labelled buckets. <code className="text-pink-400 text-xs">GROUP BY</code> creates a bucket for each unique value — one for "CS" majors, one for "Math" majors, etc.
            </p>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Once bucketed, you use <strong>aggregate functions</strong> like <code className="text-pink-400 text-xs">COUNT()</code> or <code className="text-pink-400 text-xs">SUM()</code> to calculate a single number representing all the rows in each bucket.
            </p>
          </div>
          <div className="panel p-5 bg-zinc-900/50">
            <h3 className="font-semibold text-sm text-zinc-300 mb-3">Syntax Examples</h3>
            <div className="flex flex-col gap-3 font-mono text-[13px]">
              <div className="bg-zinc-950 p-3 rounded border border-border">
                <span className="text-zinc-500 block text-xs mb-1">-- Count students per major</span>
                <span className="text-pink-500">SELECT</span> major, <span className="text-pink-500">COUNT</span>(*) <span className="text-pink-500">FROM</span> <span className="text-blue-400">students</span> <span className="text-pink-500">GROUP BY</span> major;
              </div>
              <div className="bg-zinc-950 p-3 rounded border border-border">
                <span className="text-zinc-500 block text-xs mb-1">-- Find the highest GPA per major</span>
                <span className="text-pink-500">SELECT</span> major, <span className="text-pink-500">MAX</span>(gpa) <span className="text-pink-500">FROM</span> <span className="text-blue-400">students</span> <span className="text-pink-500">GROUP BY</span> major;
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="h-px w-full bg-border" />
      <div className="flex items-center gap-2 -mb-4">
        <h2 className="text-lg font-bold">Live Execution Trace</h2>
        <span className="px-2 py-0.5 rounded-full bg-accent/10 text-accent text-xs font-semibold">Interactive — try GROUP BY age!</span>
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
              activeLineIndex={step === 0 ? 0 : step === 1 ? 1 : step >= 2 && step <= 4 ? 1 : step === 5 ? 2 : -1}
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
              {step === -1 && <div className="text-zinc-500 text-center pt-4">Ready.</div>}
              {step === 0 && <div className="text-zinc-300 animate-pulse">Reading your query...</div>}
              {step === 1 && <div className="text-zinc-300 animate-pulse">Found the <span className="text-blue-400">students</span> table. Scanning all rows...</div>}
              {step >= 2 && step <= 4 && <div className="text-zinc-300 animate-pulse">All rows loaded. Getting ready to group...</div>}
              {step === 5 && (
                <div className="flex flex-col gap-3">
                  <div className="text-accent flex items-center gap-2 animate-pulse">
                    <div className="w-3 h-3 rounded-full border border-accent border-t-transparent animate-spin" />
                    Grouping rows by: <span className="text-zinc-200">major</span>
                  </div>
                  <div className="bg-zinc-900 border border-zinc-800 p-3 rounded">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-300">
                      <FolderTree size={14} className="text-accent" /> Creating buckets for each unique major...
                    </div>
                    <div className="text-zinc-500 text-[11px] mt-1">Counting rows in each bucket with COUNT(*)...</div>
                  </div>
                </div>
              )}
              {isFinished && (
                <div className="text-emerald-400 font-medium flex flex-col gap-1">
                  <div className="flex items-center gap-2"><CheckCircle2 size={16} /> Grouping complete!</div>
                  <div className="text-zinc-500 text-xs">Collapsed {tableData.length} rows into {resultSetData.length} groups.</div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="col-span-1 lg:col-span-8 flex flex-col gap-6 overflow-hidden">
          <div className="flex-1 overflow-hidden min-h-[220px]">
            <Table data={tableData} title={`Source table: ${activeTable} (individual rows)`} highlightedColumns={step >= 5 ? ["major"] : []} />
          </div>
          <div className="flex-1 overflow-hidden min-h-[220px]">
            {resultSetData.length > 0 || isFinished ? (
              <Table data={resultSetData} title="Result Set (one row per group)" highlightedColumns={step >= 5 ? ["major", "COUNT(*)"] : []} />
            ) : (
              <div className="panel h-full w-full flex items-center justify-center text-zinc-500 font-mono text-sm border-dashed border-2">
                Grouped summary rows will appear here
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
                The engine used a <strong className="text-zinc-200">Hash Aggregation</strong> strategy — it created an internal bucket for each unique major and placed each student row in its matching bucket. Then it counted the rows in each bucket. The result: <strong className="text-zinc-200">{tableData.length} individual rows collapsed into just {resultSetData.length} summary rows</strong>. This is the power of GROUP BY.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between pt-2 border-t border-zinc-800">
        <Link to="/limit" className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors">← LIMIT</Link>
        <Link to="/having" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-sm font-medium transition-all hover:scale-[1.02] group">
          Next: HAVING <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
