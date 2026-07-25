import { useState, useEffect } from "react";
import Table from "../../components/Table";
import { CheckCircle2, XCircle, Terminal, Cpu, Play, Database , Code as CodeIcon, Book as BookIcon } from "lucide-react";
import ModuleLayout from "../../components/ModuleLayout";
import { cn } from "../../utils/cn";
import EditorModule from "react-simple-code-editor";
import Prism from "prismjs";
import "prismjs/components/prism-sql";
import "prismjs/themes/prism-tomorrow.css";
import { useExecutionEngine } from "../../hooks/useExecutionEngine";
import CsvUploader from "../../components/CsvUploader";
import { getAvailableTables } from "../../engine/database";

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
    runQuery,
    previewTable
  } = useExecutionEngine("SELECT *\nFROM students\nWHERE age > 20;");

  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
        e.preventDefault();
        if (!isPlaying) {
          runQuery();
        }
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isPlaying, runQuery]);

  const [availableTables, setAvailableTables] = useState(() => getAvailableTables());

  const handleUploadSuccess = (tableName) => {
    setAvailableTables(getAvailableTables());
    previewTable(tableName);
  };

  const highlightCode = (code) => {
    return Prism.highlight(code, Prism.languages.sql, "sql");
  };

  return (
    <ModuleLayout
      theoryContent={
        <>
<div className="p-5 flex flex-col gap-6">
          <header className="flex flex-col gap-2">
            <span className="bg-amber-400/10 text-amber-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-400/20 self-start">Sandbox Mode</span>
            <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
              Interactive Playground
            </h1>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Write your own queries with real-time syntax highlighting and watch the execution engine process them.
            </p>
          </header>

          <div className="flex flex-col gap-3">
            <div className="panel p-4 bg-zinc-900/50">
              <h3 className="font-semibold text-sm text-zinc-300 mb-2">Available Tables</h3>
              <p className="text-xs text-zinc-400 leading-relaxed break-words">
                {availableTables.map((t, i) => (
                  <span key={t}>
                    <code className="text-blue-400 font-medium">{t}</code>
                    {i < availableTables.length - 1 ? ", " : "."}
                  </span>
                ))}
              </p>
            </div>
            
            <div className="panel p-4 bg-zinc-900/50 flex flex-col gap-3">
              <h3 className="font-semibold text-sm text-zinc-300">Upload CSV Data</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Upload your own CSV files to query them instantly. The table will be named after the filename.
              </p>
              <CsvUploader onUploadSuccess={handleUploadSuccess} />
            </div>
          </div>
        </div>
        </>
      }
      editorContent={
        <>

        <div className={cn(
          "h-1/2 flex flex-col border-b border-border relative transition-all duration-300",
          isPlaying ? "border-zinc-500 shadow-sm shadow-white/5 bg-zinc-900/20" : ""
        )}>
          <div className="bg-zinc-900/50 px-3 py-2 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Terminal size={14} className={isPlaying ? "text-zinc-100 animate-pulse" : "text-zinc-500"} />
              <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider">query.sql</span>
            </div>
            <button
              onClick={() => runQuery()}
              disabled={isPlaying}
              className="flex items-center gap-1.5 px-3 py-1 rounded bg-zinc-100 text-zinc-900 text-[10px] font-bold uppercase transition-all hover:bg-white hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:scale-100"
            >
              <Play size={10} fill="currentColor" />
              {isPlaying ? "Executing..." : "Run Query"}
            </button>
          </div>
          
          <div className="flex-1 overflow-auto relative">
            <Editor
              value={queryInput}
              onValueChange={code => setQueryInput(code)}
              highlight={highlightCode}
              padding={16}
              disabled={isPlaying}
              className="font-mono text-[13px] leading-relaxed w-full min-h-full disabled:opacity-50 text-zinc-200"
              style={{ fontFamily: '"Fira Code", "Fira Mono", monospace' }}
            />
          </div>
          
          {parseError && (
            <div className="absolute bottom-0 left-0 right-0 bg-red-950/90 border-t border-red-900 text-red-400 text-xs p-2 font-mono truncate">
              {parseError}
            </div>
          )}
        </div>
        
        <div className="h-1/2 flex flex-col bg-zinc-950/50">
          <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2 px-4 py-3 border-b border-border bg-zinc-900/30">
            <Cpu size={14} className={isPlaying ? "text-zinc-200 animate-pulse" : ""} /> Execution Trace
          </div>
          
          <div className="flex-1 p-4 font-mono text-xs gap-1.5 overflow-y-auto flex flex-col leading-relaxed">
            {step === -1 && <div className="text-zinc-500 pt-2">Awaiting execution...</div>}
            
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
                <div className="text-zinc-500 text-[11px]">
                  Eval Row <span className="text-zinc-300">#{currentRowIdx + 1}</span>
                </div>
                
                <div className="bg-zinc-900 border border-zinc-800 p-2 rounded">
                  {checkingCondition ? (
                    <div className="flex items-center gap-2 text-zinc-400 text-[11px]">
                      <div className="w-3 h-3 rounded-full border border-zinc-500 border-t-zinc-200 animate-spin" />
                      Evaluating...
                    </div>
                  ) : (
                    <div className={`flex items-center gap-1.5 text-[11px] font-medium ${highlightedRows.includes(tableData[currentRowIdx].id || tableData[currentRowIdx].order_id || currentRowIdx) ? 'text-emerald-400' : 'text-zinc-500'}`}>
                      {highlightedRows.includes(tableData[currentRowIdx].id || tableData[currentRowIdx].order_id || currentRowIdx) ? (
                         <>
                           <CheckCircle2 size={12} /> Passed <span className="ml-1 text-emerald-900 bg-emerald-400 px-1 rounded font-bold uppercase">True</span>
                         </>
                      ) : (
                         <>
                           <XCircle size={12} /> Failed
                         </>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {step === 5 && (
              <div className="text-emerald-400 mt-3 pt-3 border-t border-zinc-800">
                <div className="flex items-center gap-2 font-bold uppercase"><CheckCircle2 size={14} /> Query Complete</div>
                <div className="text-zinc-400 text-[11px] mt-1">Result Set populated with <span className="text-emerald-400">{highlightedRows.length}</span> rows.</div>
              </div>
            )}
          </div>
        </div>
      </>
      }
      dataContent={
        <>
<div className="flex-1 flex flex-col min-h-[250px] shrink-0">
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
        <div className="flex-1 flex flex-col min-h-[250px] shrink-0">
          {resultSetData.length > 0 || step === 5 ? (
            <Table 
              data={resultSetData} 
              title="Result Set" 
            />
          ) : (
            <div className="panel h-full w-full flex items-center justify-center text-zinc-600 font-mono text-xs border-dashed border-2">
              <div className="flex items-center gap-2 opacity-50">
                 <Database size={14} />
                 Awaiting Execution...
              </div>
            </div>
          )}
        </div>
        </>
      }
    />  );
}
