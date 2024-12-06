import React, { useState } from 'react';
import LocationResults from './LocationResults';
import './LocationSearch.css';

/**
 * LocationSearch is a React component that allows users to fetch their current location
 * using the Geolocation API and display nearby business results.
 *
 * @component
 * @returns {JSX.Element} The rendered LocationSearch component.
 */
function LocationSearch() {
  const [location, setLocation] = useState({ latitude: null, longitude: null });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  /**
   * Handles the process of fetching the user's current location using the browser's Geolocation API.
   * Updates the `location` state with the latitude and longitude or sets an error if the process fails.
   */
  const handleGetLocation = () => {
    setLoading(true);
    setError(null);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          setLoading(false);
        },
        (err) => {
          setError(err.message);
          setLoading(false);
        }
      );
    } else {
      setError("Geolocation is not supported by this browser.");
      setLoading(false);
    }
  };

  return (
    <div className="location-search">
      <h1>📍 Local Business Finder</h1>
      <h3>First, we'll need to access your location:</h3>
      <button className="get-location-btn" onClick={handleGetLocation} disabled={loading}>
        {loading ? "Fetching..." : "Get My Location"}
      </button>
      {error && <p className="error-message">Error: {error}</p>}

      {location.latitude && location.longitude ? (
        <div className="results-container">
          {/* <p>Latitude: {location.latitude}</p> */}
          {/* <p>Longitude: {location.longitude}</p> */}
          <div className="location-results">
            <LocationResults lat={location.latitude} lon={location.longitude} radius={1000} />
          </div>
        </div>
      ) : (
        !loading && <p>Location not fetched yet.</p>
      )}
    </div>
  );
}

export default LocationSearch;
