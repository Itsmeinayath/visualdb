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
