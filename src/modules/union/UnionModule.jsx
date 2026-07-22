import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import Table from "../../components/Table";
import Query from "../../components/Query";
import ChallengePanel from "../../components/ChallengePanel";
import { CheckCircle2, Cpu, Layers, ArrowRight, Lightbulb, Merge } from "lucide-react";
import { Parser } from "node-sql-parser";
import { getTable } from "../../engine/database";
import { useChallenges } from "../../hooks/useChallenges";

const CHALLENGES = [
  {
    id: "union-basic",
    question: (<>Run a basic <code className="text-pink-400 text-xs">UNION</code> of <code className="text-pink-400 text-xs">students.name</code> and <code className="text-pink-400 text-xs">teachers.name</code>. Notice that duplicate names are removed automatically.</>),
    hint: "SELECT name FROM students ... UNION ... SELECT name FROM teachers;",
    validate: (rs, ast) => {
      if (!rs.length) return false;
      const keys = Object.keys(rs[0]);
      const hasUniqueName = keys.length === 1 && keys.includes("name");
      const isUnion = ast?.set_op?.toLowerCase() === "union";
      const noDuplicates = rs.length === new Set(rs.map((r) => r.name)).size;
      return hasUniqueName && isUnion && noDuplicates;
    },
  },
  {
    id: "union-all",
    question: (<>Change <code className="text-pink-400 text-xs">UNION</code> to <code className="text-pink-400 text-xs">UNION ALL</code>. Now duplicates should appear in the result.</>),
    hint: "Try replacing UNION with UNION ALL between the two SELECT statements.",
    validate: (rs, ast) => {
      if (!rs.length) return false;
      const keys = Object.keys(rs[0]);
      const hasUniqueName = keys.length === 1 && keys.includes("name");
      const isUnionAll = ast?.set_op?.toLowerCase() === "union all";
      return hasUniqueName && isUnionAll;
    },
  },
  {
    id: "union-where",
    question: (<>Add a <code className="text-pink-400 text-xs">WHERE</code> clause: filter students older than 20 and teachers with more than 10 years experience, then <code className="text-pink-400 text-xs">UNION</code> the results.</>),
    hint: "Each SELECT can have its own WHERE clause, add one to each side of the UNION.",
    validate: (rs, ast) => {
      if (!rs.length) return false;
      const hasLeftWhere = !!ast?.where;
      const hasRightWhere = !!ast?._next?.where;
      const isUnion = ast?.set_op?.toLowerCase() === "union";
      const resultLessThanTotal = rs.length < getTable("students").length + getTable("teachers").length;
      return hasLeftWhere && hasRightWhere && isUnion && resultLessThanTotal;
    },
  },
];

