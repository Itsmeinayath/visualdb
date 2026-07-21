import { useEffect } from "react";
import { Link } from "react-router-dom";
import Table from "../../components/Table";
import Query from "../../components/Query";
import ChallengePanel from "../../components/ChallengePanel";
import { CheckCircle2, Terminal, ArrowRight, Lightbulb, Trophy } from "lucide-react";
import { useExecutionEngine } from "../../hooks/useExecutionEngine";
import { useChallenges } from "../../hooks/useChallenges";

const CHALLENGES = [
  {
    id: "select-specific",
    question: (
      <>
        Modify the query to retrieve only the{" "}
        <code className="text-pink-400 text-xs">name</code> and{" "}
        <code className="text-pink-400 text-xs">gpa</code> of all students.
      </>
    ),
    hint: "SELECT name, gpa FROM students;",
    validate: (resultSetData) => {
      if (!resultSetData.length) return false;
      const keys = Object.keys(resultSetData[0]);
      return keys.length === 2 && keys.includes("name") && keys.includes("gpa");
    },
  },
  {
    id: "select-three",
    question: (
      <>
        Now select the <code className="text-pink-400 text-xs">name</code>,{" "}
        <code className="text-pink-400 text-xs">age</code>, and{" "}
        <code className="text-pink-400 text-xs">major</code> columns from students.
      </>
    ),
    hint: "SELECT name, age, major FROM students;",
    validate: (resultSetData) => {
      if (!resultSetData.length) return false;
      const keys = Object.keys(resultSetData[0]);
      return (
        keys.length === 3 &&
        keys.includes("name") &&
        keys.includes("age") &&
        keys.includes("major")
      );
    },
  },
  {
    id: "select-all-orders",
    question: (
      <>
        Use <code className="text-pink-400 text-xs">SELECT *</code> to fetch every
        column from the <code className="text-blue-400 text-xs">orders</code> table.
      </>
    ),
    hint: "SELECT * FROM orders;",
    validate: (resultSetData, parsedAST) => {
      return parsedAST?.from?.[0]?.table === "orders" && resultSetData.length > 0;
    },
  },
];

