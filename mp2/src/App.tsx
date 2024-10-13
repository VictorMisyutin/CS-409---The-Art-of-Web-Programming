import './App.css';

function App() {
  return (
    <body>
      <header className="App-header">
        <p className="logo">Vic Vic Space Adventures</p>
        <div className="nav-links">
          <p><a href="">list</a></p>
          <p><a href="">gallery</a></p>
          <p><a href="">more</a></p>
        </div>
      </header>
      <div className="hero">
        <div className="left">
          <h1>Vic Vic Space Adventures</h1>
          <h2 className="description">
            An interactive website that explores the fascinating world of plants and moons. Discover detailed 
            information about various plant species and celestial moons, and embark on an educational journey through
            the wonders of nature and space. Whether you're a botany enthusiast or a space explorer, Vic Vic Space Adventures
            has something for everyone!
          </h2>
        </div>
        <div className="right">
          <img src="clipart4050.png" alt="Space and plant exploration"/>
        </div>
      </div>
      <div className="query-section">
        <div className="query-input">
          <form action="/search" method="get">
            {/* Search Parameter Input */}
            <label htmlFor="search">Search:</label>
            <input type="text" id="search" name="search" required /><br />

            {/* Sort By Dropdown */}
            <label htmlFor="sort">Sort by:</label>
            <select id="sort" name="sort">
              <option value="rank">Rank</option>
              <option value="title">Title</option>
              <option value="date">Date</option>
            </select><br />

            {/* Ascending/Descending Radio Buttons */}
            <label htmlFor="order">Order:</label>
            <div className="radio-container">
              <input type="radio" id="ascending" name="order" value="asc" defaultChecked />
              <label htmlFor="ascending">Ascending</label>
              <input type="radio" id="descending" name="order" value="desc" />
              <label htmlFor="descending">Descending</label><br /><br />
            </div>

          </form>
        </div>
        <div className="query-results">
          {/* Results will be displayed here */}
        </div>
      </div>
    </body>
  );
}

export default App;
