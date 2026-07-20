import { useState, useEffect } from "react";
import { Parser } from "node-sql-parser";
import Table from "../../components/Table";
import { CheckCircle2, XCircle, Terminal, Cpu, Play } from "lucide-react";
import { cn } from "../../utils/cn";

// Load dummy data
import studentsData from "../../data/students.json";
import employeesData from "../../data/employees.json";
import ordersData from "../../data/orders.json";

const DB = {
  students: studentsData,
  employees: employeesData,
  orders: ordersData,
};

// Very basic AST Evaluator for WHERE clause
const evaluateCondition = (ast, row) => {
  if (!ast) return true;
  
  if (ast.type === 'binary_expr') {
    const leftVal = ast.left.type === 'column_ref' ? row[ast.left.column] : ast.left.value;
    const rightVal = ast.right.type === 'column_ref' ? row[ast.right.column] : ast.right.value;
    
    switch (ast.operator) {
      case '=': return leftVal == rightVal;
      case '!=': return leftVal != rightVal;
      case '>': return leftVal > rightVal;
      case '<': return leftVal < rightVal;
      case '>=': return leftVal >= rightVal;
      case '<=': return leftVal <= rightVal;
      case 'AND': return evaluateCondition(ast.left, row) && evaluateCondition(ast.right, row);
      case 'OR': return evaluateCondition(ast.left, row) || evaluateCondition(ast.right, row);
      default: return true;
    }
  }
  return true;
};

