import React, { useState, useEffect } from 'react';

const LocationItem = ({ name, address, distance, phone, website, opening_hours, brand }) => {
  return (
    <div className="location-item">
      <h3>{name}</h3>
      <p>{address}</p>
      <p>Phone: {phone}</p>
      <p>Website: {website}</p>
      <p>Hours: {opening_hours}</p>
      <p>Brand: {brand}</p>
      <p><strong>Distance:</strong> {distance} km</p>
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

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="location-search">
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

