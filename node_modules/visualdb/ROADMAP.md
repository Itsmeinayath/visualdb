# 🗺️ VisualDB Product Roadmap

This document outlines the high-impact features we are planning to build next. If you are a contributor looking for a substantial project to tackle, this is the place to look!

The best part of this roadmap? **None of these features require a backend or a database.** Everything in VisualDB is powered purely by modern browser APIs, ensuring the app remains lightning-fast, free to host, and fully secure.

---

## 1. Custom CSV Data Upload (100% Client-Side)
*Allow users to practice SQL on their own data instead of just the mock Students table.*

**How it works without a backend:**
1. We add an "Upload CSV" button in the UI using standard HTML `<input type="file" />`.
2. When the user selects a file, the browser uses the `FileReader` API to read the text into memory.
3. We pass that text through a library like `PapaParse`, which converts the CSV rows into a JavaScript array of objects.
4. We inject this array into the Engine's `tableData` state.
5. The user can now run visual SQL queries against their own data!

**Impact:** Data science students can upload real datasets (Kaggle, Excel exports) and visualize their queries instantly with zero server costs or security risks.

---

## 2. Query Execution History & Saved Queries
*Keep a running history of successful queries so users can easily jump back to previous work.*

**How it works without a backend:**
1. We use the browser's built-in `window.localStorage` API.
2. Every time the user successfully executes a query, we append it to a list stored in `localStorage`.
3. We render a sidebar component that reads from this local storage. If a user clicks a previous query, it instantly loads back into the editor.

**Impact:** Massive quality-of-life improvement. Users won't lose their complex queries if they accidentally refresh the page or try a different approach.

---

## 3. Visual Execution Metrics (Teaching Optimization)
*Show a "Stats Panel" after a query finishes to teach students about query efficiency.*

**How it works:**
1. We already track the nested loop indices in the execution engine.
2. We add counters to `useExecutionEngine.js` for metrics like `rowsScanned`, `rowsFiltered`, and `executionTimeMs`.
3. When `isFinished` is true, we display a dashboard showing these metrics.

**Impact:** It teaches students that a query isn't just about getting the right answer—it's about getting it *efficiently*. If they see a query scanned 2,500 rows to find 2 results, they learn the value of optimization.

---

## 4. `UNION` and `UNION ALL` Module
*A visual explanation of how databases combine result sets vertically.*

**How it works:**
1. We create a new module `UnionModule.jsx`.
2. The engine parses the `UNION` keyword from the AST.
3. The animation executes the first `SELECT`, then executes the second `SELECT`.
4. Visually, instead of a side-by-side join, the two tables **stack vertically** on top of each other.
5. If it's a standard `UNION` (not `ALL`), the engine runs a deduplication step at the end (similar to our `DISTINCT` module) where duplicate rows flash red and disappear.

**Impact:** `UNION` is conceptually difficult for beginners who are used to `JOIN`. A vertical stacking animation makes it instantly intuitive.

---

## 5. SQL Auto-Formatter (Prettier)
*A "Format" button that magically cleans up messy, unindented SQL.*

**How it works:**
1. We install a library like `sql-formatter`.
2. We add a formatting button next to the query editor.
3. When clicked, it takes the `queryInput`, runs it through the formatter, and replaces the editor text with the clean, perfectly indented, capitalized SQL.

**Impact:** Beginners write notoriously unreadable SQL. This enforces good formatting habits automatically.

---

## Ready to build one of these?
Check out our [Contributing Guide](CONTRIBUTING.md) to get your local environment set up, and then open a Pull Request! We are excited to review it.
