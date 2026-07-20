import { useState, useEffect } from "react";
import Table from "../../components/Table";
import Query from "../../components/Query";
import studentsData from "../../data/students.json";
import { CheckCircle2, XCircle, Terminal, Cpu } from "lucide-react";

export default function WhereModule() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [step, setStep] = useState(-1);
  const [currentRowIdx, setCurrentRowIdx] = useState(-1);
  const [highlightedRows, setHighlightedRows] = useState([]);
  const [checkingCondition, setCheckingCondition] = useState(false);
  const [resultSetData, setResultSetData] = useState([]);
  
  const queryLines = [
    <span key="1"><span className="text-pink-500 font-semibold">SELECT</span> *</span>,
    <span key="2"><span className="text-pink-500 font-semibold">FROM</span> <span className="text-blue-400">students</span></span>,
    <span key="3"><span className="text-pink-500 font-semibold">WHERE</span> age <span className="text-orange-400">&gt; 20</span>;</span>
  ];

  const handleRun = () => {
    if (isPlaying || isFinished) return;
    setIsPlaying(true);
    setStep(0);
    setCurrentRowIdx(-1);
    setHighlightedRows([]);
    setResultSetData([]);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setIsFinished(false);
    setStep(-1);
    setCurrentRowIdx(-1);
    setHighlightedRows([]);
    setResultSetData([]);
    setCheckingCondition(false);
  };

  useEffect(() => {
    if (!isPlaying) return;

    let timeout;
    
    // Snappy SaaS timings
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
      if (currentRowIdx < studentsData.length) {
        const student = studentsData[currentRowIdx];
        setCheckingCondition(true);
        
        timeout = setTimeout(() => {
          setCheckingCondition(false);
          if (student.age > 20) {
            setHighlightedRows(prev => [...prev, student.id]);
            setResultSetData(prev => [...prev, student]);
          }
          
          timeout = setTimeout(() => {
            setCurrentRowIdx(prev => prev + 1);
          }, 300); // Faster iteration between rows
        }, 600); // Quick condition check
      } else {
        setCurrentRowIdx(-1);
        setStep(5);
      }
    } else if (step === 5) {
      setIsPlaying(false);
      setIsFinished(true);
    }

    return () => clearTimeout(timeout);
  }, [isPlaying, step, currentRowIdx]);

  return (
    <div className="h-full flex flex-col p-8 max-w-7xl mx-auto gap-8">
      <header className="flex-none">
        <h1 className="text-2xl font-bold mb-2 tracking-tight">The WHERE Clause</h1>
        <p className="text-muted-foreground text-sm max-w-3xl leading-relaxed">
          The execution engine evaluates the boolean expression in the <code>WHERE</code> clause against every row in the target relation. Rows evaluating to <code>TRUE</code> are included in the result set.
        </p>
      </header>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 min-h-0">
        <div className="col-span-1 lg:col-span-4 flex flex-col gap-6">
          <div className="h-48 shrink-0">
            <Query 
              queryLines={queryLines} 
              activeLineIndex={
                step === 0 ? 0 : 
                step === 1 ? 1 : 
                step >= 2 && step <= 4 ? 2 : 
                -1
              } 
              onRun={handleRun}
              onReset={handleReset}
              isPlaying={isPlaying}
              isFinished={isFinished}
            />
          </div>
          
          <div className="panel p-4 flex flex-col gap-4">
            <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2 border-b border-border pb-2">
              <Cpu size={14} /> Evaluation Engine
            </div>
            
            <div className="h-32 flex flex-col justify-center font-mono text-[13px]">
              {step === -1 && <div className="text-zinc-500 text-center">Idle</div>}
              {step === 0 && <div className="text-foreground animate-pulse">AST Parsing: SELECT...</div>}
              {step === 1 && <div className="text-foreground animate-pulse">Resolving relation: public.students</div>}
              {step === 2 && <div className="text-foreground animate-pulse">Preparing filter condition...</div>}
              
              {step === 4 && currentRowIdx >= 0 && currentRowIdx < studentsData.length && (
                <div className="flex flex-col gap-3">
                  <div className="text-zinc-400">
                    Eval Row <span className="text-foreground font-semibold">#{currentRowIdx + 1}</span>
                  </div>
                  
                  <div className="bg-zinc-900 border border-zinc-800 p-3 rounded">
                    <div className="flex justify-between mb-2">
                      <span className="text-zinc-500">var_age:</span>
                      <span className="text-zinc-200">{studentsData[currentRowIdx].age}</span>
                    </div>
                    
                    {checkingCondition ? (
                      <div className="flex items-center gap-2 text-accent text-xs">
                        <div className="w-3 h-3 rounded-full border border-accent border-t-transparent animate-spin" />
                        Evaluating: {studentsData[currentRowIdx].age} &gt; 20
                      </div>
                    ) : (
                      <div className={`flex items-center gap-1.5 text-xs font-semibold ${studentsData[currentRowIdx].age > 20 ? 'text-success' : 'text-zinc-500'}`}>
                        {studentsData[currentRowIdx].age > 20 ? (
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
                  <div className="flex items-center gap-2"><CheckCircle2 size={16} /> Filter pass complete</div>
                  <div className="text-zinc-500 text-xs mt-1">Returned {highlightedRows.length} rows.</div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="col-span-1 lg:col-span-8 flex flex-col h-full overflow-hidden gap-6">
          <div className="flex-1 overflow-hidden min-h-[250px]">
            <Table 
              data={studentsData} 
              title="Source: public.students" 
              highlightedRows={
                step === 4 && checkingCondition 
                  ? [studentsData[currentRowIdx]?.id]
                  : []
              }
              highlightedColumns={step >= 2 ? ["age"] : []}
            />
          </div>
          <div className="flex-1 overflow-hidden min-h-[250px]">
            {resultSetData.length > 0 || step === 5 ? (
              <Table 
                data={resultSetData} 
                title="Result Set" 
                highlightedColumns={step >= 2 ? ["age"] : []}
              />
            ) : (
              <div className="panel h-full w-full flex items-center justify-center text-zinc-500 font-mono text-sm border-dashed border-2">
                Awaiting Execution...
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
