import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Table from "../../components/Table";
import Query from "../../components/Query";
import ChallengePanel from "../../components/ChallengePanel";
import { CheckCircle2, Cpu, FileSearch, ArrowRight, Lightbulb, ChevronUp, BookOpen } from "lucide-react";
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
  const [showTheory, setShowTheory] = useState(true);

  // Auto-collapse theory when playing
  useEffect(() => {
    if (isPlaying && showTheory) {
      setShowTheory(false);
    }
  }, [isPlaying]);

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
    <div className="flex flex-col lg:flex-row w-full overflow-hidden bg-background" style={{ height: 'calc(100vh - 3rem)' }}>
      {/* COLUMN 1: Theory & Challenges */}
      <div className="w-full lg:w-[30%] h-full border-r border-border flex flex-col bg-card/30 overflow-y-auto shrink-0">
        <div className="p-5 flex flex-col gap-6">
          <header className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="bg-emerald-400/10 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-400/20">Step 1 · Beginner</span>
            </div>
            <h1 className="text-xl font-bold tracking-tight">The SELECT Statement</h1>
            <p className="text-muted-foreground text-xs leading-relaxed">
              The foundation of all SQL queries. The <code className="px-1 py-0.5 rounded bg-muted text-foreground border border-border font-mono text-[10px]">SELECT</code> statement tells the database <strong>which columns</strong> you want to see, and <code className="px-1 py-0.5 rounded bg-muted text-foreground border border-border font-mono text-[10px]">FROM</code> tells it <strong>which table</strong> those columns live in.
            </p>
          </header>

          <div className="flex flex-col gap-3">
            <div className="panel p-3 bg-zinc-900/50">
              <h3 className="font-semibold text-xs flex items-center gap-2 text-zinc-300 mb-1.5">
                <BookIcon size={12} /> The Concept
              </h3>
              <p className="text-[11px] text-zinc-400 leading-relaxed mb-1.5">
                Think of a database table like a spreadsheet with rows and columns. <code className="text-pink-400 font-mono">SELECT *</code> means "give me every column".
              </p>
              <p className="text-[11px] text-zinc-400 leading-relaxed">
                You can also list specific columns: <code className="text-pink-400 font-mono">SELECT name, age</code> would only return those two columns.
              </p>
            </div>
            <div className="panel p-3 bg-zinc-900/50">
              <h3 className="font-semibold text-xs flex items-center gap-2 text-zinc-300 mb-1.5">
                <CodeIcon size={12} /> Syntax Examples
              </h3>
              <div className="flex flex-col gap-2 font-mono text-[10px]">
                <div className="bg-zinc-950 p-2 rounded border border-border">
                  <span className="text-zinc-500 block mb-1">-- Return all columns</span>
                  <span className="text-pink-500">SELECT</span> * <span className="text-pink-500">FROM</span> <span className="text-blue-400">students</span>;
                </div>
                <div className="bg-zinc-950 p-2 rounded border border-border">
                  <span className="text-zinc-500 block mb-1">-- Return specific columns only</span>
                  <span className="text-pink-500">SELECT</span> name, age <span className="text-pink-500">FROM</span> <span className="text-blue-400">students</span>;
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
            <div className="panel p-3 bg-amber-400/5 border border-amber-400/20">
              <div className="flex items-start gap-2">
                <Lightbulb size={14} className="text-amber-400 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-[11px] text-amber-300 mb-0.5">Takeaway</div>
                  <p className="text-[10px] text-zinc-400 leading-relaxed">
                    <strong className="text-zinc-200">SELECT</strong> scans every row and copies the columns you asked for into a new Result Set. Nothing was filtered out yet — that's what <code className="text-pink-400">WHERE</code> is for!
                  </p>
                </div>
              </div>
            </div>
          )}
          
          <div className="flex items-center justify-between pt-3 border-t border-zinc-800 mt-1">
            <Link
              to="/where"
              className="inline-flex items-center justify-center w-full gap-2 px-3 py-1.5 rounded-md bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-[11px] font-medium transition-all hover:scale-[1.02] group"
            >
              Next Lesson: WHERE Clause
              <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>

      {/* COLUMN 2: Editor & Trace */}
      <div className="w-full lg:w-[35%] h-full flex flex-col bg-zinc-950 border-r border-border shrink-0">
        
        {/* Top: Query Editor */}
        <div className="shrink-0 h-[280px] flex flex-col border-b border-border bg-zinc-900/30">
          <div className="px-3 py-2 border-b border-border bg-zinc-900/50 flex items-center justify-between">
            <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
              <CodeIcon size={12} /> Query Editor
            </span>
          </div>
          <div className="flex-1 p-3 overflow-hidden relative">
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
            {parseError && (
              <div className="absolute bottom-3 left-3 right-3 panel p-2 border-red-500/30 bg-red-500/5 text-red-400 text-[10px] font-mono">
                {parseError}
              </div>
            )}
          </div>
        </div>
        
        {/* Bottom: Execution Trace */}
        <div className="flex-1 flex flex-col min-h-0 bg-zinc-950/50">
          <div className="px-3 py-2 border-b border-border bg-zinc-900/50 flex flex-col">
             <div className="flex items-center gap-1.5 mb-1">
               <Cpu size={12} className="text-muted-foreground" />
               <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Execution Trace</span>
             </div>
             <span className="text-[9px] text-zinc-500 leading-tight">Shows how the SQL engine thinks step-by-step.</span>
          </div>
          <div className="flex-1 p-3 font-mono text-[10px] overflow-y-auto flex flex-col gap-1.5">
            {step === -1 && <div className="text-muted-foreground">Ready. Click "Run Query" to start the animation.</div>}
            {step >= 0 && <div className="text-zinc-400">↳ Reading your query...</div>}
            {step >= 1 && <div className="text-zinc-300">↳ Found the <span className="text-blue-400">students</span> table.</div>}
            {step >= 4 && <div className="text-accent">↳ Scanning rows... ({currentRowIdx + 1} of {tableData.length})</div>}
            {isPaused && <div className="text-amber-400">⏸ Paused — click Step to advance one row, or Resume to continue.</div>}
            {isFinished && <div className="text-emerald-400 font-medium flex items-center gap-1 mt-1"><CheckCircle2 size={12} /> Done! {resultSetData.length} rows returned.</div>}
          </div>
        </div>
      </div>

      {/* COLUMN 3: Tables */}
      <div className="flex-1 h-full flex flex-col overflow-y-auto p-4 gap-4 bg-zinc-950/20 relative min-w-[350px]">
        <div className="flex flex-col gap-2 shrink-0">
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
        
        <div className="flex-1 flex flex-col gap-2">
          {resultSetData.length > 0 || isFinished ? (
            <Table data={resultSetData} title="Result Set" />
          ) : (
            <div className="panel h-[250px] w-full flex items-center justify-center text-zinc-500 font-mono text-[11px] border-dashed border-2">
              Result Set will appear here after execution
            </div>
          )}
        </div>
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
