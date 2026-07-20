# VisualDB
**See Databases. Don't Just Read About Them.**

VisualDB is a free, open-source visual DBMS learning platform. It is designed to solve the problem of students memorizing SQL syntax without actually understanding how database execution engines process data under the hood.

## 🚀 Features

* **SaaS Developer Aesthetic:** Built with a dense, professional UI inspired by tools like Vercel and Supabase.
* **Interactive Modules:** 
  * `SELECT`: Visualizes table scanning and relation resolution.
  * `WHERE`: Features a real-time boolean evaluation debugger.
* **Custom Query Playground:** Integrated with an AST parser (`node-sql-parser`), allowing students to type their own custom SQL queries and watch the execution engine evaluate them dynamically against multiple datasets (`students`, `employees`, `orders`).
* **Dual Table View:** Instantly compares the untouched "Source Table" with the dynamically generated "Result Set" to accurately model how databases buffer output.

## 🛠️ Tech Stack
* **Framework:** React + Vite
* **Styling:** Tailwind CSS v4 (Strict Zinc monochrome palette)
* **Animations:** Framer Motion (Spring physics)
* **SQL Parser:** `node-sql-parser`

## 🏃‍♂️ Running Locally

1. Clone the repository:
   ```bash
   git clone https://github.com/Itsmeinayath/visualdb.git
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open `http://localhost:5173` in your browser.
