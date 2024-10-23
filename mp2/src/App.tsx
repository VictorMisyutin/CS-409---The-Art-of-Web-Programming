import './App.css';
import React, { useState } from 'react';
import axios from 'axios';

// Define a type for the API response
interface NasaResponse {
  title: string;
  url: string;
  explanation: string;
  date: string; // Add date field
}

function App() {
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('date');
  const [order, setOrder] = useState<string>('asc');
  const [maxCount, setMaxCount] = useState<string>('none'); // State for max count
  const [results, setResults] = useState<NasaResponse[]>([]);

  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Replace with your NASA API key
    const API_KEY = 'API_KEY';
    const url = `https://api.nasa.gov/planetary/apod?api_key=${API_KEY}&start_date=${startDate}&end_date=${endDate}`;

    try {
      const response = await axios.get<NasaResponse[]>(url);
      // Sort the results based on the selected criteria and order
      const sortedResults = response.data.sort((a, b) => {
        if (sortBy === 'date') {
          return order === 'asc'
            ? new Date(a.date).getTime() - new Date(b.date).getTime()
            : new Date(b.date).getTime() - new Date(a.date).getTime();
        } else if (sortBy === 'title') {
          return order === 'asc'
            ? a.title.localeCompare(b.title)
            : b.title.localeCompare(a.title);
        } else if (sortBy === 'explanation') {
          return order === 'asc'
            ? a.explanation.localeCompare(b.explanation)
            : b.explanation.localeCompare(a.explanation);
        }
        return 0; // Default case
      });

      // Handle max count - filter results if a count is selected
      const maxResults = maxCount !== 'none' ? parseInt(maxCount, 10) : sortedResults.length;
      setResults(sortedResults.slice(0, maxResults)); // Limit results
    } catch (error) {
      console.error('Error fetching data from NASA API', error);
    }
  };

  const getYouTubeEmbedUrl = (url: string) => {
    try {
      const urlObj = new URL(url);
      if (urlObj.hostname === 'www.youtube.com' || urlObj.hostname === 'youtube.com') {
        const videoId = urlObj.searchParams.get('v') || urlObj.pathname.split('/').pop();
        return `https://www.youtube.com/embed/${videoId}?autoplay=1`;
      } else if (urlObj.hostname === 'youtu.be') {
        return `https://www.youtube.com/embed/${urlObj.pathname.split('/').pop()}?autoplay=1`;
      }
    } catch (error) {
      console.error('Invalid URL:', url, error);
    }
    return ''; // Return an empty string if not a valid YouTube URL
  };

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
            An interactive website that explores the fascinating world of planets and moons. Discover detailed information 
            on the unique features and orbits of various celestial bodies. Embark on an educational journey through space 
            with captivating visuals and engaging content that brings the wonders of the cosmos to life.
          </h2>
        </div>
        <div className="right">
          <img src="clipart4050.png" alt="Space and plant exploration" />
        </div>
      </div>
      <div className="query-section">
        <div className="query-input">
          <form onSubmit={handleSearch}>
            {/* Start Date Input */}
            <label htmlFor="start-date">Start Date:</label>
            <input 
              type="date" 
              id="start-date" 
              name="start-date" 
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required 
            /><br />

            {/* End Date Input */}
            <label htmlFor="end-date">End Date:</label>
            <input 
              type="date" 
              id="end-date" 
              name="end-date" 
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required 
            /><br />

            {/* Max Count Dropdown */}
            <label htmlFor="max-count">Max Count:</label>
            <select 
              id="max-count" 
              value={maxCount}
              onChange={(e) => setMaxCount(e.target.value)}
            >
              <option value="none">None</option>
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="15">15</option>
              <option value="20">20</option>
            </select><br />

            {/* Sort By Dropdown */}
            <label htmlFor="sort-by">Sort By:</label>
            <select 
              id="sort-by" 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="date">Date</option>
              <option value="title">Title</option>
              <option value="explanation">Explanation</option>
            </select><br />

            {/* Ascending/Descending Radio Buttons */}
            <label htmlFor="order">Sort Order:</label>
            <div className="radio-container">
              <input 
                type="radio" 
                id="ascending" 
                name="order" 
                value="asc" 
                checked={order === 'asc'}
                onChange={(e) => setOrder(e.target.value)} 
              />
              <label htmlFor="ascending">Ascending</label>
              <input 
                type="radio" 
                id="descending" 
                name="order" 
                value="desc" 
                checked={order === 'desc'}
                onChange={(e) => setOrder(e.target.value)} 
              />
              <label htmlFor="descending">Descending</label><br /><br />
            </div>
            <button type="submit" className='search-button'>Search</button>
          </form>
        </div>
        <div className="query-results">
          {/* Results will be displayed here */}
          {results.length > 0 && results.map((result, index) => (
            <div key={index} className='result-cell'>
              <h3>{result.title} ({result.date})</h3>
              {getYouTubeEmbedUrl(result.url) ? (
                <iframe
                  width="100%"
                  height="315"
                  src={getYouTubeEmbedUrl(result.url)}
                  title={result.title}
                  frameBorder="0"
                  allowFullScreen
                ></iframe>
              ) : (
                <img src={result.url} alt={result.title} style={{ width: '100%', height: 'auto' }} />
              )}
              <p>{result.explanation}</p>
            </div>
          ))}
        </div>
      </div>
    </body>
  );
}

export default App;
