// app/components/sections/MapSearch.jsx
'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { FaMapMarkerAlt } from 'react-icons/fa';

// Function to load Google Maps script dynamically
const loadGoogleMapsScript = (apiKey) => {
  return new Promise((resolve, reject) => {
    // Check if google.maps is already available AND if Map constructor exists
    if (window.google && window.google.maps && window.google.maps.Map) {
      resolve(window.google);
      return;
    }

    // Check if the script is already being loaded
    if (document.getElementById('google-maps-script')) {
        const checkMaps = setInterval(() => {
            if (window.google && window.google.maps && window.google.maps.Map) { // Check for Map constructor
                clearInterval(checkMaps);
                resolve(window.google);
            }
        }, 100);
        return;
    }

    const script = document.createElement('script');
    script.id = 'google-maps-script'; // Add an ID to prevent duplicate loading
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&loading=async`;
    script.async = true;
    script.defer = true;

    script.onload = () => {
      // Poll until google.maps and the Map constructor are truly ready
      const checkMapsInterval = setInterval(() => {
        if (window.google && window.google.maps && window.google.maps.Map) { // Check for Map constructor
          clearInterval(checkMapsInterval);
          resolve(window.google);
        }
      }, 100); 
    };

    script.onerror = (error) => {
      console.error("Script loading error:", error);
      reject(new Error("Failed to load Google Maps script."));
    };

    document.head.appendChild(script);
  });
};

function MapSearch() {
  const mapRef = useRef(null);
  const googleMap = useRef(null); 
  const markersRef = useRef([]); 

  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [locationInput, setLocationInput] = useState('');
  const [propertyTypeFilter, setPropertyTypeFilter] = useState('Any');
  const [bedroomsFilter, setBedroomsFilter] = useState('Any');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const fetchProperties = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/list');
      if (!res.ok) {
        throw new Error('Failed to fetch properties for map.');
      }
      const data = await res.json();
      setProperties(data);
      setFilteredProperties(data);
    } catch (err) {
      console.error("Error fetching properties for map:", err);
      setError(err.message || 'Failed to load properties for map.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const initMap = async () => {
      const apiKey = process.env.NEXT_PUBLIC_Maps_API_KEY;

      if (!apiKey) {
        setError("Google Maps API Key is not configured. Please set NEXT_PUBLIC_Maps_API_KEY in your .env.local file."); // Corrected error message string
        return;
      }

      try {
        const google = await loadGoogleMapsScript(apiKey);
        
        // Ensure google and google.maps.Map are definitively available before creating map
        if (!google || !google.maps || !google.maps.Map) {
            throw new Error("Google Maps API or Map constructor not fully loaded.");
        }

        // --- IMPORTANT: Only create a new map if it doesn't already exist ---
        if (mapRef.current && !googleMap.current) { 
          googleMap.current = new google.maps.Map(mapRef.current, {
            center: { lat: -1.286389, lng: 36.817223 }, // Center of Nairobi
            zoom: 12,
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: false,
          });

          googleMap.current.addListener('click', (e) => {
            console.log('Map clicked at:', e.latLng.lat(), e.latLng.lng());
          });

          fetchProperties(); // Fetch properties once map is initialized
        }
      } catch (err) {
        console.error("Failed to load Google Maps:", err);
        setError("Failed to load map. Check API key, network connection, or script loading issue: " + err.message);
      }
    };

    initMap();

    // --- IMPORTANT: Cleanup function for when the component unmounts ---
    return () => {
      
      if (googleMap.current && typeof googleMap.current.setDiv === 'function') {

        googleMap.current.setDiv(null); 
        googleMap.current = null; 
      }
      // Clear markers too for a clean slate
      if (markersRef.current.length > 0) {
        markersRef.current.forEach(marker => {
            if (marker && typeof marker.setMap === 'function') {
                marker.setMap(null);
            }
        });
        markersRef.current = [];
      }
    };
  }, [fetchProperties]); // `fetchProperties` is stable due to useCallback

  useEffect(() => {
    // Ensure google.maps and necessary constructors are ready before trying to create markers
    if (!googleMap.current || !window.google || !window.google.maps || !window.google.maps.Marker || !window.google.maps.InfoWindow || !window.google.maps.LatLngBounds) return; 

    markersRef.current.forEach(marker => {
        if (marker && typeof marker.setMap === 'function') {
            marker.setMap(null); 
        }
    });
    markersRef.current = []; 

    filteredProperties.forEach(property => {
      if (property.coordinates && property.coordinates.lat && property.coordinates.lng) {
        const marker = new window.google.maps.Marker({
          position: { lat: property.coordinates.lat, lng: property.coordinates.lng },
          map: googleMap.current,
          title: property.propertyname,
        });

        const infowindow = new window.google.maps.InfoWindow({
          content: `
            <div style="font-family: sans-serif; padding: 5px;">
              <h4 style="margin: 0 0 5px 0; font-size: 1.1em; color: #333;">${property.propertyname}</h4>
              <p style="margin: 0 0 3px 0; font-size: 0.9em; color: #555;">${property.location}</p>
              <p style="margin: 0 0 3px 0; font-size: 1em; font-weight: bold; color: #007bff;">${property.price}</p>
              <p style="margin: 0; font-size: 0.8em; color: #777;">
                ${property.features?.bedrooms || ''} | ${property.features?.bathrooms || ''} | ${property.features?.size || ''}
              </p>
              <a href="//${property._id}" style="display: inline-block; margin-top: 8px; padding: 5px 10px; background-color: #007bff; color: white; text-decoration: none; border-radius: 4px; font-size: 0.85em;">View Details</a>
            </div>
          `
        });

        marker.addListener('click', () => {
          infowindow.open(googleMap.current, marker);
        });

        markersRef.current.push(marker);
      }
    });

    if (markersRef.current.length > 0) {
      const bounds = new window.google.maps.LatLngBounds();
      markersRef.current.forEach(marker => bounds.extend(marker.getPosition()));
      googleMap.current.fitBounds(bounds);
      if (markersRef.current.length === 1) {
        googleMap.current.setZoom(14);
      }
    }

  }, [filteredProperties]);

  const handleSearch = () => {
    let tempFiltered = properties.filter(property => {
      const matchesLocation = locationInput
        ? property.location.toLowerCase().includes(locationInput.toLowerCase())
        : true;

      const matchesPropertyType = propertyTypeFilter === 'Any'
        ? true
        : property.propertytype === propertyTypeFilter;

      const matchesBedrooms = bedroomsFilter === 'Any'
        ? true
        : (bedroomsFilter === '4+'
          ? parseInt(property.features?.bedrooms) >= 4
          : parseInt(property.features?.bedrooms) === parseInt(bedroomsFilter));

      const propertyPriceNum = parseFloat(property.price.replace(/[^0-9.-]+/g,""));
      const matchesMinPrice = minPrice ? propertyPriceNum >= parseFloat(minPrice) : true;
      const matchesMaxPrice = maxPrice ? propertyPriceNum <= parseFloat(maxPrice) : true;

      return matchesLocation && matchesPropertyType && matchesBedrooms && matchesMinPrice && matchesMaxPrice;
    });

    setFilteredProperties(tempFiltered);

    if (tempFiltered.length > 0 && googleMap.current) {
      const firstProperty = tempFiltered[0];
      if (firstProperty.coordinates) {
        googleMap.current.panTo({ lat: firstProperty.coordinates.lat, lng: firstProperty.coordinates.lng });
        googleMap.current.setZoom(13);
      }
    }
  };

  return (
    <section id="search" className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-5">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Find Your Ideal Home
            </h2>
            <p className="mt-3 text-lg text-gray-500">
              Use our interactive map to explore rental properties across Nairobi's neighborhoods.
            </p>

            <div className="mt-6 bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Search Filters</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700" htmlFor="locationInput">Location</label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <input
                      id="locationInput"
                      type="text"
                      className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-3 pr-10 py-2 sm:text-sm border-gray-300 rounded-md"
                      placeholder="Enter Nairobi area"
                      value={locationInput}
                      onChange={(e) => setLocationInput(e.target.value)}
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <FaMapMarkerAlt className="text-gray-400" />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700" htmlFor="propertyType">Property Type</label>
                    <select
                      id="propertyType"
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                      value={propertyTypeFilter}
                      onChange={(e) => setPropertyTypeFilter(e.target.value)}
                    >
                      <option>Any</option>
                      <option>Apartment</option>
                      <option>House</option>
                      <option>Studio</option>
                      <option>Penthouse</option>
                      <option>Commercial</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700" htmlFor="bedrooms">Bedrooms</label>
                    <select
                      id="bedrooms"
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                      value={bedroomsFilter}
                      onChange={(e) => setBedroomsFilter(e.target.value)}
                    >
                      <option>Any</option>
                      <option>1</option>
                      <option>2</option>
                      <option>3</option>
                      <option>4+</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Price Range (KSh)</label>
                  <div className="mt-2 flex items-center space-x-4">
                    <input
                      type="number"
                      placeholder="Min"
                      className="block w-full shadow-sm sm:text-sm focus:ring-blue-500 focus:border-blue-500 border-gray-300 rounded-md"
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                    />
                    <span className="text-gray-500">to</span>
                    <input
                      type="number"
                      placeholder="Max"
                      className="block w-full shadow-sm sm:text-sm focus:ring-blue-500 focus:border-blue-500 border-gray-300 rounded-md"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                    />
                  </div>
                </div>

                <button
                  onClick={handleSearch}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition duration-300"
                  disabled={loading}
                >
                  {loading ? 'Searching...' : 'Search Properties'}
                </button>
                {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
              </div>
            </div>
          </div>

          <div className="mt-8 lg:mt-0 lg:col-span-7">
            <div className="bg-white p-4 rounded-lg shadow">
              <div ref={mapRef} id="map" className="map-container rounded-lg h-[500px] w-full">
                {loading && <div className="flex items-center justify-center h-full text-gray-500">Loading map...</div>}
                {error && <div className="flex items-center justify-center h-full text-red-500">Error loading map: {error}</div>}
              </div>
            </div>
            <div className="mt-4 text-sm text-gray-500">
              <p>Browse properties by clicking on markers or use the search filters to refine your results.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default MapSearch;