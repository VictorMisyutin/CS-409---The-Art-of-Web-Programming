import React from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <body>
      <header className="App-header">
        <p className="logo">Vic Vic Space Adventures</p>
        <div className="nav-links">
          <p><a href="">list</a></p>
          <p><a href="">gallary</a></p>
          <p><a href="">more</a></p>
        </div>
      </header>
      <div className="hero">
        <h1>Welcome to Vic Vic Space Adventures</h1>
        <hr />
        <h2 className="description">The one stop shop for all of you space needs.</h2>
      </div>
    </body>
  );
}

export default App;