export default function PlaygroundModule() {
  const [queryInput, setQueryInput] = useState("SELECT *\nFROM students\nWHERE age > 20;");
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [step, setStep] = useState(-1);
  const [currentRowIdx, setCurrentRowIdx] = useState(-1);
  
  const [activeTable, setActiveTable] = useState("students");
  const [tableData, setTableData] = useState(studentsData);
  const [parsedAST, setParsedAST] = useState(null);
  const [parseError, setParseError] = useState(null);
  
  const [highlightedRows, setHighlightedRows] = useState([]);
  const [discardedRows, setDiscardedRows] = useState([]);
  const [checkingCondition, setCheckingCondition] = useState(false);

  const handleRun = () => {
    if (isPlaying) return;
    
    try {
      const parser = new Parser();
      const astList = parser.astify(queryInput);
      const ast = Array.isArray(astList) ? astList[0] : astList;
      
      if (ast.type !== 'select') {
        throw new Error("Only SELECT queries are supported right now.");
      }
      
      const tableName = ast.from[0].table;
      if (!DB[tableName]) {
        throw new Error(`Table '${tableName}' does not exist. Try 'students', 'employees', or 'orders'.`);
      }

      setParsedAST(ast);
      setActiveTable(tableName);
      setTableData(DB[tableName]);
      setParseError(null);
      
      // Start Animation
      setIsPlaying(true);
      setIsFinished(false);
      setStep(0);
      setCurrentRowIdx(-1);
      setHighlightedRows([]);
      setDiscardedRows([]);
      
    } catch (err) {
      setParseError(err.message || "Syntax error in SQL query.");
    }
  };

  useEffect(() => {
    if (!isPlaying || !parsedAST) return;

    let timeout;
    if (step === 0) {
      timeout = setTimeout(() => setStep(1), 600);
    } else if (step === 1) {
      timeout = setTimeout(() => setStep(2), 600);
    } else if (step === 2) {
      timeout = setTimeout(() => setStep(3), 600);
    } else if (step === 3) {
      setCurrentRowIdx(0);
      setStep(4);
    } else if (step === 4) {
      if (currentRowIdx < tableData.length) {
        const row = tableData[currentRowIdx];
        setCheckingCondition(true);
        
        timeout = setTimeout(() => {
          setCheckingCondition(false);
          const isMatch = parsedAST.where ? evaluateCondition(parsedAST.where, row) : true;
          
          if (isMatch) {
            setHighlightedRows(prev => [...prev, row.id || row.order_id || currentRowIdx]);
          } else {
            setDiscardedRows(prev => [...prev, row.id || row.order_id || currentRowIdx]);
          }
          
          timeout = setTimeout(() => {
            setCurrentRowIdx(prev => prev + 1);
          }, 300); 
        }, 600); 
      } else {
        setCurrentRowIdx(-1);
        setStep(5);
      }
    } else if (step === 5) {
      setIsPlaying(false);
      setIsFinished(true);
    }

    return () => clearTimeout(timeout);
  }, [isPlaying, step, currentRowIdx, parsedAST, tableData]);

  return (
    <div className="h-full flex flex-col p-8 max-w-7xl mx-auto gap-8">
      <header className="flex-none">
        <h1 className="text-2xl font-bold mb-2 tracking-tight">Playground</h1>
        <p className="text-muted-foreground text-sm max-w-3xl leading-relaxed">
          Write your own queries and see how the execution engine processes them. 
          Available tables: <code>students</code>, <code>employees</code>, <code>orders</code>.
        </p>
      </header>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 min-h-0">
        <div className="col-span-1 lg:col-span-4 flex flex-col gap-6">
          <div className="panel overflow-hidden flex flex-col border border-border h-48 shrink-0 relative">
            <div className="bg-zinc-950 px-3 py-2 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Terminal size={14} className="text-zinc-500" />
                <span className="text-xs font-mono text-zinc-400">custom_query.sql</span>
              </div>
              <button
                onClick={handleRun}
                disabled={isPlaying}
                className="flex items-center gap-1.5 px-3 py-1 rounded bg-accent text-white text-[11px] font-medium transition-all hover:bg-accent/90 disabled:opacity-50"
              >
                <Play size={12} fill="currentColor" />
                Run
              </button>
            </div>
            
            <textarea
              value={queryInput}
              onChange={(e) => setQueryInput(e.target.value)}
              disabled={isPlaying}
              className="bg-zinc-950 flex-1 p-4 font-mono text-[13px] leading-relaxed text-zinc-300 resize-none outline-none focus:ring-1 focus:ring-accent/50 disabled:opacity-50"
              spellCheck="false"
            />
            
            {parseError && (
              <div className="absolute bottom-0 left-0 right-0 bg-red-500/10 border-t border-red-500/20 text-red-400 text-xs p-2 font-mono truncate">
                {parseError}
              </div>
            )}
          </div>
          
          <div className="panel p-4 flex flex-col gap-4">
            <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2 border-b border-border pb-2">
              <Cpu size={14} /> Execution Engine
            </div>
            
            <div className="h-40 flex flex-col justify-center font-mono text-[13px]">
              {step === -1 && <div className="text-zinc-500 text-center">Awaiting execution...</div>}
              {step === 0 && <div className="text-foreground animate-pulse">AST Parsing successful...</div>}
              {step === 1 && <div className="text-foreground animate-pulse">Resolving relation: public.{activeTable}</div>}
              {step === 2 && <div className="text-foreground animate-pulse">{parsedAST?.where ? 'Preparing filter conditions...' : 'No filter conditions. Fetching all...'}</div>}
              
              {step === 4 && currentRowIdx >= 0 && currentRowIdx < tableData.length && (
                <div className="flex flex-col gap-3">
                  <div className="text-zinc-400">
                    Eval Row <span className="text-foreground font-semibold">#{currentRowIdx + 1}</span>
                  </div>
                  
                  <div className="bg-zinc-900 border border-zinc-800 p-3 rounded">
                    {checkingCondition ? (
                      <div className="flex items-center gap-2 text-accent text-xs">
                        <div className="w-3 h-3 rounded-full border border-accent border-t-transparent animate-spin" />
                        Evaluating...
                      </div>
                    ) : (
                      <div className={`flex items-center gap-1.5 text-xs font-semibold ${highlightedRows.includes(tableData[currentRowIdx].id || tableData[currentRowIdx].order_id || currentRowIdx) ? 'text-success' : 'text-zinc-500'}`}>
                        {highlightedRows.includes(tableData[currentRowIdx].id || tableData[currentRowIdx].order_id || currentRowIdx) ? (
                           <>
                             <CheckCircle2 size={14} /> Condition TRUE
                           </>
                        ) : (
                           <>
                             <XCircle size={14} /> Condition FALSE
                           </>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {step === 5 && (
                <div className="text-success font-medium flex flex-col gap-1">
                  <div className="flex items-center gap-2"><CheckCircle2 size={16} /> Execution complete</div>
                  <div className="text-zinc-500 text-xs mt-1">Returned {highlightedRows.length} rows.</div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="col-span-1 lg:col-span-8 flex flex-col h-full overflow-hidden">
          <Table 
            data={tableData} 
            title={`public.${activeTable}`} 
            highlightedRows={
              step === 4 && checkingCondition 
                ? [...highlightedRows, tableData[currentRowIdx]?.id || tableData[currentRowIdx]?.order_id || currentRowIdx]
                : highlightedRows
            }
            discardedRows={discardedRows}
          />
        </div>
      </div>
    </div>
  );
}
