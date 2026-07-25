import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Xarrow from "react-xarrows";
import Table from "../../components/Table";
import Query from "../../components/Query";
import ChallengePanel from "../../components/ChallengePanel";
import SchemaDiagram from "../../components/SchemaDiagram";
import { CheckCircle2, Cpu, Combine, ArrowRight, Lightbulb, ChevronUp, BookOpen , Code as CodeIcon, Book as BookIcon } from "lucide-react";
import ModuleLayout from "../../components/ModuleLayout";
import { useExecutionEngine } from "../../hooks/useExecutionEngine";
import { useChallenges } from "../../hooks/useChallenges";

const CHALLENGES = [
  {
    id: "leftjoin-name-credits",
    question: (<>Retrieve all students' <code className="text-pink-400 text-xs">name</code> and course <code className="text-pink-400 text-xs">credits</code> using LEFT JOIN — students with no match should still appear with NULL.</>),
    hint: "SELECT students.name, courses.credits FROM students LEFT JOIN courses ON ...",
    validate: (rs) => {
      if (!rs.length) return false;
      const keys = Object.keys(rs[0]);
      return keys.length === 2 && keys.includes("name") && keys.includes("credits") && rs.length === 5;
    },
  },
  {
    id: "leftjoin-all-rows",
    question: (<>Run a <code className="text-pink-400 text-xs">SELECT *</code> LEFT JOIN and confirm that <strong>5 rows</strong> appear (including the NULL row for the unmatched student).</>),
    hint: "SELECT * FROM students LEFT JOIN courses ON students.course_id = courses.course_id;",
    validate: (rs) => rs.length === 5,
  },
  {
    id: "leftjoin-vs-inner",
    question: (<>Switch the <code className="text-pink-400 text-xs">LEFT JOIN</code> to an <code className="text-pink-400 text-xs">INNER JOIN</code> and observe how the unmatched student disappears. Only 4 rows should appear.</>),
    hint: "SELECT * FROM students INNER JOIN courses ON students.course_id = courses.course_id;",
    validate: (rs) => rs.length === 4,
  },
];

export default function LeftJoinModule() {
  const {
    queryInput, setQueryInput,
    isPlaying, isPaused, isFinished, step,
    activeTable, tableData, rightTableData,
    currentRowIdx, currentRightRowIdx,
    parsedAST, resultSetData, checkingCondition,
    runQuery, resetQuery,
    pauseQuery, stepQuery, speed, setSpeed, parseError,
  } = useExecutionEngine("SELECT *\nFROM students\nLEFT JOIN courses\n  ON students.course_id = courses.course_id;");

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
    <span key="3"><span className="text-pink-500 font-semibold">LEFT JOIN</span> <span className="text-orange-400">courses</span></span>,
    <span key="4">  <span className="text-pink-500 font-semibold">ON</span> <span className="text-blue-400">students</span>.course_id = <span className="text-orange-400">courses</span>.course_id;</span>,
  ];

  return (
    <ModuleLayout
      theoryContent={
        <>
<div className="p-5 flex flex-col gap-6">
          <header className="flex flex-col gap-2">
            <span className="bg-amber-400/10 text-amber-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-400/20 self-start">Step 8 · Intermediate</span>
            <h1 className="text-3xl font-bold tracking-tight">The LEFT JOIN</h1>
            <p className="text-muted-foreground text-sm leading-relaxed">
              <code className="mx-1 px-1.5 py-0.5 rounded bg-muted text-foreground border border-border text-xs font-mono">LEFT JOIN</code> is like INNER JOIN, but with a crucial guarantee: <strong>every row from the left table is always returned</strong> — even if there's no matching row in the right table. When no match is found, the right-side columns are filled with <code className="mx-1 px-1.5 py-0.5 rounded bg-muted text-red-400 border border-border text-xs font-mono">NULL</code>.
            </p>
          </header>

          <div className="flex flex-col gap-3">
            <div className="panel p-4 bg-zinc-900/50">
              <h3 className="font-semibold text-sm text-zinc-300 mb-2">INNER JOIN vs LEFT JOIN</h3>
              <div className="flex flex-col gap-2 text-xs text-zinc-400">
                <div className="flex items-start gap-2">
                  <span className="text-red-400 font-bold mt-0.5">✗</span>
                  <span><strong className="text-zinc-300">INNER JOIN:</strong> A student with no matching course is completely excluded from the results.</span>
                </div>
                <div className="flex items-start gap-2 mt-1">
                  <span className="text-emerald-400 font-bold mt-0.5">✓</span>
                  <span><strong className="text-zinc-300">LEFT JOIN:</strong> A student with no matching course still appears in the results — their course columns are filled with <code className="text-red-400 text-[10px]">NULL</code>.</span>
                </div>
              </div>
            </div>
            
            <div className="panel p-4 bg-zinc-900/50">
              <h3 className="font-semibold text-sm text-zinc-300 mb-2">Real-world Use Case</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Use LEFT JOIN when you want to see <strong>all records from one table</strong>, regardless of whether there are related records in another. Example: "Show me all students, and if they have a course, show that too. If not, that's fine."
              </p>
            </div>

            <SchemaDiagram 
              leftTable="students"
              rightTable="courses"
              leftKey="course_id"
              rightKey="course_id"
            />
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
                    The LEFT JOIN returned <strong className="text-zinc-200">{resultSetData.length} rows</strong> — one per student. Notice "Evan Wright" appears in the result even though his <code className="text-pink-400 text-xs">course_id</code> doesn't match any course. His course columns all show <span className="text-red-400 font-mono text-xs">NULL</span>. The INNER JOIN would have silently dropped him. This distinction is critical in real-world database design.
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between pt-3 border-t border-zinc-800 mt-1">
            <Link to="/innerjoin" className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors flex items-center gap-1">
              ← INNER JOIN
            </Link>
            <Link
              to="/distinct"
              className="inline-flex items-center gap-2 px-4 py-2 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium transition-all hover:scale-[1.02] group"
            >
              Next: DISTINCT
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
        </>
      }
      editorContent={
        <>

        <div className="h-[55%] flex flex-col border-b border-border">
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

        {parseError ? (
          <div className="p-4 bg-red-500/5 text-red-400 text-xs font-mono">{parseError}</div>
        ) : (
          <div className="h-[45%] flex flex-col bg-zinc-950/50">
            <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2 px-4 py-3 border-b border-border bg-zinc-900/30">
              <Cpu size={14} /> Execution Trace
            </div>
            <div className="flex-1 p-4 font-mono text-xs gap-1.5 overflow-y-auto flex flex-col leading-relaxed">
              {step === -1 && <div className="text-zinc-500 pt-2">Ready. Watch for Evan Wright's NULL row!</div>}
              {step === 0 && <div className="text-zinc-300 animate-pulse">Reading your query...</div>}
              {step === 1 && <div className="text-zinc-300 animate-pulse">Loaded left table: <span className="text-blue-400">students</span></div>}
              {step === 2 && <div className="text-zinc-300 animate-pulse">Loaded right table: <span className="text-orange-400">{parsedAST?.from?.[1]?.table}</span></div>}
              {step === 3 && <div className="text-zinc-300 animate-pulse">Starting Nested Loop with LEFT JOIN rules...</div>}
              {step === 4 && (
                <div className="flex flex-col gap-2 mt-2">
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
                <div className="text-emerald-400 font-medium flex flex-col gap-1 mt-2">
                  <div className="flex items-center gap-2"><CheckCircle2 size={14} /> Left Join complete!</div>
                  <div className="text-zinc-500 text-xs">{resultSetData.length} rows returned (including NULLs).</div>
                </div>
              )}
            </div>
          </div>
        )}
      </>
      }
      dataContent={
        <>
<div className="flex-1 flex flex-col min-h-[150px] shrink-0">
          <Table
            data={tableData}
            title="Left: students (all included)"
            highlightedRows={currentRowIdx !== -1 ? [tableData[currentRowIdx]?.id || currentRowIdx] : []}
            highlightedColumns={["course_id"]}
            idPrefix="left"
          />
        </div>
        <div className="flex-1 flex flex-col min-h-[150px] shrink-0">
          <Table
            data={rightTableData}
            title="Right: courses"
            highlightedRows={currentRightRowIdx !== -1 ? [rightTableData[currentRightRowIdx]?.course_id || currentRightRowIdx] : []}
            highlightedColumns={["course_id"]}
            idPrefix="right"
          />
        </div>
        
        {currentRowIdx !== -1 && currentRightRowIdx !== -1 && (
          <Xarrow
            start={`left-row-${tableData[currentRowIdx]?.id || currentRowIdx}`}
            end={`right-row-${rightTableData[currentRightRowIdx]?.course_id || currentRightRowIdx}`}
            color={
              checkingCondition 
                ? "#a1a1aa" 
                : (tableData[currentRowIdx]?.course_id === rightTableData[currentRightRowIdx]?.course_id ? "#10b981" : "#ef4444")
            }
            strokeWidth={2}
            path="straight"
            dashness={checkingCondition ? { animation: 1 } : false}
            headSize={4}
            zIndex={50}
          />
        )}

        <div className="flex-1 flex flex-col min-h-[250px] shrink-0">
          {resultSetData.length > 0 || isFinished ? (
            <Table data={resultSetData} title="Result Set — all students included, NULL where no course match" />
          ) : (
            <div className="panel h-full w-full flex items-center justify-center text-zinc-500 font-mono text-xs border-dashed border-2">
              Result rows appear here — including students with no matching course
            </div>
          )}
        </div>
        </>
      }
    />  );
}
