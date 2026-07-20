import { useState, useEffect } from "react";
import Table from "../../components/Table";
import Query from "../../components/Query";
import studentsData from "../../data/students.json";
import { CheckCircle2 } from "lucide-react";

export default function SelectModule() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [step, setStep] = useState(-1);
  const [highlightedRows, setHighlightedRows] = useState([]);
  
  const queryLines = [
    <span key="1"><span className="text-pink-500">SELECT</span> *</span>,
    <span key="2"><span className="text-pink-500">FROM</span> students;</span>
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
  };

  useEffect(() => {
    if (!isPlaying) return;

    let timeout;
    
    if (step === 0) {
      // Step 0: Highlight "SELECT *" line
      timeout = setTimeout(() => {
        setStep(1);
      }, 1500);
    } else if (step === 1) {
      // Step 1: Highlight "FROM students" line
      timeout = setTimeout(() => {
        setStep(2);
      }, 1500);
    } else if (step === 2) {
      // Step 2: Highlight all rows one by one rapidly
      let rowIdx = 0;
      const interval = setInterval(() => {
        if (rowIdx < studentsData.length) {
          const currentId = studentsData[rowIdx].id;
          setHighlightedRows(prev => [...prev, currentId]);
          rowIdx++;
        } else {
          clearInterval(interval);
          timeout = setTimeout(() => {
            setStep(3);
          }, 1000);
        }
      }, 200);
      return () => clearInterval(interval);
    } else if (step === 3) {
      // Finish
      setIsPlaying(false);
      setIsFinished(true);
    }

    return () => clearTimeout(timeout);
  }, [isPlaying, step]);

  return (
    <div className="h-full flex flex-col p-6 max-w-7xl mx-auto gap-6">
      <header className="flex-none">
        <h1 className="text-3xl font-display font-bold mb-2">The SELECT Statement</h1>
        <p className="text-muted-foreground text-lg">
          The most basic SQL command. It tells the database what data you want to retrieve.
          <code className="mx-2 text-sm">SELECT *</code> means "select all columns".
        </p>
      </header>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-0">
        <div className="col-span-1 lg:col-span-4 flex flex-col">
          <Query 
            queryLines={queryLines} 
            activeLineIndex={step === 0 ? 0 : step === 1 ? 1 : step >= 2 ? 0 : -1} 
            onRun={handleRun}
            onReset={handleReset}
            isPlaying={isPlaying}
            isFinished={isFinished}
          />
        </div>
        
        <div className="col-span-1 lg:col-span-8 flex flex-col gap-6">
          <div className="flex-1 overflow-hidden relative flex flex-col">
            <div className="absolute top-4 right-4 z-20 transition-all duration-500">
              {isFinished && (
                <div className="glass-panel px-4 py-2 rounded-full flex items-center gap-2 text-green-400 border-green-500/20 bg-green-500/10">
                  <CheckCircle2 size={18} />
                  <span className="font-medium text-sm">Result Set Returned</span>
                </div>
              )}
            </div>
            
            <div className="flex-1">
              <Table 
                data={studentsData} 
                title="students" 
                highlightedRows={highlightedRows}
              />
            </div>
            
            <div className="h-32 mt-4 glass-panel rounded-xl p-6 border border-border flex items-center justify-center text-center">
              {step === -1 && <p className="text-muted-foreground font-medium">Click <strong className="text-foreground">Run Animation</strong> to see how the database processes this query.</p>}
              {step === 0 && <p className="text-primary font-medium text-lg animate-pulse">Parsing SELECT command...</p>}
              {step === 1 && <p className="text-primary font-medium text-lg animate-pulse">Locating table 'students'...</p>}
              {step === 2 && <p className="text-accent-purple font-medium text-lg animate-pulse">Selecting all rows matching criteria...</p>}
              {step === 3 && <p className="text-green-400 font-medium text-lg">Query executed successfully! {studentsData.length} rows returned.</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
