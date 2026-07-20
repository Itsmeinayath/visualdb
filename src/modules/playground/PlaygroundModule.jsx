import Table from "../../components/Table";
import { CheckCircle2, XCircle, Terminal, Cpu, Play, Database } from "lucide-react";
import { cn } from "../../utils/cn";
import EditorModule from "react-simple-code-editor";
import Prism from "prismjs";
import "prismjs/components/prism-sql";
import "prismjs/themes/prism-tomorrow.css";
import { useExecutionEngine } from "../../hooks/useExecutionEngine";

const Editor = EditorModule.default || EditorModule;

export default function PlaygroundModule() {
  const {
    queryInput,
    setQueryInput,
    isPlaying,
    step,
    currentRowIdx,
    activeTable,
    tableData,
    parsedAST,
    parseError,
    highlightedRows,
    checkingCondition,
    resultSetData,
    runQuery
  } = useExecutionEngine("SELECT *\nFROM students\nWHERE age > 20;");

  const highlightCode = (code) => {
    return Prism.highlight(code, Prism.languages.sql, "sql");
  };

  return (
    <div className="h-full flex flex-col p-8 max-w-7xl mx-auto gap-8 relative">
      <header className="flex-none flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2 tracking-tight text-foreground flex items-center gap-3">
            Interactive Playground
          </h1>
          <p className="text-zinc-400 text-[15px] max-w-3xl leading-relaxed font-light">
            Write your own queries with real-time syntax highlighting and watch the execution engine process them. 
            Available tables: <code className="text-blue-400 font-medium">students</code>, <code className="text-blue-400 font-medium">employees</code>, <code className="text-blue-400 font-medium">orders</code>.
          </p>
        </div>
      </header>

      <div className="h-[650px] grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
        <div className="col-span-1 lg:col-span-4 flex flex-col gap-6">
          
          <div className={cn(
            "panel overflow-hidden flex flex-col h-56 shrink-0 relative transition-all duration-300",
            isPlaying ? "border-zinc-500 shadow-sm shadow-white/5" : "border-zinc-800"
          )}>
            <div className="bg-zinc-900/50 px-3 py-2 border-b border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Terminal size={14} className={isPlaying ? "text-zinc-100 animate-pulse" : "text-zinc-500"} />
                <span className="text-xs font-mono text-zinc-400">query.sql</span>
              </div>
              <button
                onClick={() => runQuery()}
                disabled={isPlaying}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded bg-zinc-100 text-zinc-900 text-xs font-semibold transition-all hover:bg-white hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:scale-100"
              >
                <Play size={12} fill="currentColor" />
                {isPlaying ? "Executing..." : "Run"}
              </button>
            </div>
            
            <div className="flex-1 bg-zinc-950 overflow-auto relative">
              <Editor
                value={queryInput}
                onValueChange={code => setQueryInput(code)}
                highlight={highlightCode}
                padding={16}
                disabled={isPlaying}
                className="font-mono text-[14px] leading-relaxed w-full min-h-full disabled:opacity-50 text-zinc-200"
                style={{ fontFamily: '"Fira Code", "Fira Mono", monospace' }}
              />
            </div>
            
            {parseError && (
              <div className="absolute bottom-0 left-0 right-0 bg-red-950/90 border-t border-red-900 text-red-400 text-xs p-2 font-mono truncate">
                {parseError}
              </div>
            )}
          </div>
          
          <div className="panel flex flex-col flex-1 bg-zinc-950 border border-zinc-800">
            <div className="bg-zinc-900/50 px-3 py-2 border-b border-zinc-800 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-2">
              <Cpu size={14} className={isPlaying ? "text-zinc-200" : ""} /> Execution Trace
            </div>
            
            <div className="flex-1 p-4 overflow-y-auto font-mono text-[13px] flex flex-col justify-end min-h-0">
              {step === -1 && <div className="text-zinc-600">Awaiting execution...</div>}
              
              {step >= 0 && (
                <div className="text-zinc-300">
                  <span className="text-blue-400">[INFO]</span> AST parsed successfully
                </div>
              )}
              {step >= 1 && (
                <div className="text-zinc-300 mt-1">
                  <span className="text-blue-400">[INFO]</span> Resolving relation <span className="text-emerald-400">public.{activeTable}</span>
                </div>
              )}
              {step >= 2 && (
                <div className="text-zinc-300 mt-1">
                  <span className="text-blue-400">[INFO]</span> {parsedAST?.where ? 'Applying filter conditions...' : 'No filter conditions detected.'}
                </div>
              )}
              
              {step === 4 && currentRowIdx >= 0 && currentRowIdx < tableData.length && (
                <div className="mt-3 flex flex-col gap-2">
                  <div className="text-zinc-500 text-xs">
                    Eval Row <span className="text-zinc-300">#{currentRowIdx + 1}</span>
                  </div>
                  
                  <div className="bg-zinc-900 border border-zinc-800 p-2 rounded">
                    {checkingCondition ? (
                      <div className="flex items-center gap-2 text-zinc-400 text-xs">
                        <div className="w-3 h-3 rounded-full border-2 border-zinc-600 border-t-zinc-300 animate-spin" />
                        Evaluating...
                      </div>
                    ) : (
                      <div className={`flex items-center gap-1.5 text-xs font-medium ${highlightedRows.includes(tableData[currentRowIdx].id || tableData[currentRowIdx].order_id || currentRowIdx) ? 'text-emerald-400' : 'text-zinc-500'}`}>
                        {highlightedRows.includes(tableData[currentRowIdx].id || tableData[currentRowIdx].order_id || currentRowIdx) ? (
                           <>
                             <CheckCircle2 size={14} /> Passed <span className="ml-1 text-emerald-900 bg-emerald-400 px-1 rounded font-bold">TRUE</span>
                           </>
                        ) : (
                           <>
                             <XCircle size={14} /> Failed
                           </>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {step === 5 && (
                <div className="text-emerald-400 mt-3 pt-3 border-t border-zinc-800">
                  <div className="flex items-center gap-2 font-bold"><CheckCircle2 size={16} /> QUERY COMPLETE</div>
                  <div className="text-zinc-400 text-xs mt-1">Result Set populated with <span className="text-emerald-400">{highlightedRows.length}</span> rows.</div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="col-span-1 lg:col-span-8 flex flex-col h-full overflow-hidden gap-6">
          <div className="flex-1 overflow-hidden shadow-sm">
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
          <div className="flex-1 overflow-hidden shadow-sm">
            {resultSetData.length > 0 || step === 5 ? (
              <Table 
                data={resultSetData} 
                title="Result Set" 
              />
            ) : (
              <div className="panel h-full w-full flex items-center justify-center text-zinc-600 font-mono text-sm bg-zinc-950/20">
                <div className="flex items-center gap-2 opacity-50">
                   <Database size={16} />
                   Awaiting Execution...
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
