import './App.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom';
import PhotoDetail from './PhotoDetail';

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
  const [isGalleryLoading, setIsGalleryLoading] = useState<boolean>(true);
  const [filter, setFilter] = useState<string>('');
  const [filteredResults, setFilteredResults] = useState<NasaResponse[]>([]);

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
  
      const filteredResults = sortedResults.filter(result => 
        result.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        result.explanation.toLowerCase().includes(searchQuery.toLowerCase())
      );
  
      const maxResults = maxCount !== 'none' ? parseInt(maxCount, 10) : filteredResults.length;
      setResults(filteredResults.slice(0, maxResults));
    } catch (error) {
      console.error('Error fetching data from NASA API', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const clearResults = () => {
    setResults([]);
  };

  const fetchGalleryImages = async () => {
    setIsGalleryLoading(true);
    const API_KEY = '2bJJ8abZ0OMiRMascSH5LGAbfqk3rqzGEQc1Plml';
    
    const fixedDate = new Date('2024-10-22');
    const lastYear = new Date();
    lastYear.setFullYear(fixedDate.getFullYear() - 1);
    
    const startDate = lastYear.toISOString().split('T')[0];
    const endDate = fixedDate.toISOString().split('T')[0];
    
    const url = `https://api.nasa.gov/planetary/apod?api_key=${API_KEY}&start_date=${startDate}&end_date=${endDate}`;
    
    try {
      const response = await axios.get<NasaResponse[]>(url);
      setGalleryImages(response.data);
    } catch (error) {
      console.error('Error fetching gallery images from NASA API', error);
    } finally {
      setIsGalleryLoading(false);
    }
  };

  useEffect(() => {
    fetchGalleryImages();
  }, []);

  useEffect(() => {
    const updatedResults = galleryImages.filter(image => {
      if (filter && image.url) {
        return image.title.toLowerCase().includes(filter.toLowerCase()) ||
               image.explanation.toLowerCase().includes(filter.toLowerCase());
      }
      return true;
    });
    setFilteredResults(updatedResults);
  }, [filter, galleryImages]);

  const handleFilterChange = (newFilter: string) => {
    setFilter(newFilter);

    setTimeout(() => {
    }, 500);
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
        <p><Link to='/' className="logo" onClick={clearResults}>Vic Vic Space Adventures</Link></p>
        <div className="nav-links">
          <p><Link to="/list" onClick={clearResults}>List</Link></p>
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
                    Welcome to Vic Vic Space Adventures, an interactive website full of cool images and videos made by NASA and other 
                    space enthusiasts. Search for specific astronomical events, planets, and much more. The list view allows you
                    to enter specific searches within a specified time range. The gallery view has pre-selected filters you can use 
                    to explore more cool images and videos. Click on a result to gain more information about it. Enjoy and have fun! 
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
                    results.filter(result => 
                      result.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                      result.explanation.toLowerCase().includes(searchQuery.toLowerCase())
                    ).length > 0 && results.filter(result => 
                      result.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                      result.explanation.toLowerCase().includes(searchQuery.toLowerCase())
                    ).map((result, index) => (
                      <div key={index} className='result-cell'>
                        <Link to={`/list-photo/${index}`} className="result-link">
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
                  className={filter === 'Nebula' ? 'active' : ''} 
                  onClick={() => handleFilterChange('Nebula')}
                >
                  Nebula
                </button>
                <button 
                  className={filter === 'meteor shower' ? 'active' : ''} 
                  onClick={() => handleFilterChange('meteor shower')}
                >
                  Meteor Shower
                </button>
                <button 
                  className={filter === 'Comets' ? 'active' : ''} 
                  onClick={() => handleFilterChange('Comets')}
                >
                  Comets
                </button>
                <button 
                  className={filter === 'star' ? 'active' : ''} 
                  onClick={() => handleFilterChange('star')}
                >
                  Star
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
              {isGalleryLoading ? (
                <div className="loading-spinner">
                  <p>Loading gallery images...</p>
                </div>
              ) : (
                <div className="gallery-grid">
                  {filteredResults.map((image, index) => (
                    <div key={index} className='gallery-item'>
                      <Link to={`/gallery-photo/${index}`} className="result-link">
                        <h3>{image.title}</h3>
                        {image.url && (
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
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>
          }
        />
        <Route path="/list-photo/:id" element={<PhotoDetail results={results} />} />
        <Route path="/gallery-photo/:id" element={<PhotoDetail results={galleryImages} />} />
      </Routes>
    </Router>
  );
}

export default App;
