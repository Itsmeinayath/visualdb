import { useState, useEffect, useRef } from "react";
import { Parser } from "node-sql-parser";
import { getTable } from "../engine/database";
import { evaluateCondition, evaluateAggregate, evaluateHavingCondition } from "../engine/evaluator";

export function useExecutionEngine(initialQuery = "") {
  const [queryInput, setQueryInput] = useState(initialQuery);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [step, setStep] = useState(-1);
  const [currentRowIdx, setCurrentRowIdx] = useState(-1);

  // Speed: 1 = normal (600ms), 2 = 2x faster (300ms), etc.
  const [speed, setSpeed] = useState(1);
  const speedRef = useRef(1);
  speedRef.current = speed;

  // When paused, this resolves when the user clicks Step or Resume
  const stepResolveRef = useRef(null);
  const isPausedRef = useRef(false);
  isPausedRef.current = isPaused;

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

  // Helper: wait for a step signal when paused, otherwise wait `ms` (scaled by speed)
  const waitStep = (ms) =>
    new Promise((resolve) => {
      const scaled = Math.round(ms / speedRef.current);
      // poll every 50ms if paused, otherwise just timeout
      const check = () => {
        if (!isPausedRef.current) {
          setTimeout(resolve, scaled);
        } else {
          stepResolveRef.current = resolve;
        }
      };
      check();
    });

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
    } catch (e) {
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

      if (ast.type !== "select") {
        throw new Error("Only SELECT queries are supported right now.");
      }

      const tableName = ast.from[0].table;
      const data = getTable(tableName);

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
      setIsPaused(false);
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
    setIsPaused(false);
    setIsFinished(false);
    setStep(-1);
    setCurrentRowIdx(-1);
    setCurrentRightRowIdx(-1);
    setHasMatchInInnerLoop(false);
    setHighlightedRows([]);
    setResultSetData([]);
    setParseError(null);
    stepResolveRef.current = null;
  };

  // Pause toggles
  const pauseQuery = () => {
    if (!isPlaying || isFinished) return;
    setIsPaused((prev) => {
      const next = !prev;
      isPausedRef.current = next;
      // If resuming, resolve any pending wait
      if (!next && stepResolveRef.current) {
        const res = stepResolveRef.current;
        stepResolveRef.current = null;
        res();
      }
      return next;
    });
  };

  // Manual single step forward
  const stepQuery = () => {
    if (stepResolveRef.current) {
      const res = stepResolveRef.current;
      stepResolveRef.current = null;
      res();
    }
  };

  useEffect(() => {
    if (!isPlaying || !parsedAST) return;

    let timeout;
    const delay = (ms) => {
      const scaled = Math.round(ms / speedRef.current);
      return new Promise((res) => {
        timeout = setTimeout(res, scaled);
      });
    };

    if (step === 0) {
      delay(600).then(() => setStep(1));
    } else if (step === 1) {
      delay(600).then(() => setStep(2));
    } else if (step === 2) {
      delay(600).then(() => setStep(3));
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

            delay(600).then(() => {
              setCheckingCondition(false);

              const leftTableName = parsedAST.from[0].table;
              const rightTableName = parsedAST.from[1].table;
              const combinedRow = {};
              Object.entries(leftRow).forEach(([k, v]) => {
                combinedRow[k] = v;
                combinedRow[`${leftTableName}.${k}`] = v;
              });
              Object.entries(rightRow).forEach(([k, v]) => {
                combinedRow[`${rightTableName}.${k}`] = v;
                if (!(k in combinedRow)) combinedRow[k] = v;
              });
              const onCondition = parsedAST.from[1].on;

              const isMatch = onCondition
                ? evaluateCondition(onCondition, combinedRow)
                : true;

              if (isMatch) {
                setHasMatchInInnerLoop(true);
                const passesWhere = parsedAST.where
                  ? evaluateCondition(parsedAST.where, combinedRow)
                  : true;
                if (passesWhere) {
                  setHighlightedRows((prev) => [
                    ...prev,
                    leftRow.id || currentRowIdx,
                  ]);
                  setResultSetData((prev) => [...prev, combinedRow]);
                }
              }

              delay(300).then(() => {
                setCurrentRightRowIdx((prev) => prev + 1);
              });
            });
          } else {
            // Inner loop finished
            const joinType = parsedAST.from[1].join?.toUpperCase();

            if (joinType === "LEFT JOIN" && !hasMatchInInnerLoop) {
              const nullRightRow = {};
              if (rightTableData.length > 0) {
                Object.keys(rightTableData[0]).forEach((key) => {
                  nullRightRow[key] = null;
                });
              }
              const combinedRow = { ...leftRow, ...nullRightRow };
              const passesWhere = parsedAST.where
                ? evaluateCondition(parsedAST.where, combinedRow)
                : true;

              if (passesWhere) {
                setHighlightedRows((prev) => [
                  ...prev,
                  leftRow.id || currentRowIdx,
                ]);
                setResultSetData((prev) => [...prev, combinedRow]);
              }
            }

            setCurrentRightRowIdx(0);
            setCurrentRowIdx((prev) => prev + 1);
            setHasMatchInInnerLoop(false);
          }
        } else {
          // Standard Single Table Animation
          setCheckingCondition(true);

          delay(600).then(() => {
            setCheckingCondition(false);
            const isMatch = parsedAST.where
              ? evaluateCondition(parsedAST.where, leftRow)
              : true;

            if (isMatch) {
              setHighlightedRows((prev) => [
                ...prev,
                leftRow.id || leftRow.order_id || currentRowIdx,
              ]);
              setResultSetData((prev) => [...prev, leftRow]);
            }

            delay(300).then(() => {
              setCurrentRowIdx((prev) => prev + 1);
            });
          });
        }
      } else {
        setCurrentRowIdx(-1);
        setCurrentRightRowIdx(-1);
        setStep(5); // Move to GROUP BY
      }
    } else if (step === 5) {
      if (parsedAST.groupby) {
        setResultSetData((prev) => {
          const groupCol = parsedAST.groupby.columns
            ? parsedAST.groupby.columns[0].column
            : parsedAST.groupby[0].column;

          const buckets = {};

          prev.forEach((row) => {
            const key = row[groupCol];
            if (!buckets[key]) buckets[key] = [];
            buckets[key].push(row);
          });

          const newResultSet = [];
          Object.keys(buckets).forEach((key) => {
            if (parsedAST.having) {
              const passesHaving = evaluateHavingCondition(
                parsedAST.having,
                buckets[key]
              );
              if (!passesHaving) return;
            }

            const newRow = { [groupCol]: key };

            if (parsedAST.columns) {
              parsedAST.columns.forEach((col) => {
                if (col.expr.type === "aggr_func") {
                  const aggrName = col.expr.name;
                  const argName = col.expr.args?.expr?.value || "*";
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
        const hasGlobalAggregates =
          parsedAST.columns &&
          parsedAST.columns.some(
            (col) => col.expr && col.expr.type === "aggr_func"
          );
        if (hasGlobalAggregates) {
          setResultSetData((prev) => {
            const newRow = {};
            parsedAST.columns.forEach((col) => {
              if (col.expr.type === "aggr_func") {
                const aggrName = col.expr.name;
                const argName = col.expr.args?.expr?.value || "*";
                const alias = col.as || `${aggrName}(${argName})`;
                newRow[alias] = evaluateAggregate(col.expr, prev);
              } else if (col.expr.type === "column_ref") {
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
      delay(parsedAST.orderby ? 600 : 0).then(() => setStep(6));
    } else if (step === 6) {
      if (parsedAST.orderby) {
        setResultSetData((prev) => {
          const sorted = [...prev];
          const orderBy = parsedAST.orderby[0];
          const column = orderBy.expr.column;
          const type = orderBy.type;
          sorted.sort((a, b) => {
            if (a[column] < b[column]) return type === "DESC" ? 1 : -1;
            if (a[column] > b[column]) return type === "DESC" ? -1 : 1;
            return 0;
          });
          return sorted;
        });
      }
      delay(parsedAST.limit ? 600 : 0).then(() => setStep(7));
    } else if (step === 7) {
      setResultSetData((prev) => {
        let projected = prev.map((row) => projectRow(row, parsedAST.columns));

        if (parsedAST.distinct === "DISTINCT") {
          const seen = new Set();
          projected = projected.filter((row) => {
            const stringified = JSON.stringify(row);
            if (seen.has(stringified)) return false;
            seen.add(stringified);
            return true;
          });
        }

        if (
          parsedAST.limit &&
          parsedAST.limit.value &&
          parsedAST.limit.value.length > 0
        ) {
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
    isPaused,
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
    speed,
    setSpeed,
    runQuery,
    resetQuery,
    pauseQuery,
    stepQuery,
  };
}

function projectRow(row, columnsAST) {
  if (
    !columnsAST ||
    (columnsAST.length === 1 &&
      (columnsAST[0].expr.type === "star" ||
        columnsAST[0].expr.column === "*"))
  ) {
    return row; // SELECT *
  }

  const projected = {};
  columnsAST.forEach((col) => {
    const expr = col.expr;
    const alias = col.as;

    if (expr.type === "column_ref") {
      const colName = expr.column;
      const targetName = alias || colName;

      if (expr.table) {
        const prefixedKey = `${expr.table}.${colName}`;
        if (prefixedKey in row) {
          projected[targetName] = row[prefixedKey];
          return;
        }
      }
      projected[targetName] = row[colName];
    } else if (expr.type === "aggr_func") {
      const aggrName = expr.name;
      const argName = expr.args?.expr?.value || "*";
      const key = alias || `${aggrName}(${argName})`;
      if (key in row) {
        projected[key] = row[key];
      }
    } else {
      const key = alias || expr.value;
      projected[key] = expr.value;
    }
  });
  return projected;
}
