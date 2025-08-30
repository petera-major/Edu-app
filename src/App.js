import React from 'react';
import Dashboard from './Dashboard';
import Class from './Class';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
    <Routes>
    <Route path="/" element={<Dashboard />} />
    <Route path="/class" element={<Class />} />
    </Routes>
    </BrowserRouter>
  );
}

export default App;