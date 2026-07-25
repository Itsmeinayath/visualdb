import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import SelectModule from "./modules/select/SelectModule";
import WhereModule from "./modules/where/WhereModule";
import OrderByModule from "./modules/orderby/OrderByModule";
import PlaygroundModule from "./modules/playground/PlaygroundModule";
import LimitModule from "./modules/limit/LimitModule";
import GroupByModule from "./modules/groupby/GroupByModule";
import HavingModule from "./modules/groupby/HavingModule";
import InnerJoinModule from "./modules/join/InnerJoinModule";
import LeftJoinModule from "./modules/join/LeftJoinModule";
import DistinctModule from "./modules/distinct/DistinctModule";
import AliasesModule from "./modules/aliases/AliasesModule";
import UnionModule from "./modules/union/UnionModule";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="select" element={<SelectModule />} />
          <Route path="where" element={<WhereModule />} />
          <Route path="innerjoin" element={<InnerJoinModule />} />
          <Route path="leftjoin" element={<LeftJoinModule />} />
          <Route path="groupby" element={<GroupByModule />} />
          <Route path="having" element={<HavingModule />} />
          <Route path="orderby" element={<OrderByModule />} />
          <Route path="limit" element={<LimitModule />} />
          <Route path="distinct" element={<DistinctModule />} />
          <Route path="aliases" element={<AliasesModule />} />
          <Route path="playground" element={<PlaygroundModule />} />
          <Route path="union" element={<UnionModule />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
