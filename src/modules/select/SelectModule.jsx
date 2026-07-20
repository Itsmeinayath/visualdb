import Table from "../../components/Table";
import Query from "../../components/Query";
import { CheckCircle2, Terminal } from "lucide-react";
import { useExecutionEngine } from "../../hooks/useExecutionEngine";

export default function SelectModule() {
  const {
    isPlaying,
    isFinished,
    step,
    currentRowIdx,
    activeTable,
    tableData,
    highlightedRows,
    checkingCondition,
    resultSetData,
    runQuery,
    resetQuery
  } = useExecutionEngine("SELECT *\nFROM students;");
  
  const queryLines = [
    <span key="1"><span className="text-pink-500 font-semibold">SELECT</span> *</span>,
    <span key="2"><span className="text-pink-500 font-semibold">FROM</span> <span className="text-blue-400">students</span>;</span>
  ];

  return (
    <div className="h-full flex flex-col p-8 max-w-7xl mx-auto gap-8">
      <div className="flex-none flex flex-col gap-6 mb-4">
        <header>
          <h1 className="text-3xl font-bold mb-3 tracking-tight">The SELECT Statement</h1>
          <p className="text-muted-foreground text-base max-w-3xl leading-relaxed">
            The foundation of all SQL queries. The <code className="mx-1 px-1.5 py-0.5 rounded bg-muted text-foreground border border-border text-sm font-mono">SELECT</code> statement instructs the execution engine to retrieve data from a database and return it as a result set.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="panel p-5 bg-zinc-900/50">
            <h3 className="font-semibold text-sm uppercase tracking-wider text-zinc-400 mb-3">📖 The Concept</h3>
            <p className="text-sm text-zinc-300 leading-relaxed mb-3">
              Think of <code className="text-pink-400 text-xs">SELECT</code> as telling the database exactly <strong>which columns</strong> of data you want to see. The <code className="text-pink-400 text-xs">FROM</code> clause tells the database <strong>which table</strong> those columns live in.
            </p>
            <p className="text-sm text-zinc-300 leading-relaxed">
              If you want to return every single column in the table without writing them all out, you use the asterisk <code className="text-accent text-xs">*</code> (pronounced "star").
            </p>
          </div>
          <div className="panel p-5 bg-zinc-900/50">
            <h3 className="font-semibold text-sm uppercase tracking-wider text-zinc-400 mb-3">💻 Syntax Examples</h3>
            <div className="flex flex-col gap-3 font-mono text-[13px]">
              <div className="bg-zinc-950 p-3 rounded border border-border">
                <span className="text-zinc-500 block text-xs mb-1">-- Return all columns</span>
                <span className="text-pink-500">SELECT</span> * <span className="text-pink-500">FROM</span> <span className="text-blue-400">students</span>;
              </div>
              <div className="bg-zinc-950 p-3 rounded border border-border">
                <span className="text-zinc-500 block text-xs mb-1">-- Return specific columns</span>
                <span className="text-pink-500">SELECT</span> name, age <span className="text-pink-500">FROM</span> <span className="text-blue-400">students</span>;
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
          <div className="h-48">
            <Query 
              queryLines={queryLines} 
              activeLineIndex={step === 0 ? 0 : step === 1 ? 1 : step >= 2 ? 0 : -1} 
              onRun={() => runQuery("SELECT *\nFROM students;")}
              onReset={resetQuery}
              isPlaying={isPlaying}
              isFinished={isFinished}
            />
          </div>
          
          <div className="panel p-4 flex flex-col gap-2">
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
              <Terminal size={14} /> Execution Log
            </div>
            <div className="font-mono text-[13px] h-32 overflow-y-auto flex flex-col justify-end">
              {step === -1 && <div className="text-muted-foreground">Ready. Awaiting execution.</div>}
              {step >= 0 && <div className="text-foreground">↳ Parsing AST...</div>}
              {step >= 1 && <div className="text-foreground">↳ Locating table relation '{activeTable}'...</div>}
              {step >= 4 && <div className="text-accent">↳ Iterating over table rows... ({currentRowIdx + 1}/{tableData.length})</div>}
              {step === 5 && <div className="text-success font-medium flex items-center gap-1 mt-1"><CheckCircle2 size={14} /> Query executed successfully. {resultSetData.length} rows returned.</div>}
            </div>
          </div>
        </div>
        
        <div className="col-span-1 lg:col-span-8 flex flex-col h-full overflow-hidden gap-6">
          <div className="flex-1 overflow-hidden min-h-[250px]">
            <Table 
              data={tableData} 
              title={`Source: public.${activeTable}`} 
              highlightedRows={
                step === 4 && checkingCondition 
                  ? [tableData[currentRowIdx]?.id || tableData[currentRowIdx]?.order_id || currentRowIdx]
                  : []
              }
            />
          </div>
          <div className="flex-1 overflow-hidden min-h-[250px]">
            {resultSetData.length > 0 || step === 5 ? (
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
