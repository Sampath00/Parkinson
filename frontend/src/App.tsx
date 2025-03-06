import { Routes, Route, Link } from "react-router-dom";
import Navbar from "./components/Navbar";
import { Causes, Diagnosis, Lifestyle, Overview, Symptoms } from "./pages";

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-blue-100">
      <Navbar />
      <div className="p-4">
        <Routes>
          <Route path="/" element={<Overview />} />
          <Route path="/symptoms" element={<Symptoms />} />
          <Route path="/causes" element={<Causes />} />
          <Route path="/diagnosis" element={<Diagnosis />} />
          <Route path="/lifestyle" element={<Lifestyle />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
