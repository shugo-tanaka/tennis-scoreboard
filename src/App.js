import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Editor from "./pages/editor";
import Observer from "./pages/observer";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/editor" element={<Editor />} />
        <Route path="/observer" element={<Observer />} />
      </Routes>
    </Router>
  );
}

export default App;
