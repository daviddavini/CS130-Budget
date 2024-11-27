import React, { useState, useEffect } from 'react';
import './LocationResults.css';

const LocationItem = ({ name, address, distance, phone, website, opening_hours, brand }) => {
  return (
    <div className="location-item">
      <h3>{name}</h3>
      <p className="address">{address}</p>
      <div className="tags">
        <div className="information">Phone: {phone || 'N/A'}</div>
        <div className="information">Website: <a href={website} target="_blank" rel="noopener noreferrer">{website || 'N/A'}</a></div>
        <div className="information">Hours: {opening_hours || 'N/A'}</div>
        <div className="tags-container"><span className="tag">Brand: {brand || 'N/A'}</span></div>
      </div>
      <p className="distance"><strong>Distance:</strong> {distance} km</p>
    </div>
  );
};

const LocationResults = ({ lat, lon, radius }) => {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `/api/sample?lat=${lat}&lon=${lon}&radius=${radius}`
        );
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        setPlaces(data.results);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [lat, lon, radius]);

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="location-results">
      <h2>Search Results</h2>
      {places.length === 0 ? (
        <p>No results found</p>
      ) : (
        <div className="location-list">
          {places
            .sort((a, b) => a.distance_km - b.distance_km)
            .map((place, index) => (
            <LocationItem
              key={index}
              name={place.name}
              address={`${place["addr:housenumber"]} ${place["addr:street"]}, ${place["addr:city"]}, ${place["addr:state"]} ${place["addr:postcode"]}`}
              phone={place.phone}
              website={place.website}
              opening_hours={place.opening_hours}
              brand={`${place.brand} ${place['brand:wikidata']}`}
              distance={place.distance_km.toFixed(3)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default LocationResults;
