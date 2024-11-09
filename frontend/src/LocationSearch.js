import React, { useState } from 'react';
import LocationResults from './LocationResults'

function LocationSearch() {
  const [location, setLocation] = useState({ latitude: null, longitude: null });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

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
    <div>
      <h1>Your Location</h1>
      <button onClick={handleGetLocation} disabled={loading}>
        {loading ? "Fetching..." : "Get My Location"}
      </button>

      {error && <p style={{ color: 'red' }}>Error: {error}</p>}

      {location.latitude && location.longitude ? (
        <div>
          <p>Latitude: {location.latitude}</p>
          <p>Longitude: {location.longitude}</p>
          <LocationResults lat={location.latitude} lon={location.longitude} radius={1000} />
        </div>
      ) : (
        !loading && <p>Location not fetched yet.</p>
      )}
    </div>
  );
}

export default LocationSearch;

