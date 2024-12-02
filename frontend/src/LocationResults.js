import React, { useState, useEffect } from 'react';
import './LocationResults.css';

const LocationItem = ({ name, address, distance, phone, website, opening_hours, brand, businessInfo }) => {
  if (businessInfo) {
    var labels = businessInfo['instance_of'].map(item => item.label);
    var commaSeparatedLabels = labels.join(', ');
  }
  return (
    <div className={`location-item ${businessInfo ? 'chain-business' : ''}`}>
      <h3>{name}</h3>
      <p className="address">{address}</p>
      <div className="tags">
        <div className="information">Phone: {phone || 'N/A'}</div>
        <div className="information">Website: <a href={website} target="_blank" rel="noopener noreferrer">{website || 'N/A'}</a></div>
        <div className="information">Hours: {opening_hours || 'N/A'}</div>
      </div>
      <p className="distance"><strong>Distance:</strong> {distance} km</p>
      {businessInfo && (
        <div className="warning"><strong>WARNING:</strong> This is a chain business!</div>
      )}
      {businessInfo && businessInfo["number_of_branches"] && (
        <div className="warning-detail"><strong># Branches:</strong> {businessInfo["number_of_branches"]} </div>
      )}
      {businessInfo && businessInfo["instance_of"] && (
        <div className="warning-detail"><strong>Identifiers:</strong> {commaSeparatedLabels} </div>
      )}
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
	  console.log(data.results);
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
	       place.name &&
		<LocationItem
		    key={index}
		    name={place.name}
		    phone={place.phone}
		    website={place.website}
		    opening_hours={place.opening_hours}
		    distance={place.distance_km.toFixed(3)}
        businessInfo={place.business_info}
		/>
          ))}
        </div>
      )}
    </div>
  );
};

export default LocationResults;
