import Table from "../../components/Table";
import Query from "../../components/Query";
import { CheckCircle2, Terminal, Cpu, FolderTree } from "lucide-react";
import { useExecutionEngine } from "../../hooks/useExecutionEngine";

export default function GroupByModule() {
  const {
    isPlaying,
    isFinished,
    step,
    activeTable,
    tableData,
    parsedAST,
    resultSetData,
    runQuery,
    resetQuery
  } = useExecutionEngine("SELECT major, COUNT(*)\nFROM students\nGROUP BY major;");
  
  const queryLines = [
    <span key="1"><span className="text-pink-500 font-semibold">SELECT</span> major, <span className="text-pink-500 font-semibold">COUNT</span>(*)</span>,
    <span key="2"><span className="text-pink-500 font-semibold">FROM</span> <span className="text-blue-400">students</span></span>,
    <span key="3"><span className="text-pink-500 font-semibold">GROUP BY</span> major;</span>
  ];

  return (
    <div className="h-full flex flex-col p-8 max-w-7xl mx-auto gap-8">
      
      <div className="flex-none flex flex-col gap-6 mb-4">
        <header>
          <h1 className="text-3xl font-bold mb-3 tracking-tight">The GROUP BY Clause</h1>
          <p className="text-muted-foreground text-base max-w-3xl leading-relaxed">
            The <code className="mx-1 px-1.5 py-0.5 rounded bg-muted text-foreground border border-border text-sm font-mono">GROUP BY</code> clause fundamentally changes how data is returned. It instructs the engine to collect rows that share the same values in specified columns and compress them into a single row.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="panel p-5 bg-zinc-900/50">
            <h3 className="font-semibold text-sm uppercase tracking-wider text-zinc-400 mb-3">📖 The Concept</h3>
            <p className="text-sm text-zinc-300 leading-relaxed mb-3">
              Imagine sorting physical files into buckets. <code className="text-pink-400 text-xs">GROUP BY</code> creates a bucket for each unique value (e.g., one bucket for 'CS' majors, one for 'Math' majors).
            </p>
            <p className="text-sm text-zinc-300 leading-relaxed">
              Once bucketed, you can use <strong>Aggregate Functions</strong> like <code className="text-pink-400 text-xs">COUNT()</code> or <code className="text-pink-400 text-xs">SUM()</code> to calculate metrics for all the rows inside each bucket.
            </p>
          </div>
          <div className="panel p-5 bg-zinc-900/50">
            <h3 className="font-semibold text-sm uppercase tracking-wider text-zinc-400 mb-3">💻 Syntax Examples</h3>
            <div className="flex flex-col gap-3 font-mono text-[13px]">
              <div className="bg-zinc-950 p-3 rounded border border-border">
                <span className="text-zinc-500 block text-xs mb-1">-- Count students per major</span>
                <span className="text-pink-500">SELECT</span> major, <span className="text-pink-500">COUNT</span>(*) <span className="text-pink-500">FROM</span> <span className="text-blue-400">students</span> <span className="text-pink-500">GROUP BY</span> major;
              </div>
              <div className="bg-zinc-950 p-3 rounded border border-border">
                <span className="text-zinc-500 block text-xs mb-1">-- Find the highest GPA per major</span>
                <span className="text-pink-500">SELECT</span> major, <span className="text-pink-500">MAX</span>(gpa) <span className="text-pink-500">FROM</span> <span className="text-blue-400">students</span> <span className="text-pink-500">GROUP BY</span> major;
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="h-px w-full bg-border my-2"></div>
      
      <div className="flex items-center gap-2 mb-2">
        <h2 className="text-lg font-bold">Execution Trace</h2>
        <span className="px-2 py-0.5 rounded-full bg-accent/10 text-accent text-xs font-semibold">Interactive</span>
      </div>

      <div className="h-[650px] grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="col-span-1 lg:col-span-4 flex flex-col gap-6">
          <div className="h-48 shrink-0">
            <Query 
              queryLines={queryLines} 
              activeLineIndex={
                step === 0 ? 0 : 
                step === 1 ? 1 : 
                step >= 2 && step <= 4 ? 1 : 
                step === 5 ? 2 :
                -1
              } 
              onRun={() => runQuery("SELECT major, COUNT(*)\nFROM students\nGROUP BY major;")}
              onReset={resetQuery}
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
              {step === 1 && <div className="text-foreground animate-pulse">Resolving relation: public.{activeTable}</div>}
              {step >= 2 && step <= 4 && <div className="text-foreground animate-pulse">Table scan complete...</div>}
              
              {step === 5 && (
                <div className="flex flex-col gap-3">
                  <div className="text-accent flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full border border-accent border-t-transparent animate-spin" />
                    Executing Hash Aggregation...
                  </div>
                  <div className="bg-zinc-900 border border-zinc-800 p-3 rounded">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-300">
                       <FolderTree size={14} className="text-accent" /> Grouping by: `{parsedAST?.groupby?.[0]?.column || 'major'}`
                    </div>
                    <div className="text-zinc-500 text-[11px] mt-1">Evaluating aggregate functions...</div>
                  </div>
                </div>
              )}
              
              {step >= 6 && (
                <div className="text-success font-medium flex flex-col gap-1">
                  <div className="flex items-center gap-2"><CheckCircle2 size={16} /> Aggregation complete</div>
                  <div className="text-zinc-500 text-xs mt-1">Collapsed into {resultSetData.length} buckets.</div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="col-span-1 lg:col-span-8 flex flex-col h-full overflow-hidden gap-6">
          <div className="flex-1 overflow-hidden min-h-[250px]">
            <Table 
              data={tableData} 
              title={`Source: public.${activeTable} (Raw Rows)`} 
              highlightedColumns={step >= 5 ? ["major"] : []}
            />
          </div>
          <div className="flex-1 overflow-hidden min-h-[250px]">
            {resultSetData.length > 0 || step >= 6 ? (
              <Table 
                data={resultSetData} 
                title="Result Set (Aggregated Buckets)" 
                highlightedColumns={step >= 5 ? ["major", "COUNT(*)"] : []}
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
