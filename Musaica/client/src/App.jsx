import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AudioProvider } from './context/AudioContext';
import Nav from './components/Nav';
import Home from '../pages/Home';
import Editor from '../pages/Editor';
import Tools from '../pages/Tools';

function App() {
  return (
    <AudioProvider>
      <div className="app">
        <Nav />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/editor" element={<Editor />} />
            <Route path="/tools/*" element={<Tools />} />
          </Routes>
        </main>
      </div>
    </AudioProvider>
  );
}

export default App;