import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from "react-router-dom";
import logo from './logo.svg';
import './App.css';
import 'react-toastify/dist/ReactToastify.css';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import About from './pages/About';
import Collections from './pages/Collections';
import NotFound from './pages/NotFound';
import { Toaster } from 'react-hot-toast';
import CustomToaster, { CustomToasterComponent } from './components/CustomToaster';
import Analytics from './pages/Analytics';
import ModalRoot from './modules/modals/components/ModalRoot';
import { useEvents } from './hooks/useEvents';
import MiniDrawer from './components/MiniDrawer';

function App() {
  const { status } = useEvents();

  return (
    <Router>
      <ModalRoot />
      <CustomToaster />
      <CustomToasterComponent status={status} />
      <MiniDrawer />
      <div className='pt-20'>
        <Header />
        <Sidebar />
        <div className='p-4 ml-44'>
          <Routes>
            <Route path="/collections" element={<Collections />}></Route>
            <Route path="/analytics" element={<Analytics />}></Route>
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
