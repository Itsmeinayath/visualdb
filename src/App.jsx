import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import SelectModule from "./modules/select/SelectModule";
import WhereModule from "./modules/where/WhereModule";
import OrderByModule from "./modules/orderby/OrderByModule";
import PlaygroundModule from "./modules/playground/PlaygroundModule";
import LimitModule from "./modules/limit/LimitModule";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="select" element={<SelectModule />} />
          <Route path="where" element={<WhereModule />} />
          <Route path="orderby" element={<OrderByModule />} />
          <Route path="limit" element={<LimitModule />} />
          <Route path="playground" element={<PlaygroundModule />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
