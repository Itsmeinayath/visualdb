# SQL Engine

VisualDB contains a mini SQL engine running entirely in the browser.

## Pipeline
1. **Parser**: Uses `node-sql-parser` to convert text into an AST.
2. **Evaluator**: A custom JS function that recursively traverses the AST `WHERE` nodes to evaluate binary expressions against row objects.
3. **Execution**: The engine iterates through the target JSON dataset and pushes valid rows to the `resultSetData` array.
