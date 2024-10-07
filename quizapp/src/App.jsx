import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; 
import Login from './components/Login';
import Quiz from './components/Quiz';
import './App.css'; 

function App() {
  return (
    <Router>
      <Routes> 
        <Route path="/quiz" element={<Quiz />} /> 
        <Route path="/" element={<Login />} /> 
      </Routes>
    </Router>
  );
}

export default App;

