<div align="center">
  <img src="./public/favicon.svg" alt="VisualDB Logo" width="80" height="80">
  <br/>
  <h1>VisualDB</h1>
  <p><b>Learn SQL & Database Concepts Visually.</b></p>
  <p>Animations • Interactive Simulations • Open Source</p>
  
  [![React](https://img.shields.io/badge/React-19-blue?style=flat-square&logo=react)](https://react.dev/)
  [![Vite](https://img.shields.io/badge/Vite-6.0-purple?style=flat-square&logo=vite)](https://vitejs.dev/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
  [![CI](https://github.com/Itsmeinayath/visualdb/actions/workflows/ci.yml/badge.svg)](https://github.com/Itsmeinayath/visualdb/actions)
  [![Vercel](https://img.shields.io/vercel/deployment/itsmeinayath/visualdb/main?style=flat-square)](https://visualdb-sooty.vercel.app/)
  [![PRs Welcome](https://img.shields.io/badge/PRs-Welcome-brightgreen?style=flat-square)](https://github.com/Itsmeinayath/visualdb/pulls)
  [![good first issue](https://img.shields.io/badge/good--first--issue-welcome-brightgreen?style=flat-square)](https://github.com/Itsmeinayath/visualdb/labels/good%20first%20issue)
  [![License](https://img.shields.io/github/license/Itsmeinayath/visualdb?style=flat-square)](LICENSE)
</div>

---

## 💡 The Problem

Most SQL tutorials teach syntax. Students can easily memorize how to write an `INNER JOIN` or a `GROUP BY` query. However, when asked *why* a query returns a specific set of rows, or *how* the engine calculates it under the hood, many struggle. 

**VisualDB teaches execution.**

Instead of just returning a static table of results, VisualDB breaks down the SQL execution pipeline step-by-step. It uses animations and interactive execution traces to show exactly how rows are scanned, filtered, grouped, and sorted.

It is built for college students, educators, bootcamp attendees, and self-learners to understand how databases *think*.

---

## 🚀 Live Demo

**[Play with VisualDB Live](https://visualdb-sooty.vercel.app/)** 

---

## 🛠️ Tech Stack

VisualDB is a 100% client-side application. There is no backend server or real database. Everything runs directly in the browser!

- **Framework:** React 19 + Vite
- **Styling:** Tailwind CSS (v4)
- **Icons:** Lucide React
- **AST Parsing:** `node-sql-parser`
- **Deployment:** Vercel

---

## 👨‍💻 How the Engine Works (For Contributors)

We built VisualDB to be incredibly easy to contribute to. You do not need to be an expert in compilers to build a new SQL visualization!

The architecture is strictly decoupled:
1. **The SQL Engine:** `src/hooks/useExecutionEngine.js` parses the SQL string into an Abstract Syntax Tree (AST), runs the query step-by-step using `setTimeout`, and manages the state.
2. **The UI Modules:** React components in `src/modules/` simply consume the hook to display the state.

### Want to build a new module? It's this easy:

```jsx
import { useExecutionEngine } from "../../hooks/useExecutionEngine";
import Table from "../../components/Table";

export default function MyNewModule() {
  // 1. Hook into the engine with your query
  const { step, activeTable, tableData, resultSetData, runQuery } = useExecutionEngine(
    "SELECT * FROM students WHERE gpa > 3.5;"
  );

  return (
    <div>
      <button onClick={() => runQuery()}>Play Animation</button>
      
      {/* 2. Show the engine's current state based on 'step' */}
      {step === 0 && <p>Parsing AST...</p>}
      {step === 4 && <p>Filtering rows...</p>}
      
      {/* 3. Render the tables automatically */}
      <Table data={tableData} title="Source Table" />
      <Table data={resultSetData} title="Result Set" />
    </div>
  );
}
```

---

## 🌟 Our Grand Vision

VisualDB is just the beginning. Our ultimate goal is to build an entire ecosystem of tools that make Computer Science visual. 

Read our **[VisualCS Manifesto (VISION.md)](VISION.md)** to see where we are heading next (VisualGit, VisualDocker, VisualDSA, and more). If our mission resonates with you, we'd love for you to join us on this journey!

---

## 🤝 Contributing

visualdb is a small, beginner-friendly project that visualizes simple database concepts and lets learners tinker with queries and data structures in the browser. If you’re learning JavaScript, databases, or UI/UX for developer tools, this project is a great place to contribute and learn.

- Live demo: https://visualdb-sooty.vercel.app/
- Want to help? See [CONTRIBUTING.md](CONTRIBUTING.md) for how to get started.

### How to contribute (short)
- Find issues labeled `good first issue` for an easy start.
- We welcome documentation improvements, bug fixes, and new examples.
- Please follow the code style and run the dev server locally before opening a PR.

### Project roadmap
- Improve onboarding and first-timer issues
- Add more interactive examples and tutorials
- Add test coverage and CI checks

## 🌟 Contributors

A massive thank you to the developers who have already contributed features to VisualDB:
- [**@Pooja250588**](https://github.com/Pooja250588) (Reset Progress, Copy to Clipboard)
- [**@imabhirajj**](https://github.com/imabhirajj) (Dark/Light toggle & CSS Improvements)
- [**@Karim-Ashraf1**](https://github.com/Karim-Ashraf1) (UNION Visualization Module)
- And to everyone else submitting PRs and reporting issues!

## 🗺️ Roadmap

We have huge plans for new modules, custom CSV uploads, execution metrics, and more. 

👉 **[View the full Feature Roadmap (ROADMAP.md)](ROADMAP.md)** to see what we are building next (and what you can help us build!).

**Version 1 (Current Focus)**
- [x] SELECT
- [x] WHERE (Filtering)
- [x] ORDER BY (Sorting)
- [x] LIMIT (Truncation)
- [x] GROUP BY (Hash Aggregation)
- [x] Custom Query Playground (AST Parsing)
- [x] INNER JOIN
- [x] LEFT JOIN
- [x] Multiple Progressive Challenges per Module
- [x] Execution Trace Play/Pause/Speed Controls

**Version 2 (Database Design)**
- [ ] Primary Keys & Foreign Keys
- [ ] ER Diagrams
- [ ] Normalization (1NF, 2NF, 3NF)

**Version 3 (Advanced Internals)**
- [ ] Transactions & ACID properties
- [ ] Indexing (B-Trees)
- [ ] Query Optimizer

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
