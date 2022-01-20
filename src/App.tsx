import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from "react-router-dom";
import logo from './logo.svg';
import './App.css';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import About from './pages/About';
import Collections from './pages/Collections';
import NotFound from './pages/NotFound';

function App() {
  return (
    <Router>
      <div className='pt-20'>
        <Header />
        <Sidebar />
        <div className='p-4 ml-64'>
          <Routes>
            <Route path="/collections" element={<Collections />}></Route>
            <Route path="/about" element={<About />}></Route>
            <Route path="/" element={<Dashboard />}></Route>
            <Route path="*" element={<NotFound />}></Route>
          </Routes>
          
        </div>
      </div>
    </Router>
    
  );
}

export default App;
