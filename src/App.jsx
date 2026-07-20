import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import SelectModule from "./modules/select/SelectModule";
import WhereModule from "./modules/where/WhereModule";
import PlaygroundModule from "./modules/playground/PlaygroundModule";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="select" element={<SelectModule />} />
          <Route path="where" element={<WhereModule />} />
          <Route path="playground" element={<PlaygroundModule />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
