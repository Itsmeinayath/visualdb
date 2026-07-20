import { useState, useEffect } from "react";
import Table from "../../components/Table";
import Query from "../../components/Query";
import studentsData from "../../data/students.json";
import { CheckCircle2, Terminal } from "lucide-react";

export default function SelectModule() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [step, setStep] = useState(-1);
  const [highlightedRows, setHighlightedRows] = useState([]);
  const [resultSetData, setResultSetData] = useState([]);
  
  const queryLines = [
    <span key="1"><span className="text-pink-500 font-semibold">SELECT</span> *</span>,
    <span key="2"><span className="text-pink-500 font-semibold">FROM</span> <span className="text-blue-400">students</span>;</span>
  ];

  const handleRun = () => {
    if (isPlaying || isFinished) return;
    setIsPlaying(true);
    setStep(0);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setIsFinished(false);
    setStep(-1);
    setHighlightedRows([]);
    setResultSetData([]);
  };

  useEffect(() => {
    if (!isPlaying) return;

    let timeout;
    
    // Snappy timings
    if (step === 0) {
      timeout = setTimeout(() => setStep(1), 800);
    } else if (step === 1) {
      timeout = setTimeout(() => setStep(2), 800);
    } else if (step === 2) {
      let rowIdx = 0;
      const interval = setInterval(() => {
        if (rowIdx < studentsData.length) {
          const student = studentsData[rowIdx];
          setHighlightedRows([student.id]);
          setResultSetData(prev => [...prev, student]);
          rowIdx++;
        } else {
          clearInterval(interval);
          timeout = setTimeout(() => setStep(3), 500);
        }
      }, 100);
      return () => clearInterval(interval);
    } else if (step === 3) {
      setIsPlaying(false);
      setIsFinished(true);
    }

    return () => clearTimeout(timeout);
  }, [isPlaying, step]);

  return (
    <div className="h-full flex flex-col p-8 max-w-7xl mx-auto gap-8">
      <header className="flex-none">
        <h1 className="text-2xl font-bold mb-2 tracking-tight">The SELECT Statement</h1>
        <p className="text-muted-foreground text-sm max-w-3xl leading-relaxed">
          The foundation of SQL. It instructs the execution engine on which data columns to retrieve from a target table.
          <code className="mx-1 px-1.5 py-0.5 rounded bg-muted text-foreground border border-border text-xs font-mono">SELECT *</code> instructs the engine to return all available columns.
        </p>
      </header>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 min-h-0">
        <div className="col-span-1 lg:col-span-4 flex flex-col gap-6">
          <div className="h-48">
            <Query 
              queryLines={queryLines} 
              activeLineIndex={step === 0 ? 0 : step === 1 ? 1 : step >= 2 ? 0 : -1} 
              onRun={handleRun}
              onReset={handleReset}
              isPlaying={isPlaying}
              isFinished={isFinished}
            />
          </div>
          
          <div className="panel p-4 flex flex-col gap-2">
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
              <Terminal size={14} /> Execution Log
            </div>
            <div className="font-mono text-[13px] h-20 overflow-y-auto flex flex-col justify-end">
              {step === -1 && <div className="text-muted-foreground">Ready. Awaiting execution.</div>}
              {step >= 0 && <div className="text-foreground">↳ Parsing SELECT statement...</div>}
              {step >= 1 && <div className="text-foreground">↳ Locating table relation 'students'...</div>}
              {step >= 2 && <div className="text-accent">↳ Iterating over table rows...</div>}
              {step === 3 && <div className="text-success font-medium flex items-center gap-1 mt-1"><CheckCircle2 size={14} /> Query executed successfully. {studentsData.length} rows returned.</div>}
            </div>
          </div>
        </div>
        
        <div className="col-span-1 lg:col-span-8 flex flex-col h-full overflow-hidden gap-6">
          <div className="flex-1 overflow-hidden min-h-[250px]">
            <Table 
              data={studentsData} 
              title="Source: public.students" 
              highlightedRows={step === 2 ? highlightedRows : []}
            />
          </div>
          <div className="flex-1 overflow-hidden min-h-[250px]">
            {resultSetData.length > 0 || step === 3 ? (
              <Table 
                data={resultSetData} 
                title="Result Set" 
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
