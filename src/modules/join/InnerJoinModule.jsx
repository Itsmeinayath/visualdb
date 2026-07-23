import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Table from "../../components/Table";
import Query from "../../components/Query";
import ChallengePanel from "../../components/ChallengePanel";
import SchemaDiagram from "../../components/SchemaDiagram";
import { CheckCircle2, Cpu, Combine, ArrowRight, Lightbulb, ChevronUp, BookOpen } from "lucide-react";
import { useExecutionEngine } from "../../hooks/useExecutionEngine";
import { useChallenges } from "../../hooks/useChallenges";

const CHALLENGES = [
  {
    id: "join-name-course",
    question: (<>Retrieve only the student's <code className="text-pink-400 text-xs">name</code> and the <code className="text-pink-400 text-xs">course_name</code>. Remove the <code className="text-pink-400 text-xs">*</code> and list them explicitly.</>),
    hint: "SELECT students.name, courses.course_name FROM ...",
    validate: (rs) => {
      if (!rs.length) return false;
      const keys = Object.keys(rs[0]);
      return keys.length === 2 && keys.includes("name") && keys.includes("course_name") && rs.length === 4;
    },
  },
  {
    id: "join-where-gpa",
    question: (<>Join students and courses, but only return students whose <code className="text-pink-400 text-xs">gpa</code> is greater than 3.6.</>),
    hint: "Add WHERE students.gpa > 3.6 after the ON clause.",
    validate: (rs) => rs.length > 0 && rs.every(r => r.gpa > 3.6),
  },
  {
    id: "join-all-columns",
    question: (<>Run the default <code className="text-pink-400 text-xs">SELECT *</code> INNER JOIN and verify all 4 matched students appear in the result.</>),
    hint: "SELECT * FROM students INNER JOIN courses ON students.course_id = courses.course_id;",
    validate: (rs) => rs.length === 4,
  },
];

export default function InnerJoinModule() {
  const {
    queryInput, setQueryInput,
    isPlaying, isPaused, isFinished, step,
    activeTable, tableData, rightTableData,
    currentRowIdx, currentRightRowIdx,
    parsedAST, resultSetData, checkingCondition,
    runQuery, resetQuery,
    pauseQuery, stepQuery, speed, setSpeed, parseError,
  } = useExecutionEngine("SELECT *\nFROM students\nINNER JOIN courses\n  ON students.course_id = courses.course_id;");

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
    <span key="2"><span className="text-pink-500 font-semibold">FROM</span> <span className="text-blue-400">students</span></span>,
    <span key="3"><span className="text-pink-500 font-semibold">INNER JOIN</span> <span className="text-orange-400">courses</span></span>,
    <span key="4">  <span className="text-pink-500 font-semibold">ON</span> <span className="text-blue-400">students</span>.course_id = <span className="text-orange-400">courses</span>.course_id;</span>,
  ];

  return (
    <div className="flex flex-col p-6 md:p-8 max-w-7xl mx-auto gap-8">

      <div className="flex items-center justify-between">
        <span className="bg-amber-400/10 text-amber-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-400/20">Step 7 · Intermediate</span>
        <button 
          onClick={() => setShowTheory(!showTheory)} 
          className="text-xs text-zinc-400 hover:text-zinc-200 flex items-center gap-1.5 transition-colors bg-zinc-900/50 hover:bg-zinc-800 px-2 py-1 rounded border border-zinc-800"
        >
          {showTheory ? <ChevronUp size={14} /> : <BookOpen size={14} />} 
          {showTheory ? "Hide Lesson Theory" : "Show Lesson Theory"}
        </button>
      </div>

      {showTheory && (
        <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
          <header>
            <h1 className="text-3xl font-bold mb-3 tracking-tight">The INNER JOIN</h1>
            <p className="text-muted-foreground text-base max-w-3xl leading-relaxed">
              <code className="mx-1 px-1.5 py-0.5 rounded bg-muted text-foreground border border-border text-sm font-mono">INNER JOIN</code> combines rows from two separate tables into one result. It only returns rows where there is a <strong>matching value in both tables</strong> based on your <code className="mx-1 px-1.5 py-0.5 rounded bg-muted text-foreground border border-border text-sm font-mono">ON</code> condition. Rows that don't match are discarded from both sides.
            </p>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="panel p-5 bg-zinc-900/50">
              <h3 className="font-semibold text-sm text-zinc-300 mb-3">The Concept (Nested Loop)</h3>
              <p className="text-sm text-zinc-400 leading-relaxed mb-3">
                The engine uses a "Nested Loop" strategy — for <strong>every row</strong> in the left table (students), it loops through <strong>every row</strong> in the right table (courses) and asks: "Do these two match the ON condition?"
              </p>
              <p className="text-sm text-zinc-400 leading-relaxed">
                If they match, the two rows are merged side-by-side and added to the Result Set. Watch the highlighted rows in both tables to see this happen live.
              </p>
            </div>
            
            <div className="panel p-5 bg-zinc-900/50">
              <h3 className="font-semibold text-sm text-zinc-300 mb-3">Syntax Examples</h3>
              <div className="flex flex-col gap-3 font-mono text-[13px]">
                <div className="bg-zinc-950 p-3 rounded border border-border">
                  <span className="text-zinc-500 block text-xs mb-1">-- Combine students with their course info</span>
                  <span className="text-pink-500">SELECT</span> * <span className="text-pink-500">FROM</span> <span className="text-blue-400">students</span><br/>
                  <span className="text-pink-500">INNER JOIN</span> <span className="text-orange-400">courses</span> <span className="text-pink-500">ON</span> students.course_id = courses.id;
                </div>
              </div>
            </div>

            <SchemaDiagram 
              leftTable="students"
              rightTable="courses"
              leftKey="course_id"
              rightKey="course_id"
            />
          </div>
        </div>
      )}

      <div className="h-px w-full bg-border" />
      <div className="flex items-center gap-2 -mb-4">
        <h2 className="text-lg font-bold">Live Execution Trace</h2>
        <span className="px-2 py-0.5 rounded-full bg-accent/10 text-accent text-xs font-semibold">Nested Loop Simulation</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 min-h-[700px]">
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
          <div className="h-56 shrink-0">
            <Query
              queryLines={queryLines}
              value={queryInput}
              onChange={setQueryInput}
              activeLineIndex={step === 0 ? 0 : step === 1 ? 1 : step === 2 ? 2 : step === 4 ? 3 : -1}
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
            <div className="h-44 flex flex-col justify-start font-mono text-[13px] gap-1 overflow-y-auto">
              {step === -1 && <div className="text-zinc-500 text-center pt-4">Ready.</div>}
              {step === 0 && <div className="text-zinc-300 animate-pulse">Reading your query...</div>}
              {step === 1 && <div className="text-zinc-300 animate-pulse">Loaded left table: <span className="text-blue-400">students</span></div>}
              {step === 2 && <div className="text-zinc-300 animate-pulse">Loaded right table: <span className="text-orange-400">{parsedAST?.from?.[1]?.table}</span></div>}
              {step === 3 && <div className="text-zinc-300 animate-pulse">Starting Nested Loop comparison...</div>}
              {step === 4 && (
                <div className="flex flex-col gap-3">
                  <div className="text-accent flex items-center gap-2 animate-pulse">
                    <div className="w-3 h-3 rounded-full border border-accent border-t-transparent animate-spin" />
                    Comparing rows...
                  </div>
                  <div className="bg-zinc-900 border border-zinc-800 p-3 rounded">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-300 mb-2">
                      <Combine size={14} className="text-accent" /> Nested Loop: student #{currentRowIdx + 1}
                    </div>
                    {currentRightRowIdx >= 0 && (
                      <div className="flex flex-col gap-2 mt-2 pt-2 border-t border-zinc-800">
                        <div className="flex items-center justify-between text-xs font-mono">
                          <div className="flex flex-col bg-zinc-950 px-2 py-1 rounded border border-zinc-800">
                            <span className="text-[10px] text-zinc-500">students.course_id</span>
                            <span className="text-blue-400 font-bold">{tableData[currentRowIdx]?.course_id}</span>
                          </div>
                          
                          <div className="text-zinc-500 font-semibold px-1">
                            {checkingCondition ? (
                              <span className="animate-pulse">== ?</span>
                            ) : (
                              tableData[currentRowIdx]?.course_id === rightTableData[currentRightRowIdx]?.course_id ? (
                                <span className="text-emerald-400 font-bold">==</span>
                              ) : (
                                <span className="text-red-400 font-bold">!=</span>
                              )
                            )}
                          </div>
                          
                          <div className="flex flex-col bg-zinc-950 px-2 py-1 rounded border border-zinc-800">
                            <span className="text-[10px] text-zinc-500">courses.course_id</span>
                            <span className="text-orange-400 font-bold">{rightTableData[currentRightRowIdx]?.course_id}</span>
                          </div>
                        </div>
                        
                        <div className="text-[11px] text-zinc-500 mt-1">
                          {checkingCondition ? (
                            <span className="text-zinc-400">Comparing keys...</span>
                          ) : (
                            tableData[currentRowIdx]?.course_id === rightTableData[currentRightRowIdx]?.course_id ? (
                              <span className="text-emerald-400 font-semibold">Match! Merging rows.</span>
                            ) : (
                              <span className="text-red-400/80">No match. Skipping.</span>
                            )
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
              {isFinished && (
                <div className="text-emerald-400 font-medium flex flex-col gap-1">
                  <div className="flex items-center gap-2"><CheckCircle2 size={16} /> Join complete!</div>
                  <div className="text-zinc-500 text-xs">{resultSetData.length} matching pairs found.</div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="col-span-1 lg:col-span-8 flex flex-col gap-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 h-[280px]">
            <Table
              data={tableData}
              title={`Left: students`}
              highlightedRows={currentRowIdx !== -1 ? [tableData[currentRowIdx]?.id || currentRowIdx] : []}
              highlightedColumns={["course_id"]}
            />
            <Table
              data={rightTableData}
              title="Right: courses"
              highlightedRows={currentRightRowIdx !== -1 ? [rightTableData[currentRightRowIdx]?.course_id || currentRightRowIdx] : []}
              highlightedColumns={["course_id"]}
            />
          </div>
          <div className="flex-1 min-h-[280px]">
            {resultSetData.length > 0 || isFinished ? (
              <Table data={resultSetData} title="Result Set (merged rows — only matched pairs)" />
            ) : (
              <div className="panel h-full w-full flex items-center justify-center text-zinc-500 font-mono text-sm border-dashed border-2">
                Matched pairs will appear here as the loop runs
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
                INNER JOIN only returned <strong className="text-zinc-200">{resultSetData.length} rows</strong> — the students that had a matching course. Any student whose <code className="text-pink-400 text-xs">course_id</code> didn't match a course's <code className="text-pink-400 text-xs">id</code> was completely excluded from the result. That's the key difference from LEFT JOIN, which you'll see next.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between pt-2 border-t border-zinc-800">
        <Link to="/having" className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors">← HAVING</Link>
        <Link to="/leftjoin" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-sm font-medium transition-all hover:scale-[1.02] group">
          Next: LEFT JOIN <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
