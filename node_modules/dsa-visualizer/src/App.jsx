import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import AppLayout from "./components/AppLayout";
import ProblemPage from "./pages/ProblemPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/learn" element={<AppLayout />}>
          <Route path="two-sum-ii" element={<ProblemPage problemId="two-sum-ii" />} />
          <Route path="valid-palindrome" element={<ProblemPage problemId="valid-palindrome" />} />
          <Route path="3sum" element={<ProblemPage problemId="3sum" />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
