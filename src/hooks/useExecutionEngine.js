import { useState, useEffect } from "react";
import { Parser } from "node-sql-parser";
import { getTable } from "../engine/database";
import { evaluateCondition } from "../engine/evaluator";

export function useExecutionEngine(initialQuery = "") {
  const [queryInput, setQueryInput] = useState(initialQuery);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [step, setStep] = useState(-1);
  const [currentRowIdx, setCurrentRowIdx] = useState(-1);
  
  const [activeTable, setActiveTable] = useState("students");
  const [tableData, setTableData] = useState([]);
  const [parsedAST, setParsedAST] = useState(null);
  const [parseError, setParseError] = useState(null);
  
  const [highlightedRows, setHighlightedRows] = useState([]);
  const [checkingCondition, setCheckingCondition] = useState(false);
  const [resultSetData, setResultSetData] = useState([]);

  // Initialize with initialQuery table if possible, just for initial UI state
  useEffect(() => {
    try {
      if (initialQuery) {
        const parser = new Parser();
        const astList = parser.astify(initialQuery);
        const ast = Array.isArray(astList) ? astList[0] : astList;
        const tableName = ast.from[0].table;
        setActiveTable(tableName);
        setTableData(getTable(tableName));
      } else {
        setTableData(getTable("students"));
      }
    } catch(e) {
      setTableData(getTable("students"));
    }
  }, [initialQuery]);

  const runQuery = (customQuery) => {
    if (isPlaying) return;
    const queryToRun = customQuery !== undefined ? customQuery : queryInput;
    
    try {
      const parser = new Parser();
      const astList = parser.astify(queryToRun);
      const ast = Array.isArray(astList) ? astList[0] : astList;
      
      if (ast.type !== 'select') {
        throw new Error("Only SELECT queries are supported right now.");
      }
      
      const tableName = ast.from[0].table;
      const data = getTable(tableName); // throws if not found

      setParsedAST(ast);
      setActiveTable(tableName);
      setTableData(data);
      setParseError(null);
      
      // Start Animation
      setIsPlaying(true);
      setIsFinished(false);
      setStep(0);
      setCurrentRowIdx(-1);
      setHighlightedRows([]);
      setResultSetData([]);
      
    } catch (err) {
      setParseError(err.message || "Syntax error in SQL query.");
    }
  };

  const resetQuery = () => {
    setIsPlaying(false);
    setIsFinished(false);
    setStep(-1);
    setCurrentRowIdx(-1);
    setHighlightedRows([]);
    setResultSetData([]);
    setParseError(null);
  };

  useEffect(() => {
    if (!isPlaying || !parsedAST) return;

    let timeout;
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
      if (currentRowIdx < tableData.length) {
        const row = tableData[currentRowIdx];
        setCheckingCondition(true);
        
        timeout = setTimeout(() => {
          setCheckingCondition(false);
          const isMatch = parsedAST.where ? evaluateCondition(parsedAST.where, row) : true;
          
          if (isMatch) {
            setHighlightedRows(prev => [...prev, row.id || row.order_id || currentRowIdx]);
            setResultSetData(prev => [...prev, row]);
          }
          
          timeout = setTimeout(() => {
            setCurrentRowIdx(prev => prev + 1);
          }, 300); 
        }, 600); 
      } else {
        setCurrentRowIdx(-1);
        setStep(5);
      }
    } else if (step === 5) {
      if (parsedAST.orderby) {
        setResultSetData(prev => {
          const sorted = [...prev];
          const orderBy = parsedAST.orderby[0];
          const column = orderBy.expr.column;
          const type = orderBy.type; // "ASC" or "DESC"
          sorted.sort((a, b) => {
            if (a[column] < b[column]) return type === "DESC" ? 1 : -1;
            if (a[column] > b[column]) return type === "DESC" ? -1 : 1;
            return 0;
          });
          return sorted;
        });
      }
      timeout = setTimeout(() => setStep(6), parsedAST.orderby ? 600 : 0);
    } else if (step === 6) {
      if (parsedAST.limit && parsedAST.limit.value && parsedAST.limit.value.length > 0) {
        const limitValue = parsedAST.limit.value[0].value;
        setResultSetData(prev => prev.slice(0, limitValue));
      }
      setIsPlaying(false);
      setIsFinished(true);
    }

    return () => clearTimeout(timeout);
  }, [isPlaying, step, currentRowIdx, parsedAST, tableData]);

  return {
    queryInput,
    setQueryInput,
    isPlaying,
    isFinished,
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
    resetQuery
  };
}
