# Contributing to VisualDB

First off, thank you for considering contributing to VisualDB! 🎉 We're excited to have you here. VisualDB is an open-source project aimed at helping students and educators understand how databases *execute* queries through interactive, visual animations.

## 🚀 Getting Started

To get the project running locally on your machine:

1. **Fork the repository** on GitHub.
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/visualdb.git
   cd visualdb
   ```
3. **Install dependencies**:
   ```bash
   npm install
   ```
4. **Start the development server**:
   ```bash
   npm run dev
   ```
5. Open `http://localhost:5173` (or the URL Vite provides) in your browser.

## 🛠️ Architecture Overview

VisualDB is a 100% client-side React 19 application built with Vite and Tailwind CSS. It uses `node-sql-parser` to parse SQL into an Abstract Syntax Tree (AST).

The architecture is cleanly separated:
- **`src/hooks/useExecutionEngine.js`**: The core simulation engine. It handles parsing the SQL, managing the animation loop speed and pauses, and running the query logic.
- **`src/hooks/useChallenges.js`**: Manages the multi-challenge question system for each module.
- **`src/modules/`**: Contains the individual learning modules (e.g., SELECT, WHERE, GROUP BY).
- **`src/components/`**: Reusable UI components like the `ChallengePanel`, `Query` editor, and data `Table`.

## 💡 How You Can Contribute

We have issues tagged with `good first issue` to help you find a starting point. Here are some areas where contributions are highly valued:

1. **New Modules:** We'd love to see modules for `SUBQUERY`, `UNION`, `INSERT/UPDATE`, or advanced concepts like Indexing and Normalization.
2. **More Challenge Questions:** Expanding the existing modules with more questions helps students practice.
3. **Mobile Responsiveness:** Improving the layout on smaller screens.
4. **Bug Fixes:** Check the issues tab for any reported bugs.
5. **Documentation:** Improving README, adding code comments, or writing better module explanations.

## 📝 Making a Pull Request (PR)

1. **Create a new branch** for your feature or bug fix:
   ```bash
   git checkout -b feature/my-awesome-feature
   ```
2. **Write your code**. If you are building a new module, use the existing modules as a template (they all use the `useExecutionEngine` and `useChallenges` hooks).
3. **Test your changes** locally. Make sure the app builds without errors (`npm run build`).
4. **Commit your changes** with a clear, descriptive commit message.
5. **Push to your fork**:
   ```bash
   git push origin feature/my-awesome-feature
   ```
6. **Open a Pull Request** against the `main` branch of the original `visualdb` repository.

## 💬 Need Help?

If you get stuck or have questions about how a specific part of the code works, feel free to open a Discussion on GitHub or ask a question in the issues section.

Happy Coding!
