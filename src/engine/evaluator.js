// AST Evaluator for WHERE / ON clauses
export const evaluateCondition = (ast, row) => {
  if (!ast) return true;
  
  if (ast.type === 'binary_expr') {
    const leftVal = resolveValue(ast.left, row);
    const rightVal = resolveValue(ast.right, row);
    
    switch (ast.operator) {
      case '=': return leftVal == rightVal;
      case '!=': return leftVal != rightVal;
      case '>': return leftVal > rightVal;
      case '<': return leftVal < rightVal;
      case '>=': return leftVal >= rightVal;
      case '<=': return leftVal <= rightVal;
      case 'AND': return evaluateCondition(ast.left, row) && evaluateCondition(ast.right, row);
      case 'OR': return evaluateCondition(ast.left, row) || evaluateCondition(ast.right, row);
      default: return true;
    }
  }
  return true;
};

// Resolve a single AST node value against a row.
// Handles column_ref with optional table prefix (e.g. students.course_id vs courses.course_id).
// For JOIN rows, we store columns with a table-prefixed key so there's no collision.
function resolveValue(node, row) {
  if (node.type === 'column_ref') {
    const col = node.column;
    const table = node.table;

    // If there's a table prefix, try the prefixed key first (e.g. "students.course_id")
    if (table) {
      const prefixedKey = `${table}.${col}`;
      if (prefixedKey in row) return row[prefixedKey];
    }
    // Fall back to plain column name
    return row[col];
  }
  // Literal value
  return node.value;
}

// Evaluator for Aggregate Functions (e.g. COUNT, SUM) over a bucket of rows
export const evaluateAggregate = (aggrAST, rows) => {
  if (!aggrAST || aggrAST.type !== 'aggr_func') return null;
  
  const name = aggrAST.name.toUpperCase();
  
  if (name === 'COUNT') {
    return rows.length;
  }
  
  if (name === 'SUM') {
    const col = aggrAST.args.expr.column;
    return rows.reduce((acc, row) => acc + (Number(row[col]) || 0), 0);
  }

  if (name === 'MAX') {
    const col = aggrAST.args.expr.column;
    return Math.max(...rows.map(r => Number(r[col]) || 0));
  }

  if (name === 'MIN') {
    const col = aggrAST.args.expr.column;
    return Math.min(...rows.map(r => Number(r[col]) || 0));
  }
  
  return null;
};
