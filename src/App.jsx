import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import BoardDetails from './components/BoardDetails';
import Boards from './components/Boards';

const App = () => {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Navigate to="/boards" replace />} />
        <Route path="/boards" element={<Boards />} />
        <Route path="/boards/:boardId" element={<BoardDetails />} />
      </Routes>
    </Router>
  );
};

export default App;