export default function SelectModule() {
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
  } = useExecutionEngine("SELECT *\nFROM students;");

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
    <span key="2"><span className="text-pink-500 font-semibold">FROM</span> <span className="text-blue-400">students</span>;</span>,
  ];

  return (
    <div className="flex flex-col p-6 md:p-8 max-w-7xl mx-auto gap-8">
      
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2 text-sm text-zinc-500">
          <span className="bg-emerald-400/10 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-400/20">Step 1 · Beginner</span>
        </div>
        <header>
          <h1 className="text-3xl font-bold mb-3 tracking-tight">The SELECT Statement</h1>
          <p className="text-muted-foreground text-base max-w-3xl leading-relaxed">
            The foundation of all SQL queries. The <code className="mx-1 px-1.5 py-0.5 rounded bg-muted text-foreground border border-border text-sm font-mono">SELECT</code> statement tells the database <strong>which columns</strong> you want to see, and <code className="mx-1 px-1.5 py-0.5 rounded bg-muted text-foreground border border-border text-sm font-mono">FROM</code> tells it <strong>which table</strong> those columns live in.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="panel p-5 bg-zinc-900/50">
            <h3 className="font-semibold text-sm flex items-center gap-2 text-zinc-300 mb-3">
              <BookIcon /> The Concept
            </h3>
            <p className="text-sm text-zinc-400 leading-relaxed mb-3">
              Think of a database table like a spreadsheet with rows and columns. <code className="text-pink-400 text-xs">SELECT *</code> means "give me every column" — the asterisk (<code className="text-accent text-xs">*</code>) is a shortcut for "everything".
            </p>
            <p className="text-sm text-zinc-400 leading-relaxed">
              You can also list specific columns: <code className="text-pink-400 text-xs">SELECT name, age</code> would only return those two columns, hiding the rest.
            </p>
          </div>
          <div className="panel p-5 bg-zinc-900/50">
            <h3 className="font-semibold text-sm flex items-center gap-2 text-zinc-300 mb-3">
              <CodeIcon /> Syntax Examples
            </h3>
            <div className="flex flex-col gap-3 font-mono text-[13px]">
              <div className="bg-zinc-950 p-3 rounded border border-border">
                <span className="text-zinc-500 block text-xs mb-1">-- Return all columns</span>
                <span className="text-pink-500">SELECT</span> * <span className="text-pink-500">FROM</span> <span className="text-blue-400">students</span>;
              </div>
              <div className="bg-zinc-950 p-3 rounded border border-border">
                <span className="text-zinc-500 block text-xs mb-1">-- Return specific columns only</span>
                <span className="text-pink-500">SELECT</span> name, age <span className="text-pink-500">FROM</span> <span className="text-blue-400">students</span>;
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

      {/* Execution Area */}
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
              activeLineIndex={step === 0 ? 0 : step === 1 ? 1 : step >= 2 ? 0 : -1}
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
          {parseError && (
            <div className="panel p-3 border-red-500/30 bg-red-500/5 text-red-400 text-xs font-mono">{parseError}</div>
          )}
          <div className="panel p-4 flex flex-col gap-2">
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
              <Terminal size={14} /> What's happening
            </div>
            <div className="font-mono text-[13px] h-32 overflow-y-auto flex flex-col justify-end gap-1">
              {step === -1 && <div className="text-muted-foreground">Ready. Click "Run Query" to start the animation.</div>}
              {step >= 0 && <div className="text-zinc-400">↳ Reading your query...</div>}
              {step >= 1 && <div className="text-zinc-300">↳ Found the <span className="text-blue-400">students</span> table.</div>}
              {step >= 4 && <div className="text-accent">↳ Scanning rows... ({currentRowIdx + 1} of {tableData.length})</div>}
              {isPaused && <div className="text-amber-400">⏸ Paused — click Step to advance one row, or Resume to continue.</div>}
              {isFinished && <div className="text-emerald-400 font-medium flex items-center gap-1 mt-1"><CheckCircle2 size={14} /> Done! {resultSetData.length} rows returned.</div>}
            </div>
          </div>
        </div>

        <div className="col-span-1 lg:col-span-8 flex flex-col gap-6 overflow-hidden">
          <div className="flex-1 overflow-hidden min-h-[220px]">
            <Table
              data={tableData}
              title={`Source table: ${activeTable}`}
              highlightedRows={
                step === 4 && checkingCondition
                  ? [tableData[currentRowIdx]?.id || tableData[currentRowIdx]?.order_id || currentRowIdx]
                  : []
              }
            />
          </div>
          <div className="flex-1 overflow-hidden min-h-[220px]">
            {resultSetData.length > 0 || isFinished ? (
              <Table data={resultSetData} title="Result Set" />
            ) : (
              <div className="panel h-full w-full flex items-center justify-center text-zinc-500 font-mono text-sm border-dashed border-2">
                Result Set will appear here after you click Run Query
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Key Takeaway */}
      {isFinished && (
        <div className="panel p-5 bg-amber-400/5 border border-amber-400/20">
          <div className="flex items-start gap-3">
            <Lightbulb size={18} className="text-amber-400 mt-0.5 flex-shrink-0" />
            <div>
              <div className="font-semibold text-amber-300 mb-1">Key Takeaway</div>
              <p className="text-sm text-zinc-400 leading-relaxed">
                <strong className="text-zinc-200">SELECT</strong> scans every single row in the table from top to bottom and copies the columns you asked for into a new Result Set. Since we used <code className="text-pink-400 text-xs">SELECT *</code>, all {resultSetData.length} rows with all their columns were returned. Nothing was filtered out yet — that's what <code className="text-pink-400 text-xs">WHERE</code> is for!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Next Module */}
      <div className="flex items-center justify-between pt-2 border-t border-zinc-800">
        <div className="text-sm text-zinc-500">Next up: filtering rows with a condition</div>
        <Link
          to="/where"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-sm font-medium transition-all hover:scale-[1.02] group"
        >
          Next: WHERE Clause
          <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
}

function BookIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
  );
}
function CodeIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" />
    </svg>
  );
}
