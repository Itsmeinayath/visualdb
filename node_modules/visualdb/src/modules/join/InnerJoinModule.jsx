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
    <ModuleLayout
      theoryContent={
        <>
<div className="p-5 flex flex-col gap-6">
          <header className="flex flex-col gap-2">
            <span className="bg-amber-400/10 text-amber-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-400/20 self-start">Step 7 · Intermediate</span>
            <h1 className="text-3xl font-bold tracking-tight">The INNER JOIN</h1>
            <p className="text-muted-foreground text-sm leading-relaxed">
              <code className="mx-1 px-1.5 py-0.5 rounded bg-muted text-foreground border border-border text-xs font-mono">INNER JOIN</code> combines rows from two separate tables into one result. It only returns rows where there is a <strong>matching value in both tables</strong> based on your <code className="mx-1 px-1.5 py-0.5 rounded bg-muted text-foreground border border-border text-xs font-mono">ON</code> condition. Rows that don't match are discarded from both sides.
            </p>
          </header>

          <div className="flex flex-col gap-3">
            <div className="panel p-4 bg-zinc-900/50">
              <h3 className="font-semibold text-sm text-zinc-300 mb-2">The Concept (Nested Loop)</h3>
              <p className="text-xs text-zinc-400 leading-relaxed mb-2">
                The engine uses a "Nested Loop" strategy — for <strong>every row</strong> in the left table (students), it loops through <strong>every row</strong> in the right table (courses) and asks: "Do these two match the ON condition?"
              </p>
              <p className="text-xs text-zinc-400 leading-relaxed">
                If they match, the two rows are merged side-by-side and added to the Result Set. Watch the highlighted rows in both tables to see this happen live.
              </p>
            </div>
            
            <div className="panel p-4 bg-zinc-900/50">
              <h3 className="font-semibold text-sm text-zinc-300 mb-2">Syntax Examples</h3>
              <div className="flex flex-col gap-2 font-mono text-[11px]">
                <div className="bg-zinc-950 p-2 rounded border border-border">
                  <span className="text-zinc-500 block text-[10px] mb-1">-- Combine students with their course info</span>
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
                    INNER JOIN only returned <strong className="text-zinc-200">{resultSetData.length} rows</strong> — the students that had a matching course. Any student whose <code className="text-pink-400 text-xs">course_id</code> didn't match a course's <code className="text-pink-400 text-xs">id</code> was completely excluded from the result. That's the key difference from LEFT JOIN, which you'll see next.
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between pt-3 border-t border-zinc-800 mt-1">
            <Link to="/having" className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors flex items-center gap-1">
              ← HAVING
            </Link>
            <Link
              to="/leftjoin"
              className="inline-flex items-center gap-2 px-4 py-2 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium transition-all hover:scale-[1.02] group"
            >
              Next: LEFT JOIN
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
              {step === -1 && <div className="text-zinc-500 pt-2">Ready.</div>}
              {step === 0 && <div className="text-zinc-300 animate-pulse">Reading your query...</div>}
              {step === 1 && <div className="text-zinc-300 animate-pulse">Loaded left table: <span className="text-blue-400">students</span></div>}
              {step === 2 && <div className="text-zinc-300 animate-pulse">Loaded right table: <span className="text-orange-400">{parsedAST?.from?.[1]?.table}</span></div>}
              {step === 3 && <div className="text-zinc-300 animate-pulse">Starting Nested Loop comparison...</div>}
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
                  <div className="flex items-center gap-2"><CheckCircle2 size={14} /> Join complete!</div>
                  <div className="text-zinc-500 text-xs">{resultSetData.length} matching pairs found.</div>
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
            title={`Left: students`}
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
            <Table data={resultSetData} title="Result Set (merged rows — only matched pairs)" />
          ) : (
            <div className="panel h-full w-full flex items-center justify-center text-zinc-500 font-mono text-xs border-dashed border-2">
              Matched pairs will appear here as the loop runs
            </div>
          )}
        </div>
        </>
      }
    />  );
}
