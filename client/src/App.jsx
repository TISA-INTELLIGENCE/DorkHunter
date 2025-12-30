import NotFound from "./error/NotFound";
import Home from "./Home/Home";

import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";

import Results from "./Home/Results";
import Queries from "./components/Queries/Queries";
import QueryDetails from "./components/Queries/QueriesDetails";
import QueryLayout from "./components/Queries/layout/QueryLayout";
import ScansLayout from "./components/scans/Layout/ScansLayout";
import Scans from "./components/scans/Scans";
import ScanDetails from "./components/scans/ScanDetails";
import RootLayout from "./layout/RootLayout";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route element={<RootLayout />}>
        <Route index element={<Home />} />
        <Route path="results" element={<Results />} />
        <Route path="queries" element={<QueryLayout />}>
          <Route index element={<Queries />} />
          <Route path=":query" element={<QueryDetails />} />
        </Route>

        <Route path="scans" element={<ScansLayout />}>
          <Route index element={<Scans />} />
          <Route path=":id" element={<ScanDetails />} />
        </Route>
      </Route>
      <Route path="*" element={<NotFound />} />
    </Route>
  )
);
function App() {
  return <RouterProvider router={router} />;
}

export default App;
