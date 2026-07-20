import { useState, useEffect } from "react";
import Table from "../../components/Table";
import Query from "../../components/Query";
import studentsData from "../../data/students.json";
import { CheckCircle2, XCircle } from "lucide-react";

export default function WhereModule() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [step, setStep] = useState(-1);
  const [currentRowIdx, setCurrentRowIdx] = useState(-1);
  const [highlightedRows, setHighlightedRows] = useState([]);
  const [discardedRows, setDiscardedRows] = useState([]);
  const [checkingCondition, setCheckingCondition] = useState(false);
  
  const queryLines = [
    <span key="1"><span className="text-pink-500">SELECT</span> *</span>,
    <span key="2"><span className="text-pink-500">FROM</span> students</span>,
    <span key="3"><span className="text-pink-500">WHERE</span> age <span className="text-blue-400">&gt; 20</span>;</span>
  ];

  const handleRun = () => {
    if (isPlaying || isFinished) return;
    setIsPlaying(true);
    setStep(0);
    setCurrentRowIdx(-1);
    setHighlightedRows([]);
    setDiscardedRows([]);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setIsFinished(false);
    setStep(-1);
    setCurrentRowIdx(-1);
    setHighlightedRows([]);
    setDiscardedRows([]);
    setCheckingCondition(false);
  };

  useEffect(() => {
    if (!isPlaying) return;

    let timeout;
    
    if (step === 0) {
      timeout = setTimeout(() => setStep(1), 1000);
    } else if (step === 1) {
      timeout = setTimeout(() => setStep(2), 1000);
    } else if (step === 2) {
      timeout = setTimeout(() => setStep(3), 1000);
    } else if (step === 3) {
      // Begin row iteration
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
          } else {
            setDiscardedRows(prev => [...prev, student.id]);
          }
          
          timeout = setTimeout(() => {
            setCurrentRowIdx(prev => prev + 1);
          }, 800); // Wait before next row
        }, 1200); // Time spent "checking"
      } else {
        // Finished all rows
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
    <div className="h-full flex flex-col p-6 max-w-7xl mx-auto gap-6">
      <header className="flex-none">
        <h1 className="text-3xl font-display font-bold mb-2">The WHERE Clause</h1>
        <p className="text-muted-foreground text-lg">
          Filter records that meet specific conditions. Watch how the database checks 
          <strong> every single row </strong> to decide if it should be included.
        </p>
      </header>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-0">
        <div className="col-span-1 lg:col-span-4 flex flex-col gap-6">
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
          
          <div className="glass-panel p-6 rounded-xl border border-border h-48 flex flex-col justify-center items-center text-center transition-all">
            {step === -1 && <p className="text-muted-foreground">Click Run Animation to start.</p>}
            {step === 0 && <p className="text-primary animate-pulse font-medium">Parsing SELECT...</p>}
            {step === 1 && <p className="text-primary animate-pulse font-medium">Identifying table...</p>}
            {step === 2 && <p className="text-accent-purple font-medium">Applying WHERE filter...</p>}
            
            {step === 4 && currentRowIdx >= 0 && currentRowIdx < studentsData.length && (
              <div className="flex flex-col items-center gap-4 w-full">
                <div className="text-sm text-muted-foreground uppercase tracking-widest font-bold">
                  Evaluating Row {currentRowIdx + 1}
                </div>
                
                <div className="bg-black/20 p-4 rounded-lg border border-white/5 w-full">
                  <div className="font-mono text-lg mb-2">
                    <span className="text-muted-foreground">age: </span>
                    <span className="text-white">{studentsData[currentRowIdx].age}</span>
                  </div>
                  
                  {checkingCondition ? (
                    <div className="flex items-center justify-center gap-2 text-accent-purple animate-pulse">
                      <div className="w-4 h-4 rounded-full border-2 border-accent-purple border-t-transparent animate-spin" />
                      Checking if {studentsData[currentRowIdx].age} &gt; 20
                    </div>
                  ) : (
                    <div className={`flex items-center justify-center gap-2 font-bold ${studentsData[currentRowIdx].age > 20 ? 'text-green-500' : 'text-red-500'}`}>
                      {studentsData[currentRowIdx].age > 20 ? (
                         <>
                           <CheckCircle2 size={20} />
                           Condition TRUE (Keep)
                         </>
                      ) : (
                         <>
                           <XCircle size={20} />
                           Condition FALSE (Discard)
                         </>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {step === 5 && (
              <div className="text-green-400 font-bold text-xl flex items-center gap-2">
                <CheckCircle2 /> Filtering Complete
              </div>
            )}
          </div>
        </div>
        
        <div className="col-span-1 lg:col-span-8 flex flex-col gap-6 relative">
          {/* We show the table and manually add an overlay/border to the row being evaluated */}
          <div className="flex-1">
            <Table 
              data={studentsData} 
              title="students" 
              highlightedRows={
                step === 4 && checkingCondition 
                  ? [...highlightedRows, studentsData[currentRowIdx]?.id] // highlight current while checking
                  : highlightedRows
              }
              discardedRows={discardedRows}
              highlightedColumns={step >= 2 ? ["age"] : []}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
