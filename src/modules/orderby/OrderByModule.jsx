import Table from "../../components/Table";
import Query from "../../components/Query";
import { CheckCircle2, Terminal, Cpu, ArrowDownAZ } from "lucide-react";
import { useExecutionEngine } from "../../hooks/useExecutionEngine";

export default function OrderByModule() {
  const {
    isPlaying,
    isFinished,
    step,
    currentRowIdx,
    activeTable,
    tableData,
    parsedAST,
    resultSetData,
    runQuery,
    resetQuery
  } = useExecutionEngine("SELECT *\nFROM students\nORDER BY gpa DESC;");
  
  const queryLines = [
    <span key="1"><span className="text-pink-500 font-semibold">SELECT</span> *</span>,
    <span key="2"><span className="text-pink-500 font-semibold">FROM</span> <span className="text-blue-400">students</span></span>,
    <span key="3"><span className="text-pink-500 font-semibold">ORDER BY</span> gpa <span className="text-pink-500 font-semibold">DESC</span>;</span>
  ];

  return (
    <div className="h-full flex flex-col p-8 max-w-7xl mx-auto gap-8">
      
      {/* Educational Content Section */}
      <div className="flex-none flex flex-col gap-6 mb-4">
        <header>
          <h1 className="text-3xl font-bold mb-3 tracking-tight">The ORDER BY Clause</h1>
          <p className="text-muted-foreground text-base max-w-3xl leading-relaxed">
            Relational databases do not guarantee the order of rows. To sort your data, you must explicitly use the <code className="mx-1 px-1.5 py-0.5 rounded bg-muted text-foreground border border-border text-sm font-mono">ORDER BY</code> clause.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="panel p-5 bg-zinc-900/50">
            <h3 className="font-semibold text-sm uppercase tracking-wider text-zinc-400 mb-3">📖 The Concept</h3>
            <p className="text-sm text-zinc-300 leading-relaxed mb-3">
              When evaluating <code className="text-pink-400 text-xs">ORDER BY</code>, the database engine must scan the table and place the rows into a temporary <strong>Sort Buffer</strong> in memory.
            </p>
            <p className="text-sm text-zinc-300 leading-relaxed">
              It sorts the rows based on the column you specify in either Ascending (<code className="text-pink-400 text-xs">ASC</code>) or Descending (<code className="text-pink-400 text-xs">DESC</code>) order before returning the final Result Set.
            </p>
          </div>
          <div className="panel p-5 bg-zinc-900/50">
            <h3 className="font-semibold text-sm uppercase tracking-wider text-zinc-400 mb-3">💻 Syntax Examples</h3>
            <div className="flex flex-col gap-3 font-mono text-[13px]">
              <div className="bg-zinc-950 p-3 rounded border border-border">
                <span className="text-zinc-500 block text-xs mb-1">-- Sort lowest to highest (Default is ASC)</span>
                <span className="text-pink-500">SELECT</span> * <span className="text-pink-500">FROM</span> <span className="text-blue-400">students</span> <span className="text-pink-500">ORDER BY</span> age;
              </div>
              <div className="bg-zinc-950 p-3 rounded border border-border">
                <span className="text-zinc-500 block text-xs mb-1">-- Sort highest to lowest</span>
                <span className="text-pink-500">SELECT</span> * <span className="text-pink-500">FROM</span> <span className="text-blue-400">students</span> <span className="text-pink-500">ORDER BY</span> gpa <span className="text-pink-500">DESC</span>;
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
                step >= 2 && step <= 4 ? 2 : 
                -1
              } 
              onRun={() => runQuery("SELECT *\nFROM students\nORDER BY gpa DESC;")}
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
              {step === 2 && <div className="text-foreground animate-pulse">Table scan complete...</div>}
              
              {step === 4 && (
                <div className="flex flex-col gap-3">
                  <div className="text-accent flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full border border-accent border-t-transparent animate-spin" />
                    Allocating Sort Buffer...
                  </div>
                  <div className="bg-zinc-900 border border-zinc-800 p-3 rounded">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-300">
                       <ArrowDownAZ size={14} className="text-accent" /> Target Column: `gpa`
                    </div>
                    <div className="text-zinc-500 text-[11px] mt-1">Applying Sort ({parsedAST?.orderby?.[0]?.type || "DESC"})...</div>
                  </div>
                </div>
              )}
              
              {step >= 5 && (
                <div className="text-success font-medium flex flex-col gap-1">
                  <div className="flex items-center gap-2"><CheckCircle2 size={16} /> Sort operation complete</div>
                  <div className="text-zinc-500 text-xs mt-1">Generating sorted Result Set...</div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="col-span-1 lg:col-span-8 flex flex-col h-full overflow-hidden gap-6">
          <div className="flex-1 overflow-hidden min-h-[250px]">
            <Table 
              data={tableData} 
              title={`Source: public.${activeTable} (Unsorted)`} 
              highlightedColumns={step >= 4 ? ["gpa"] : []}
            />
          </div>
          <div className="flex-1 overflow-hidden min-h-[250px]">
            {resultSetData.length > 0 || step === 5 ? (
              <Table 
                data={resultSetData} 
                title="Result Set (Sorted by GPA DESC)" 
                highlightedColumns={step >= 4 ? ["gpa"] : []}
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
