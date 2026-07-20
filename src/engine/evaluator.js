// AST Evaluator for WHERE clause
export const evaluateCondition = (ast, row) => {
  if (!ast) return true;
  
  if (ast.type === 'binary_expr') {
    const leftVal = ast.left.type === 'column_ref' ? row[ast.left.column] : ast.left.value;
    const rightVal = ast.right.type === 'column_ref' ? row[ast.right.column] : ast.right.value;
    
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
  
  return null;
};
