import './App.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom';
import PhotoDetail from './PhotoDetail';

// Define a type for the API response
interface NasaResponse {
  title: string;
  url: string;
  explanation: string;
  date: string;
}

function App() {
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('date');
  const [order, setOrder] = useState<string>('asc');
  const [maxCount, setMaxCount] = useState<string>('none');
  const [results, setResults] = useState<NasaResponse[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [galleryImages, setGalleryImages] = useState<NasaResponse[]>([]);
  const [filter, setFilter] = useState<string>(''); // New filter state
  const [isFiltering, setIsFiltering] = useState<boolean>(false); // New filtering loading state

  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const API_KEY = '2bJJ8abZ0OMiRMascSH5LGAbfqk3rqzGEQc1Plml';
    const url = `https://api.nasa.gov/planetary/apod?api_key=${API_KEY}&start_date=${startDate}&end_date=${endDate}`;

    try {
      const response = await axios.get<NasaResponse[]>(url);
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
        return 0;
      });

      const maxResults = maxCount !== 'none' ? parseInt(maxCount, 10) : sortedResults.length;
      setResults(sortedResults.slice(0, maxResults));
    } catch (error) {
      console.error('Error fetching data from NASA API', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchGalleryImages = async () => {
    const API_KEY = '2bJJ8abZ0OMiRMascSH5LGAbfqk3rqzGEQc1Plml';
    const today = new Date();
    const lastYear = new Date();
    lastYear.setFullYear(today.getFullYear() - 1);
    const startDate = lastYear.toISOString().split('T')[0];
    const endDate = today.toISOString().split('T')[0];
    const url = `https://api.nasa.gov/planetary/apod?api_key=${API_KEY}&start_date=${startDate}&end_date=${endDate}`;

    try {
      const response = await axios.get<NasaResponse[]>(url);
      setGalleryImages(response.data);
    } catch (error) {
      console.error('Error fetching gallery images from NASA API', error);
    }
  };

  useEffect(() => {
    fetchGalleryImages();
  }, []);

  // Filter results based on the selected filter
  const filteredGalleryImages = galleryImages.filter(image => {
    // Check if image.url exists before calling endsWith
    if (filter && image.url) {
      return image.title.toLowerCase().includes(filter.toLowerCase()) ||
             image.explanation.toLowerCase().includes(filter.toLowerCase());
    }
    return true;
  });

  const handleFilterChange = (newFilter: string) => {
    setIsFiltering(true); // Set filtering loading state to true
    setFilter(newFilter); // Update the filter state

    // Simulate filtering delay (you can remove this if you fetch/filter data directly)
    setTimeout(() => {
      setIsFiltering(false); // Reset filtering loading state
    }, 500); // Adjust the delay as needed
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
    return '';
  };

  return (
    <Router>
      <header className="App-header">
        <p><Link to='/' className="logo">Vic Vic Space Adventures</Link></p>
        <div className="nav-links">
          <p><Link to="/list">List</Link></p>
          <p><Link to="/gallery">Gallery</Link></p>
        </div>
      </header>
      <Routes>
        <Route path="/" element={<Navigate to="/list" />} />
        <Route
          path="/list"
          element={
            <div className='home'>
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
                  <img src="clipart4050.png" alt="Space and planet exploration" />
                </div>
              </div>
              <div className="query-section">
                <div className="query-input">
                  <form onSubmit={handleSearch}>
                    <label htmlFor="search-string"> Search:</label>
                    <input
                      type="text"
                      id="search-string"
                      name="search-string"
                      placeholder="Search by title or description"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <label htmlFor="start-date">Start Date:</label>
                    <input
                      type="date"
                      id="start-date"
                      name="start-date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      required
                    /><br />

                    <label htmlFor="end-date">End Date:</label>
                    <input
                      type="date"
                      id="end-date"
                      name="end-date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      required
                    /><br />

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
                  {isLoading ? (
                    <div className="loading-spinner">
                      <p>Loading...</p>
                    </div>
                  ) : (
                    results.length > 0 && results.map((result, index) => (
                      <div key={index} className='result-cell'>
                        <Link to={`/photo/${index}`} className="result-link">
                          <h3 className='result-title'>{result.title} ({result.date})</h3>
                          {getYouTubeEmbedUrl(result.url) ? (
                            <iframe
                              width="100%"
                              height="315"
                              src={getYouTubeEmbedUrl(result.url)}
                              title={result.title}
                              allowFullScreen
                            ></iframe>
                          ) : (
                            <img src={result.url} alt={result.title} style={{ width: '100%', height: 'auto' }} />
                          )}
                        </Link>
                      </div>
                    ))
                  )}
                </div>

              </div>
            </div>
          }
        />
        <Route
          path="/gallery"
          element={
            <div className="gallery">
              <div className="filters">
                <button 
                  className={filter === 'lunar eclipse' ? 'active' : ''} 
                  onClick={() => handleFilterChange('lunar eclipse')}
                >
                  Lunar Eclipse
                </button>
                <button 
                  className={filter === 'meteor shower' ? 'active' : ''} 
                  onClick={() => handleFilterChange('meteor shower')}
                >
                  Meteor Shower
                </button>
                <button 
                  className={filter === 'mars' ? 'active' : ''} 
                  onClick={() => handleFilterChange('mars')}
                >
                  Mars
                </button>
                <button 
                  className={filter === 'jupiter' ? 'active' : ''} 
                  onClick={() => handleFilterChange('jupiter')}
                >
                  Jupiter
                </button>
                <button onClick={() => handleFilterChange('')}>Clear Filters</button>
              </div>
              {isFiltering ? (
                <div className="loading-spinner">
                  <p>Loading filtered results...</p>
                </div>
              ) : (
                <div className="gallery-grid">
                  {filteredGalleryImages.length > 0 ? (
                    filteredGalleryImages.map((image, index) => (
                      <div key={index} className='gallery-item'>
                        <h3>{image.title}</h3>
                        {image.url && ( // Check if image.url exists before accessing it
                          image.url.endsWith('.jpg') || image.url.endsWith('.png') ? (
                            <img src={image.url} alt={image.title} style={{ width: '100%', height: 'auto' }} />
                          ) : (
                            <iframe
                              width="100%"
                              height="315"
                              src={getYouTubeEmbedUrl(image.url)}
                              title={image.title}
                              allowFullScreen
                            ></iframe>
                          )
                        )}
                      </div>
                    ))
                  ) : (
                    <p>No images found for the selected filters.</p>
                  )}
                </div>
              )}
            </div>
          }
        />
        <Route path="/photo/:id" element={<PhotoDetail results={results} />} />
      </Routes>
    </Router>
  );
}

export default App;
