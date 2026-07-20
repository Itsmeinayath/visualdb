# Architecture

VisualDB is built as a front-end only application using React.

## Key Concepts

1. **Modules**: Each SQL concept (SELECT, WHERE, JOIN) is its own self-contained module in `/src/modules`.
2. **Execution Engine**: Located in `/src/engine`, this handles parsing SQL strings into Abstract Syntax Trees (AST) and evaluating conditions against JSON data rows.
3. **Visualization State**: Animation is controlled by simple React `useEffect` timeouts and Framer Motion spring physics, reacting to a `step` state variable.