export default function UnionModule() {
  const defaultQuery = "SELECT name FROM students\nUNION\nSELECT name FROM teachers;";

  const [queryInput, setQueryInput] = useState(defaultQuery);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [step, setStep] = useState(-1);
  const [speed, setSpeed] = useState(1);
  const speedRef = useRef(1);
  speedRef.current = speed;

  const stepResolveRef = useRef(null);
  const isPausedRef = useRef(false);
  isPausedRef.current = isPaused;

  const [studentsTable, setStudentsTable] = useState(() => getTable("students"));
  const [teachersTable, setTeachersTable] = useState(() => getTable("teachers"));
  const [resultData, setResultData] = useState([]);
  const [highlightedStudentRow, setHighlightedStudentRow] = useState(-1);
  const [highlightedTeacherRow, setHighlightedTeacherRow] = useState(-1);
  const [parseError, setParseError] = useState(null);
  const [parsedAST, setParsedAST] = useState(null);

  const challenges = useChallenges(CHALLENGES);

  const waitStep = useCallback((ms) =>
    new Promise((resolve) => {
      const scaled = Math.round(ms / speedRef.current);
      const check = () => {
        if (!isPausedRef.current) {
          setTimeout(resolve, scaled);
        } else {
          stepResolveRef.current = resolve;
        }
      };
      check();
    }), []);

  const resetQuery = useCallback(() => {
    setIsPlaying(false);
    setIsPaused(false);
    setIsFinished(false);
    setStep(-1);
    setResultData([]);
    setHighlightedStudentRow(-1);
    setHighlightedTeacherRow(-1);
    setParseError(null);
    setParsedAST(null);
    stepResolveRef.current = null;
  }, []);

  const pauseQuery = useCallback(() => {
    if (!isPlaying || isFinished) return;
    setIsPaused((prev) => {
      const next = !prev;
      isPausedRef.current = next;
      if (!next && stepResolveRef.current) {
        const res = stepResolveRef.current;
        stepResolveRef.current = null;
        res();
      }
      return next;
    });
  }, [isPlaying, isFinished]);

  const stepQuery = useCallback(() => {
    if (stepResolveRef.current) {
      const res = stepResolveRef.current;
      stepResolveRef.current = null;
      res();
    }
  }, []);

  const processQuery = useCallback(async (query) => {
    try {
      const parser = new Parser();
      const astList = parser.astify(query);
      const ast = Array.isArray(astList) ? astList[0] : astList;

      if (ast.type !== "select" || !ast.set_op) {
        throw new Error("Please enter a valid UNION query.");
      }

      setParsedAST(ast);
      setParseError(null);
      setIsPlaying(true);
      setIsPaused(false);
      setIsFinished(false);
      setStep(0);
      setResultData([]);
      setHighlightedStudentRow(-1);
      setHighlightedTeacherRow(-1);

      const leftTable = ast.from[0].table;
      const rightTable = ast._next.from[0].table;
      const leftData = getTable(leftTable);
      const rightData = getTable(rightTable);

      setStudentsTable(leftData);
      setTeachersTable(rightData);

      const isUnionAll = ast.set_op.toUpperCase() === "UNION ALL";

      await waitStep(600);
      setStep(1);

      await waitStep(600);
      setStep(2);

      const leftRows = [];
      for (let i = 0; i < leftData.length; i++) {
        setHighlightedStudentRow(i);
        await waitStep(400);
        const projectedRow = {};
        ast.columns.forEach((col) => {
          if (col.expr.type === "column_ref") {
            projectedRow[col.as || col.expr.column] = leftData[i][col.expr.column];
          }
        });
        leftRows.push(projectedRow);
      }
      setHighlightedStudentRow(-1);

      await waitStep(300);
      setStep(3);

      const rightRows = [];
      for (let i = 0; i < rightData.length; i++) {
        setHighlightedTeacherRow(i);
        await waitStep(400);
        const projectedRow = {};
        ast._next.columns.forEach((col) => {
          if (col.expr.type === "column_ref") {
            projectedRow[col.as || col.expr.column] = rightData[i][col.expr.column];
          }
        });
        rightRows.push(projectedRow);
      }
      setHighlightedTeacherRow(-1);

      await waitStep(300);
      setStep(4);

      let combined = [...leftRows, ...rightRows];
      if (!isUnionAll) {
        const seen = new Set();
        combined = combined.filter((row) => {
          const key = JSON.stringify(row);
          if (seen.has(key)) return false;
          seen.add(key);
          return true;
        });
      }

      for (let i = 0; i < combined.length; i++) {
        setResultData((prev) => [...prev, combined[i]]);
        await waitStep(200);
      }

      await waitStep(600);
      setIsPlaying(false);
      setIsFinished(true);
    } catch (err) {
      setParseError(err.message || "Syntax error in SQL query.");
      setIsPlaying(false);
    }
  }, [waitStep]);

  const runQuery = useCallback(() => {
    if (isPlaying) return;
    processQuery(queryInput);
  }, [isPlaying, queryInput, processQuery]);

  useEffect(() => {
    if (isFinished && resultData.length > 0) {
      challenges.checkAnswer(resultData, parsedAST);
      localStorage.setItem("completed_/union", "true");
      window.dispatchEvent(new Event("completion-change"));
    } else if (!isFinished) {
      challenges.resetChallenge();
    }
  }, [isFinished, resultData]);

  const queryLines = [
    <span key="1"><span className="text-pink-500 font-semibold">SELECT</span> name</span>,
    <span key="2"><span className="text-pink-500 font-semibold">FROM</span> <span className="text-blue-400">students</span></span>,
    <span key="3"><span className="text-pink-500 font-semibold">UNION</span></span>,
    <span key="4"><span className="text-pink-500 font-semibold">SELECT</span> name</span>,
    <span key="5"><span className="text-pink-500 font-semibold">FROM</span> <span className="text-orange-400">teachers</span>;</span>,
  ];

  const activeLineIndex = step === 0 ? 0 : step === 1 ? 1 : step === 2 ? 1 : step === 3 ? 4 : -1;

  return (
    <div className="flex flex-col p-6 md:p-8 max-w-7xl mx-auto gap-8">

      <div className="flex flex-col gap-4">
        <span className="bg-amber-400/10 text-amber-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-400/20 self-start">Step 11 · Intermediate</span>
        <header>
          <h1 className="text-3xl font-bold mb-3 tracking-tight">The UNION Operator</h1>
          <p className="text-muted-foreground text-base max-w-3xl leading-relaxed">
            <code className="mx-1 px-1.5 py-0.5 rounded bg-muted text-foreground border border-border text-sm font-mono">UNION</code> combines the result sets of two or more <code className="text-pink-400 text-xs">SELECT</code> statements into a single result set. It <strong>removes duplicate rows</strong> by default. Use <code className="mx-1 px-1.5 py-0.5 rounded bg-muted text-foreground border border-border text-sm font-mono">UNION ALL</code> if you want to keep duplicates.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="panel p-5 bg-zinc-900/50">
            <h3 className="font-semibold text-sm text-zinc-300 mb-3">The Concept (Set Operation)</h3>
            <p className="text-sm text-zinc-400 leading-relaxed mb-3">
              UNION is a <strong>set operation</strong> that stacks two result sets on top of each other. Both SELECT statements must return the <strong>same number of columns</strong> with compatible data types.
            </p>
            <p className="text-sm text-zinc-400 leading-relaxed">
              By default, UNION performs <strong>deduplication</strong>. It compares rows from both sets and removes any duplicates, similar to how DISTINCT works.
            </p>
          </div>
          <div className="panel p-5 bg-zinc-900/50">
            <h3 className="font-semibold text-sm text-zinc-300 mb-3">UNION vs UNION ALL</h3>
            <div className="flex flex-col gap-2 text-sm text-zinc-400">
              <div className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold mt-0.5">✓</span>
                <span><strong className="text-zinc-300">UNION:</strong> Removes duplicate rows. Slower because it must compare and deduplicate.</span>
              </div>
              <div className="flex items-start gap-2 mt-1">
                <span className="text-blue-400 font-bold mt-0.5">⚡</span>
                <span><strong className="text-zinc-300">UNION ALL:</strong> Keeps all rows including duplicates. Faster with no deduplication needed.</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="h-px w-full bg-border" />
      <div className="flex items-center gap-2 -mb-4">
        <h2 className="text-lg font-bold">Live Execution Trace</h2>
        <span className="px-2 py-0.5 rounded-full bg-accent/10 text-accent text-xs font-semibold">Set Operation Simulation</span>
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
              activeLineIndex={activeLineIndex}
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
              {step === 0 && <div className="text-zinc-300 animate-pulse">Reading your UNION query...</div>}
              {step === 1 && <div className="text-zinc-300 animate-pulse">Loaded left table: <span className="text-blue-400">students</span></div>}
              {step === 2 && (
                <div className="flex flex-col gap-3">
                  <div className="text-accent flex items-center gap-2 animate-pulse">
                    <div className="w-3 h-3 rounded-full border border-accent border-t-transparent animate-spin" />
                    Scanning students...
                  </div>
                  <div className="bg-zinc-900 border border-zinc-800 p-3 rounded">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-300 mb-2">
                      <Layers size={14} className="text-blue-400" /> Collecting from students
                    </div>
                    <div className="text-[11px] text-zinc-500">
                      Row #{highlightedStudentRow + 1} of {studentsTable.length}
                    </div>
                  </div>
                </div>
              )}
              {step === 3 && (
                <div className="flex flex-col gap-3">
                  <div className="text-accent flex items-center gap-2 animate-pulse">
                    <div className="w-3 h-3 rounded-full border border-accent border-t-transparent animate-spin" />
                    Scanning teachers...
                  </div>
                  <div className="bg-zinc-900 border border-zinc-800 p-3 rounded">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-300 mb-2">
                      <Layers size={14} className="text-orange-400" /> Collecting from teachers
                    </div>
                    <div className="text-[11px] text-zinc-500">
                      Row #{highlightedTeacherRow + 1} of {teachersTable.length}
                    </div>
                  </div>
                </div>
              )}
              {step === 4 && (
                <div className="flex flex-col gap-3">
                  <div className="text-accent flex items-center gap-2 animate-pulse">
                    <div className="w-3 h-3 rounded-full border border-accent border-t-transparent animate-spin" />
                    {parsedAST?.set_op?.toUpperCase() === "UNION ALL" ? "Combining results (keeping duplicates)..." : "Combining & deduplicating..."}
                  </div>
                  <div className="bg-zinc-900 border border-zinc-800 p-3 rounded">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-300">
                      <Merge size={14} className="text-accent" /> {parsedAST?.set_op?.toUpperCase() === "UNION ALL" ? "UNION ALL" : "UNION"} in progress
                    </div>
                    <div className="text-[11px] text-zinc-500 mt-1">
                      {resultData.length} rows collected so far
                    </div>
                  </div>
                </div>
              )}
              {isFinished && (
                <div className="text-emerald-400 font-medium flex flex-col gap-1">
                  <div className="flex items-center gap-2"><CheckCircle2 size={16} /> UNION complete!</div>
                  <div className="text-zinc-500 text-xs">{resultData.length} rows in final result set.</div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="col-span-1 lg:col-span-8 flex flex-col gap-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 h-[280px]">
            <Table
              data={studentsTable}
              title="Left: students"
              highlightedRows={highlightedStudentRow !== -1 ? [studentsTable[highlightedStudentRow]?.id || highlightedStudentRow] : []}
              highlightedColumns={["name"]}
            />
            <Table
              data={teachersTable}
              title="Right: teachers"
              highlightedRows={highlightedTeacherRow !== -1 ? [teachersTable[highlightedTeacherRow]?.id || highlightedTeacherRow] : []}
              highlightedColumns={["name"]}
            />
          </div>
          <div className="flex-1 min-h-[280px]">
            {resultData.length > 0 || isFinished ? (
              <Table data={resultData} title={`Result Set: ${parsedAST?.set_op?.toUpperCase() === "UNION ALL" ? "all rows (duplicates kept)" : "unique rows only"}`} highlightedColumns={["name"]} />
            ) : (
              <div className="panel h-full w-full flex items-center justify-center text-zinc-500 font-mono text-sm border-dashed border-2">
                Combined rows will appear here
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
                {(() => {
                  const sNames = getTable("students").map((r) => r.name);
                  const tNames = getTable("teachers").map((r) => r.name);
                  const overlaps = sNames.filter((n) => tNames.includes(n));
                  const overlapText = overlaps.length > 0 ? overlaps.join(" and ") : "none";
                  return parsedAST?.set_op?.toUpperCase() === "UNION ALL"
                    ? `UNION ALL kept all rows including duplicates, ${overlapText} appear twice.`
                    : `UNION automatically removed duplicates, ${overlapText} appeared in both tables but only appear once.`;
                })()} Both SELECT statements must return the same number of columns with compatible types.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between pt-2 border-t border-zinc-800">
        <Link to="/aliases" className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors">← ALIASES</Link>
        <Link to="/playground" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-sm font-medium transition-all hover:scale-[1.02] group">
          Next: Playground <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
