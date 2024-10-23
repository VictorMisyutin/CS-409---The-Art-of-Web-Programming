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
  const [showSolarEclipses, setShowSolarEclipses] = useState<boolean>(false);
  const [showLunarEclipses, setShowLunarEclipses] = useState<boolean>(false);
  const [showMeteorShowers, setShowMeteorShowers] = useState<boolean>(false);
  const [showPlanets, setShowPlanets] = useState<{ [key: string]: boolean }>({
    Mars: false,
    Jupiter: false,
    Pluto: false,
    Earth: false,
  });
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecentPhotos = async () => {
      setIsLoading(true);
      const today = new Date();
      const endDate = today.toISOString().split('T')[0];
      const startDate = new Date();
      startDate.setDate(today.getDate() - 200);
      const formattedStartDate = startDate.toISOString().split('T')[0];
      setStartDate(formattedStartDate);
      setEndDate(endDate);
      await handleSearch();
    };
    fetchRecentPhotos();
  }, []);

  const isSolarEclipse = (result: NasaResponse) => {
    return result.title.toLowerCase().includes("solar eclipse") || 
           result.explanation.toLowerCase().includes("solar eclipse");
  };

  const isLunarEclipse = (result: NasaResponse) => {
    return result.title.toLowerCase().includes("lunar eclipse") || 
           result.explanation.toLowerCase().includes("lunar eclipse");
  };

  const isMeteorShower = (result: NasaResponse) => {
    return result.title.toLowerCase().includes("meteor shower") || 
           result.explanation.toLowerCase().includes("meteor shower");
  };

  const isPlanet = (result: NasaResponse, planet: string) => {
    return result.title.toLowerCase().includes(planet.toLowerCase()) || 
           result.explanation.toLowerCase().includes(planet.toLowerCase());
  };

  const filterResults = (sortedResults: NasaResponse[]) => {
    return sortedResults.filter(result => {
      const isEclipse = 
        (showSolarEclipses && isSolarEclipse(result)) || 
        (showLunarEclipses && isLunarEclipse(result)) || 
        (showMeteorShowers && isMeteorShower(result));
        
      const isPlanetSelected = Object.keys(showPlanets).some(planet => 
        showPlanets[planet] && isPlanet(result, planet)
      );

      return isEclipse || isPlanetSelected;
    });
  };

  const handleSearch = async () => {
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

      const filteredResults = filterResults(sortedResults); // Apply filters after sorting
      const maxResults = maxCount !== 'none' ? parseInt(maxCount, 10) : filteredResults.length;
      setResults(filteredResults.slice(0, maxResults));

    } catch (error) {
      console.error('Error fetching data from NASA API', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSolarEclipseFilter = () => {
    setShowSolarEclipses(prev => {
      const newValue = !prev;
      setActiveFilter(newValue ? 'solarEclipse' : null);
      return newValue;
    });
  };

  const handleLunarEclipseFilter = () => {
    setShowLunarEclipses(prev => {
      const newValue = !prev;
      setActiveFilter(newValue ? 'lunarEclipse' : null);
      return newValue;
    });
  };

  const handleMeteorShowerFilter = () => {
    setShowMeteorShowers(prev => {
      const newValue = !prev;
      setActiveFilter(newValue ? 'meteorShower' : null);
      return newValue;
    });
  };

  const handlePlanetFilter = (planet: string) => {
    setShowPlanets(prev => {
      const newValue = !prev[planet];
      setActiveFilter(newValue ? planet : null);
      return { ...prev, [planet]: newValue };
    });
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

  // Call handleSearch whenever filter states change
  useEffect(() => {
    handleSearch();
  }, [showSolarEclipses, showLunarEclipses, showMeteorShowers, showPlanets, startDate, endDate, maxCount]);

  return (
    <Router>
      <header className="App-header">
        <p><Link to='/' className="logo">Vic Vic Space Adventures</Link></p>
        <div className="nav-links">
          <p><Link to="/list">List</Link></p>
          <p>
            <Link to="/gallery">Gallery</Link>
          </p>
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
                  <form onSubmit={(e) => { e.preventDefault(); handleSearch(); }}>
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
                <div className={`filter ${activeFilter === 'solarEclipse' ? 'active' : ''}`} onClick={handleSolarEclipseFilter}>
                  Solar Eclipse Only
                </div>
                <div className={`filter ${activeFilter === 'lunarEclipse' ? 'active' : ''}`} onClick={handleLunarEclipseFilter}>
                  Lunar Eclipse Only
                </div>
                <div className={`filter ${activeFilter === 'meteorShower' ? 'active' : ''}`} onClick={handleMeteorShowerFilter}>
                  Meteor Shower Only
                </div>
                <div className={`filter ${activeFilter === 'Mars' ? 'active' : ''}`} onClick={() => handlePlanetFilter('Mars')}>
                  Mars Only
                </div>
                <div className={`filter ${activeFilter === 'Jupiter' ? 'active' : ''}`} onClick={() => handlePlanetFilter('Jupiter')}>
                  Jupiter Only
                </div>
                <div className={`filter ${activeFilter === 'Pluto' ? 'active' : ''}`} onClick={() => handlePlanetFilter('Pluto')}>
                  Pluto Only
                </div>
                <div className={`filter ${activeFilter === 'Earth' ? 'active' : ''}`} onClick={() => handlePlanetFilter('Earth')}>
                  Earth Only
                </div>
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
          }
        />
        <Route path="/photo/:id" element={<PhotoDetail results={results} />} />
      </Routes>
    </Router>
  );
}

export default App;
