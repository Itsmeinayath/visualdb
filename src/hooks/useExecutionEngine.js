import { useState, useEffect } from "react";
import { Parser } from "node-sql-parser";
import { getTable } from "../engine/database";
import { evaluateCondition, evaluateAggregate, evaluateHavingCondition } from "../engine/evaluator";

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

  const [rightTableData, setRightTableData] = useState([]);
  const [currentRightRowIdx, setCurrentRightRowIdx] = useState(-1);
  const [hasMatchInInnerLoop, setHasMatchInInnerLoop] = useState(false);

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
        
        if (ast.from.length > 1 && ast.from[1].join) {
          setRightTableData(getTable(ast.from[1].table));
        }
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
      
      let rightData = [];
      if (ast.from.length > 1 && ast.from[1].join) {
        rightData = getTable(ast.from[1].table);
      }

      setParsedAST(ast);
      setActiveTable(tableName);
      setTableData(data);
      setRightTableData(rightData);
      setParseError(null);
      
      // Start Animation
      setIsPlaying(true);
      setIsFinished(false);
      setStep(0);
      setCurrentRowIdx(-1);
      setCurrentRightRowIdx(-1);
      setHasMatchInInnerLoop(false);
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
    setCurrentRightRowIdx(-1);
    setHasMatchInInnerLoop(false);
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
      setCurrentRightRowIdx(rightTableData.length > 0 ? 0 : -1);
      setHasMatchInInnerLoop(false);
      setStep(4);
    } else if (step === 4) {
      if (currentRowIdx < tableData.length) {
        const leftRow = tableData[currentRowIdx];
        
        if (rightTableData.length > 0) {
          // Nested Loop Join Animation
          if (currentRightRowIdx < rightTableData.length) {
            const rightRow = rightTableData[currentRightRowIdx];
            setCheckingCondition(true);
            
            timeout = setTimeout(() => {
              setCheckingCondition(false);
              
              // Merge rows with table-prefixed keys to avoid column name collisions
              // e.g. students.course_id and courses.course_id stay separate
              const leftTableName = parsedAST.from[0].table;
              const rightTableName = parsedAST.from[1].table;
              const combinedRow = {};
              Object.entries(leftRow).forEach(([k, v]) => {
                combinedRow[k] = v;                         // plain key (for display)
                combinedRow[`${leftTableName}.${k}`] = v;   // prefixed key (for ON eval)
              });
              Object.entries(rightRow).forEach(([k, v]) => {
                combinedRow[`${rightTableName}.${k}`] = v;  // always prefix right table to avoid collision
                if (!(k in combinedRow)) combinedRow[k] = v; // only add plain if not already set by left
              });
              const onCondition = parsedAST.from[1].on;
              
              // Evaluate ON
              const isMatch = onCondition ? evaluateCondition(onCondition, combinedRow) : true;
              
              if (isMatch) {
                setHasMatchInInnerLoop(true);
                // Also apply WHERE if present
                const passesWhere = parsedAST.where ? evaluateCondition(parsedAST.where, combinedRow) : true;
                if (passesWhere) {
                  setHighlightedRows(prev => [...prev, leftRow.id || currentRowIdx]);
                  setResultSetData(prev => [...prev, combinedRow]);
                }
              }
              
              timeout = setTimeout(() => {
                setCurrentRightRowIdx(prev => prev + 1);
              }, 300);
            }, 600);
          } else {
            // Inner loop finished
            const joinType = parsedAST.from[1].join?.toUpperCase();
            
            if (joinType === "LEFT JOIN" && !hasMatchInInnerLoop) {
              const nullRightRow = {};
              if (rightTableData.length > 0) {
                Object.keys(rightTableData[0]).forEach(key => {
                  nullRightRow[key] = null;
                });
              }
              const combinedRow = { ...leftRow, ...nullRightRow };
              const passesWhere = parsedAST.where ? evaluateCondition(parsedAST.where, combinedRow) : true;
              
              if (passesWhere) {
                setHighlightedRows(prev => [...prev, leftRow.id || currentRowIdx]);
                setResultSetData(prev => [...prev, combinedRow]);
              }
            }
            
            // step outer loop
            setCurrentRightRowIdx(0);
            setCurrentRowIdx(prev => prev + 1);
            setHasMatchInInnerLoop(false);
          }
        } else {
          // Standard Single Table Animation
          setCheckingCondition(true);
          
          timeout = setTimeout(() => {
            setCheckingCondition(false);
            const isMatch = parsedAST.where ? evaluateCondition(parsedAST.where, leftRow) : true;
            
            if (isMatch) {
              setHighlightedRows(prev => [...prev, leftRow.id || leftRow.order_id || currentRowIdx]);
              setResultSetData(prev => [...prev, leftRow]);
            }
            
            timeout = setTimeout(() => {
              setCurrentRowIdx(prev => prev + 1);
            }, 300); 
          }, 600); 
        }
      } else {
        setCurrentRowIdx(-1);
        setCurrentRightRowIdx(-1);
        setStep(5); // Move to GROUP BY
      }
    } else if (step === 5) {
      if (parsedAST.groupby) {
        setResultSetData(prev => {
          // node-sql-parser puts groupby in an object with a 'columns' array, or sometimes directly an array
          const groupCol = parsedAST.groupby.columns 
            ? parsedAST.groupby.columns[0].column 
            : parsedAST.groupby[0].column;
            
          const buckets = {};
          
          // Hash aggregation
          prev.forEach(row => {
            const key = row[groupCol];
            if (!buckets[key]) buckets[key] = [];
            buckets[key].push(row);
          });
          
          // Collapse buckets into new rows based on SELECT columns
          const newResultSet = [];
          Object.keys(buckets).forEach(key => {
            // Apply HAVING filter if present
            if (parsedAST.having) {
              const passesHaving = evaluateHavingCondition(parsedAST.having, buckets[key]);
              if (!passesHaving) return;
            }

            const newRow = { [groupCol]: key };
            
            if (parsedAST.columns) {
              parsedAST.columns.forEach(col => {
                if (col.expr.type === 'aggr_func') {
                  // e.g. COUNT(*) -> newRow["COUNT(*)"] = ...
                  const aggrName = col.expr.name;
                  const argName = col.expr.args?.expr?.value || '*';
                  const alias = col.as || `${aggrName}(${argName})`;
                  
                  newRow[alias] = evaluateAggregate(col.expr, buckets[key]);
                }
              });
            }
            newResultSet.push(newRow);
          });
          return newResultSet;
        });
      } else {
        const hasGlobalAggregates = parsedAST.columns && parsedAST.columns.some(col => col.expr && col.expr.type === 'aggr_func');
        if (hasGlobalAggregates) {
          setResultSetData(prev => {
            const newRow = {};
            parsedAST.columns.forEach(col => {
              if (col.expr.type === 'aggr_func') {
                const aggrName = col.expr.name;
                const argName = col.expr.args?.expr?.value || '*';
                const alias = col.as || `${aggrName}(${argName})`;
                newRow[alias] = evaluateAggregate(col.expr, prev);
              } else if (col.expr.type === 'column_ref') {
                const colName = col.expr.column;
                const alias = col.as || colName;
                newRow[alias] = prev[0]?.[colName];
              } else {
                const alias = col.as || col.expr.value;
                newRow[alias] = col.expr.value;
              }
            });
            return [newRow];
          });
        }
      }
      timeout = setTimeout(() => setStep(6), parsedAST.orderby ? 600 : 0);
    } else if (step === 6) {
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
      timeout = setTimeout(() => setStep(7), parsedAST.limit ? 600 : 0);
    } else if (step === 7) {
      setResultSetData(prev => {
        let projected = prev.map(row => projectRow(row, parsedAST.columns));
        
        // Apply DISTINCT deduplication if requested
        if (parsedAST.distinct === 'DISTINCT') {
          const seen = new Set();
          projected = projected.filter(row => {
            const stringified = JSON.stringify(row);
            if (seen.has(stringified)) return false;
            seen.add(stringified);
            return true;
          });
        }

        if (parsedAST.limit && parsedAST.limit.value && parsedAST.limit.value.length > 0) {
          const limitValue = parsedAST.limit.value[0].value;
          projected = projected.slice(0, limitValue);
        }
        return projected;
      });
      setIsPlaying(false);
      setIsFinished(true);
    }

    return () => clearTimeout(timeout);
  }, [isPlaying, step, currentRowIdx, currentRightRowIdx, parsedAST, tableData]);

  useEffect(() => {
    if (isFinished) {
      const path = window.location.pathname;
      localStorage.setItem("completed_" + path, "true");
      window.dispatchEvent(new Event("completion-change"));
    }
  }, [isFinished]);

  return {
    queryInput,
    setQueryInput,
    isPlaying,
    isFinished,
    step,
    currentRowIdx,
    activeTable,
    tableData,
    rightTableData,
    currentRightRowIdx,
    parsedAST,
    parseError,
    highlightedRows,
    checkingCondition,
    resultSetData,
    runQuery,
    resetQuery
  };
}

function projectRow(row, columnsAST) {
  if (!columnsAST || (columnsAST.length === 1 && (columnsAST[0].expr.type === 'star' || columnsAST[0].expr.column === '*'))) {
    return row; // SELECT *
  }
  
  const projected = {};
  columnsAST.forEach(col => {
    const expr = col.expr;
    const alias = col.as;
    
    if (expr.type === 'column_ref') {
      const colName = expr.column;
      const targetName = alias || colName;
      
      // Handle table prefix if present
      if (expr.table) {
        const prefixedKey = `${expr.table}.${colName}`;
        if (prefixedKey in row) {
          projected[targetName] = row[prefixedKey];
          return;
        }
      }
      projected[targetName] = row[colName];
    } else if (expr.type === 'aggr_func') {
      const aggrName = expr.name;
      const argName = expr.args?.expr?.value || '*';
      const key = alias || `${aggrName}(${argName})`;
      if (key in row) {
        projected[key] = row[key];
      }
    } else {
      // Literal value
      const key = alias || expr.value;
      projected[key] = expr.value;
    }
  });
  return projected;
}
