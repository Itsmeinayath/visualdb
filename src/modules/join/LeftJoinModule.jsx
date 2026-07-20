import React, { useState } from 'react';
import { useExecutionEngine } from '../../hooks/useExecutionEngine';
import Table from "../../components/Table";
import Query from "../../components/Query";
import { CheckCircle2, Terminal, Cpu, Combine } from "lucide-react";
export default function LeftJoinModule() {
  const {
    isPlaying,
    isFinished,
    step,
    activeTable,
    tableData,
    rightTableData,
    currentRowIdx,
    currentRightRowIdx,
    parsedAST,
    resultSetData,
    checkingCondition,
    runQuery,
    resetQuery
  } = useExecutionEngine("SELECT *\nFROM students\nLEFT JOIN courses \n  ON students.course_id = courses.id;");
  
  const queryLines = [
    <span key="1"><span className="text-pink-500 font-semibold">SELECT</span> *</span>,
    <span key="2"><span className="text-pink-500 font-semibold">FROM</span> <span className="text-blue-400">students</span></span>,
    <span key="3"><span className="text-pink-500 font-semibold">LEFT JOIN</span> <span className="text-orange-400">courses</span></span>,
    <span key="4">  <span className="text-pink-500 font-semibold">ON</span> <span className="text-blue-400">students</span>.course_id = <span className="text-orange-400">courses</span>.id;</span>
  ];

  return (
    <div className="h-full flex flex-col p-8 max-w-7xl mx-auto gap-8">
      
      <div className="flex-none flex flex-col gap-6 mb-4">
        <header>
          <h1 className="text-3xl font-bold mb-3 tracking-tight">The LEFT JOIN</h1>
          <p className="text-muted-foreground text-base max-w-3xl leading-relaxed">
            The <code className="mx-1 px-1.5 py-0.5 rounded bg-muted text-foreground border border-border text-sm font-mono">LEFT JOIN</code> clause guarantees that every row from the left table is returned. If the engine's nested loop finishes without finding any matches in the right table, it pads the missing data with <code className="text-pink-400 text-xs">NULL</code> values.
          </p>
        </header>
      </div>
      
      <div className="h-px w-full bg-border my-2"></div>
      
      <div className="flex items-center gap-2 mb-2">
        <h2 className="text-lg font-bold">Execution Trace</h2>
        <span className="px-2 py-0.5 rounded-full bg-accent/10 text-accent text-xs font-semibold">Nested Loop Simulation</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-auto min-h-[700px]">
        {/* Left Column - Query & Engine */}
        <div className="col-span-1 lg:col-span-4 flex flex-col gap-6">
          <div className="h-56 shrink-0">
            <Query 
              queryLines={queryLines} 
              activeLineIndex={
                step === 0 ? 0 : 
                step === 1 ? 1 : 
                step === 2 ? 2 : 
                step === 4 ? 3 :
                -1
              } 
              onRun={() => runQuery("SELECT *\nFROM students\nLEFT JOIN courses \n  ON students.course_id = courses.id;")}
              onReset={resetQuery}
              isPlaying={isPlaying}
              isFinished={isFinished}
            />
          </div>
          
          <div className="panel p-4 flex flex-col gap-4">
            <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2 border-b border-border pb-2">
              <Cpu size={14} /> Evaluation Engine
            </div>
            
            <div className="h-40 flex flex-col justify-center font-mono text-[13px]">
              {step === -1 && <div className="text-zinc-500 text-center">Idle</div>}
              {step === 0 && <div className="text-foreground animate-pulse">AST Parsing: SELECT...</div>}
              {step === 1 && <div className="text-foreground animate-pulse">Resolving left table: {activeTable}</div>}
              {step === 2 && <div className="text-foreground animate-pulse">Resolving right table: {parsedAST?.from?.[1]?.table}</div>}
              {step === 3 && <div className="text-foreground animate-pulse">Preparing Nested Loop...</div>}
              
              {step === 4 && (
                <div className="flex flex-col gap-3">
                  <div className="text-accent flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full border border-accent border-t-transparent animate-spin" />
                    Evaluating ON Condition
                  </div>
                  <div className="bg-zinc-900 border border-zinc-800 p-3 rounded">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-300">
                       <Combine size={14} className="text-accent" /> Comparing Rows...
                    </div>
                    {checkingCondition && (
                      <div className="text-zinc-500 text-[11px] mt-2">
                        Left: {tableData[currentRowIdx]?.name} <br/>
                        Right: {rightTableData[currentRightRowIdx]?.course_name}
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {step >= 5 && (
                <div className="text-success font-medium flex flex-col gap-1">
                  <div className="flex items-center gap-2"><CheckCircle2 size={16} /> Join Complete</div>
                  <div className="text-zinc-500 text-xs mt-1">Found {resultSetData.length} matching pairs.</div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Right Column - Data Grids */}
        <div className="col-span-1 lg:col-span-8 flex flex-col gap-6">
          <div className="grid grid-cols-2 gap-6 h-[300px]">
            {/* Left Table */}
            <div className="h-full flex flex-col">
              <Table 
                data={tableData} 
                title={`Left: ${activeTable}`} 
                highlightedRows={currentRowIdx !== -1 ? [tableData[currentRowIdx]?.id || currentRowIdx] : []}
                highlightedColumns={["course_id"]}
              />
            </div>
            {/* Right Table */}
            <div className="h-full flex flex-col">
              <Table 
                data={rightTableData} 
                title={`Right: courses`} 
                highlightedRows={currentRightRowIdx !== -1 ? [rightTableData[currentRightRowIdx]?.course_id || currentRightRowIdx] : []}
                highlightedColumns={["course_id"]}
              />
            </div>
          </div>
          
          {/* Result Set */}
          <div className="flex-1 min-h-[300px]">
            {resultSetData.length > 0 || step >= 5 ? (
              <Table 
                data={resultSetData} 
                title="Result Set (Merged Rows)" 
              />
            ) : (
              <div className="panel h-full w-full flex items-center justify-center text-zinc-500 font-mono text-sm border-dashed border-2">
                Awaiting matched pairs...
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
