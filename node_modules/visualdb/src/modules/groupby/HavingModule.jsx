import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Table from "../../components/Table";
import Query from "../../components/Query";
import ChallengePanel from "../../components/ChallengePanel";
import { CheckCircle2, Cpu, FolderTree, ArrowRight, Lightbulb, ChevronUp, BookOpen , Code as CodeIcon, Book as BookIcon } from "lucide-react";
import ModuleLayout from "../../components/ModuleLayout";
import { useExecutionEngine } from "../../hooks/useExecutionEngine";
import { useChallenges } from "../../hooks/useChallenges";

const CHALLENGES = [
  {
    id: "having-count1",
    question: (<>Modify the query to show only majors that have exactly <strong>1</strong> student. Use <code className="text-pink-400 text-xs">HAVING COUNT(*) = 1</code>.</>),
    hint: "HAVING COUNT(*) = 1",
    validate: (rs) => rs.length > 0 && !rs.some(r => r.major === "CS"),
  },
  {
    id: "having-count-gte2",
    question: (<>Show only majors where <strong>2 or more</strong> students are enrolled. Use <code className="text-pink-400 text-xs">HAVING COUNT(*) &gt;= 2</code>.</>),
    hint: "HAVING COUNT(*) >= 2",
    validate: (rs) => rs.length > 0 && rs.every(r => (r["COUNT(*)"] || 0) >= 2),
  },
  {
    id: "having-avg-gpa",
    question: (<>Find majors whose average GPA exceeds 3.5. Use <code className="text-pink-400 text-xs">AVG(gpa)</code> and <code className="text-pink-400 text-xs">HAVING AVG(gpa) &gt; 3.5</code>.</>),
    hint: "SELECT major, AVG(gpa) FROM students GROUP BY major HAVING AVG(gpa) > 3.5;",
    validate: (rs) => rs.length > 0 && rs.every(r => Object.values(r).some(v => typeof v === 'number' && v > 3.5)),
  },
];

export default function HavingModule() {
  const {
    queryInput, setQueryInput,
    isPlaying, isPaused, isFinished, step,
    activeTable, tableData, parsedAST,
    resultSetData, runQuery, resetQuery,
    pauseQuery, stepQuery, speed, setSpeed, parseError,
  } = useExecutionEngine("SELECT major, COUNT(*)\nFROM students\nGROUP BY major\nHAVING COUNT(*) > 1;");

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
    <span key="3"><span className="text-pink-500 font-semibold">GROUP BY</span> major</span>,
    <span key="4"><span className="text-pink-500 font-semibold">HAVING</span> <span className="text-pink-500 font-semibold">COUNT</span>(*) &gt; <span className="text-orange-400">1</span>;</span>,
  ];

  return (
    <ModuleLayout
      theoryContent={
        <>
<div className="p-5 flex flex-col gap-6">
          <header className="flex flex-col gap-2">
            <span className="bg-amber-400/10 text-amber-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-400/20 self-start">Step 6 · Intermediate</span>
            <h1 className="text-3xl font-bold tracking-tight">The HAVING Clause</h1>
            <p className="text-muted-foreground text-sm leading-relaxed">
              The <code className="mx-1 px-1.5 py-0.5 rounded bg-muted text-foreground border border-border text-xs font-mono">HAVING</code> clause is used to filter <strong>groups/buckets</strong> of data. It serves the exact same purpose as the <code className="text-pink-400 text-xs">WHERE</code> clause, but operates on aggregated data <strong>after</strong> the <code className="text-pink-400 text-xs">GROUP BY</code> phase has completed.
            </p>
          </header>

          <div className="flex flex-col gap-3">
            <div className="panel p-4 bg-zinc-900/50">
              <h3 className="font-semibold text-sm text-zinc-300 mb-2">WHERE vs HAVING</h3>
              <p className="text-xs text-zinc-400 leading-relaxed mb-2">
                You <strong>cannot</strong> use <code className="text-pink-400 text-xs">WHERE COUNT(*) &gt; 1</code>. Why? Because the <code className="text-pink-400 text-xs">WHERE</code> clause filters individual raw rows <strong>before</strong> they are grouped.
              </p>
              <p className="text-xs text-zinc-400 leading-relaxed">
                The <code className="text-pink-400 text-xs">HAVING</code> clause, on the other hand, runs <strong>after</strong> rows have been collapsed into buckets, letting you filter groups based on aggregate calculations like `COUNT`, `SUM`, or `MAX`.
              </p>
            </div>
            <div className="panel p-4 bg-zinc-900/50">
              <h3 className="font-semibold text-sm text-zinc-300 mb-2">Syntax Examples</h3>
              <div className="flex flex-col gap-2 font-mono text-[11px]">
                <div className="bg-zinc-950 p-2 rounded border border-border">
                  <span className="text-zinc-500 block text-[10px] mb-1">-- Keep only majors with multiple students</span>
                  <span className="text-pink-500">SELECT</span> major, <span className="text-pink-500">COUNT</span>(*)<br/>
                  <span className="text-pink-500">FROM</span> students <span className="text-pink-500">GROUP BY</span> major <span className="text-pink-500">HAVING</span> <span className="text-pink-500">COUNT</span>(*) &gt; 1;
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
                    Observe the output: only the <strong className="text-zinc-200">Computer Science</strong> group is returned. The Mathematics, Physics, and History groups each had only 1 student, so they failed the <code className="text-pink-400 text-xs">HAVING COUNT(*) &gt; 1</code> condition and were discarded. This is the exact way database groups are filtered!
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between pt-3 border-t border-zinc-800 mt-1">
            <Link to="/groupby" className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors flex items-center gap-1">
              ← GROUP BY
            </Link>
            <Link
              to="/innerjoin"
              className="inline-flex items-center gap-2 px-4 py-2 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium transition-all hover:scale-[1.02] group"
            >
              Next: INNER JOIN
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
              {step === -1 && <div className="text-zinc-500 pt-2">Ready. Click Run Query to start.</div>}
              {step === 0 && <div className="text-zinc-300 animate-pulse">Reading query...</div>}
              {step === 1 && <div className="text-zinc-300 animate-pulse">Scanning the <span className="text-blue-400">students</span> table...</div>}
              {step >= 2 && step <= 4 && <div className="text-zinc-300 animate-pulse">Aggregating rows into buckets by major...</div>}
              {step === 5 && (
                <div className="flex flex-col gap-2 mt-2">
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
                <div className="text-emerald-400 font-medium flex flex-col gap-1 mt-2">
                  <div className="flex items-center gap-2"><CheckCircle2 size={14} /> Filter complete!</div>
                  <div className="text-zinc-500 text-xs">Only CS passed because it has 2 students.</div>
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
          <Table data={tableData} title={`Source table: ${activeTable}`} highlightedColumns={step >= 5 ? ["major"] : []} />
        </div>
        <div className="flex-1 flex flex-col min-h-[250px] shrink-0">
          {resultSetData.length > 0 || isFinished ? (
            <Table data={resultSetData} title="Result Set (only groups passing HAVING)" highlightedColumns={step >= 5 ? ["major", "COUNT(*)"] : []} />
          ) : (
            <div className="panel h-full w-full flex items-center justify-center text-zinc-500 font-mono text-xs border-dashed border-2">
              Awaiting group evaluation...
            </div>
          )}
        </div>
        </>
      }
    />  );
}
