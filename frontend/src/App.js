// src/App.js
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import JobApplication from "./pages/JobApplication";
import GetStarted from "./pages/GetStarted";
import FormikExamplePage from "./pages/FormikExamplePage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<GetStarted />} />
        <Route path="/dashboard" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="job-application" element={<JobApplication />} />

          <Route path="formik-example-page" element={<FormikExamplePage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
