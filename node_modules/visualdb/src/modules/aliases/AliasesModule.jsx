import { useEffect } from "react";
import { Link } from "react-router-dom";
import Table from "../../components/Table";
import Query from "../../components/Query";
import ChallengePanel from "../../components/ChallengePanel";
import { CheckCircle2, Cpu, Tag, ArrowRight, Lightbulb , Code as CodeIcon, Book as BookIcon } from "lucide-react";
import ModuleLayout from "../../components/ModuleLayout";
import { useExecutionEngine } from "../../hooks/useExecutionEngine";
import { useChallenges } from "../../hooks/useChallenges";

const CHALLENGES = [
  {
    id: "alias-student-major",
    question: (<>Retrieve only the <code className="text-pink-400 text-xs">major</code> column, renamed as <code className="text-pink-400 text-xs">student_major</code> using the <code className="text-pink-400 text-xs">AS</code> keyword.</>),
    hint: "SELECT major AS student_major FROM students;",
    validate: (rs) => rs.length === 5 && Object.keys(rs[0]).length === 1 && Object.keys(rs[0])[0] === 'student_major',
  },
  {
    id: "alias-two-columns",
    question: (<>Select <code className="text-pink-400 text-xs">name</code> renamed to <code className="text-pink-400 text-xs">full_name</code> and <code className="text-pink-400 text-xs">age</code> renamed to <code className="text-pink-400 text-xs">years</code>.</>),
    hint: "SELECT name AS full_name, age AS years FROM students;",
    validate: (rs) => {
      const keys = Object.keys(rs[0] || {});
      return keys.includes('full_name') && keys.includes('years') && keys.length === 2;
    },
  },
  {
    id: "alias-count",
    question: (<>Use <code className="text-pink-400 text-xs">COUNT(*) AS total</code> to count all students and give the result a clean column name.</>),
    hint: "SELECT COUNT(*) AS total FROM students;",
    validate: (rs) => rs.length === 1 && 'total' in (rs[0] || {}),
  },
];

export default function AliasesModule() {
  const {
    queryInput, setQueryInput,
    isPlaying, isPaused, isFinished, step,
    activeTable, tableData, parsedAST,
    resultSetData, runQuery, resetQuery,
    pauseQuery, stepQuery, speed, setSpeed, parseError,
  } = useExecutionEngine("SELECT name AS student_name, gpa AS score\nFROM students;");

  const challenges = useChallenges(CHALLENGES);

  useEffect(() => {
    if (isFinished && resultSetData.length > 0) {
      challenges.checkAnswer(resultSetData, parsedAST);
    } else if (!isFinished) {
      challenges.resetChallenge();
    }
  }, [isFinished, resultSetData]);

  const queryLines = [
    <span key="1"><span className="text-pink-500 font-semibold">SELECT</span> name <span className="text-pink-500 font-semibold">AS</span> student_name, gpa <span className="text-pink-500 font-semibold">AS</span> score</span>,
    <span key="2"><span className="text-pink-500 font-semibold">FROM</span> <span className="text-blue-400">students</span>;</span>,
  ];

  return (
    <ModuleLayout
      theoryContent={
        <>
<div className="p-5 flex flex-col gap-6">
          <header className="flex flex-col gap-2">
            <span className="bg-amber-400/10 text-amber-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-400/20 self-start">Step 10 · Intermediate</span>
            <h1 className="text-3xl font-bold tracking-tight">Column & Table Aliases</h1>
            <p className="text-muted-foreground text-sm leading-relaxed">
              The <code className="mx-1 px-1.5 py-0.5 rounded bg-muted text-foreground border border-border text-xs font-mono">AS</code> keyword is used to rename a column or table temporarily in the query results. These renames are called **aliases**, and they help make query output headers cleaner and more readable.
            </p>
          </header>

          <div className="flex flex-col gap-3">
            <div className="panel p-4 bg-zinc-900/50">
              <h3 className="font-semibold text-sm text-zinc-300 mb-2">The Concept</h3>
              <p className="text-xs text-zinc-400 leading-relaxed mb-2">
                When the database engine projects columns (selects them for output), it looks at the `columns` AST node. If an alias is defined via `AS`, the engine outputs the column using the new name as the header key.
              </p>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Aliases are also vital when using **aggregate functions** (e.g. `COUNT(*) AS total_students`), so the final column name doesn't default to a weird system string.
              </p>
            </div>
            <div className="panel p-4 bg-zinc-900/50">
              <h3 className="font-semibold text-sm text-zinc-300 mb-2">Syntax Examples</h3>
              <div className="flex flex-col gap-2 font-mono text-[11px]">
                <div className="bg-zinc-950 p-2 rounded border border-border">
                  <span className="text-zinc-500 block text-[10px] mb-1">-- Rename name and age</span>
                  <span className="text-pink-500">SELECT</span> name <span className="text-pink-500">AS</span> student_name, age <span className="text-pink-500">AS</span> years<br/>
                  <span className="text-pink-500">FROM</span> students;
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
                    Aliases are purely cosmetic—they do not affect how the database filters or sorts rows internally. They only modify the final presentation headers so your applications receive cleaner key names.
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between pt-3 border-t border-zinc-800 mt-1">
            <Link to="/distinct" className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors flex items-center gap-1">
              ← DISTINCT
            </Link>
            <Link
              to="/union"
              className="inline-flex items-center gap-2 px-4 py-2 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium transition-all hover:scale-[1.02] group"
            >
              Next: UNION
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
            activeLineIndex={step === 0 ? 0 : step === 1 ? 1 : step >= 2 && step <= 4 ? 0 : -1}
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
              {step === 0 && <div className="text-zinc-300 animate-pulse">Reading query...</div>}
              {step === 1 && <div className="text-zinc-300 animate-pulse">Scanning the <span className="text-blue-400">students</span> table...</div>}
              {step >= 2 && step <= 4 && <div className="text-zinc-300 animate-pulse">Loading rows...</div>}
              {step === 7 && (
                <div className="flex flex-col gap-2 mt-2">
                  <div className="text-accent flex items-center gap-2 animate-pulse">
                    <div className="w-3 h-3 rounded-full border border-accent border-t-transparent animate-spin" />
                    Projecting results...
                  </div>
                  <div className="bg-zinc-900 border border-zinc-800 p-3 rounded">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-300">
                      <Tag size={14} className="text-accent" /> Mapping column names to custom aliases...
                    </div>
                  </div>
                </div>
              )}
              {isFinished && (
                <div className="text-emerald-400 font-medium flex flex-col gap-1 mt-2">
                  <div className="flex items-center gap-2"><CheckCircle2 size={14} /> Query execution complete!</div>
                  <div className="text-zinc-500 text-xs">Mapped results to the requested aliases.</div>
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
          <Table data={tableData} title={`Source table: ${activeTable}`} highlightedColumns={["name", "gpa", "major"]} />
        </div>
        <div className="flex-1 flex flex-col min-h-[250px] shrink-0">
          {resultSetData.length > 0 || isFinished ? (
            <Table data={resultSetData} title="Result Set (with custom headers)" />
          ) : (
            <div className="panel h-full w-full flex items-center justify-center text-zinc-500 font-mono text-xs border-dashed border-2">
              Aliased output will appear here
            </div>
          )}
        </div>
        </>
      }
    />  );
}
