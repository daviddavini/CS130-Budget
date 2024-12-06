import React, { useState, useEffect, useContext } from 'react';
import { Typography, Spin, Alert } from 'antd';
import { ThemeContext } from './App';
import './LocationResults.css';

const { Text } = Typography;

/**
 * Component representing an individual location item in the search results.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {string} props.name - The name of the location.
 * @param {string} props.address - The address of the location.
 * @param {number} props.distance - The distance to the location in kilometers.
 * @param {string} [props.phone] - The phone number of the location (optional).
 * @param {string} [props.website] - The website URL of the location (optional).
 * @param {string} [props.opening_hours] - The opening hours of the location (optional).
 * @param {string} [props.brand] - The brand associated with the location (optional).
 * @param {Object} [props.businessInfo] - Additional information about the business (optional).
 * @param {Array} [props.businessInfo.instance_of] - Array of identifiers for the business.
 * @param {number} [props.businessInfo.number_of_branches] - The number of branches of the business.
 * @returns {JSX.Element} The rendered LocationItem component.
 */
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
        <div className="warning"><Alert message="Warning:" description="This is a chain business!" type='warning' showIcon></Alert></div>
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

/**
 * Component for displaying search results of locations based on given latitude, longitude, and radius.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {number} props.lat - Latitude of the search location.
 * @param {number} props.lon - Longitude of the search location.
 * @param {number} props.radius - Radius for the search in kilometers.
 * @returns {JSX.Element} The rendered LocationResults component.
 */
const LocationResults = ({ lat, lon, radius }) => {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { theme } = useContext(ThemeContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `/api/sample?lat=${lat}&lon=${lon}&radius=${radius}`
        );
        if (!response.ok) {
          throw new Error('Unable to fetch location data.');
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

  // Loading and Error Messages
  if (loading) return <div className="loading">
    <Text
      style={{
        fontSize: '20px',
        color: theme === 'dark' ? 'white' : 'black',
        marginBottom: '10px'
      }}
    >
    Loading...
    </Text>
    <Spin />
  </div>;

  if (error) return <div>
    <Alert 
      message="Error:" 
      description={error} 
      type="error" 
      showIcon
    />
  </div>;

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
