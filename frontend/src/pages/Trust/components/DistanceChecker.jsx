// DistanceChecker.jsx
import { useState } from "react";
import { getAddressSuggestions } from "../../../utils/locationUtils";
import PropTypes from "prop-types";

const DistanceChecker = ({ homeAddress }) => {
  const [userLocation, setUserLocation] = useState(null);
  const [customLocation, setCustomLocation] = useState("");
  const [distance, setDistance] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [usingCurrentLocation, setUsingCurrentLocation] = useState(false);

  // Debounce function to limit API calls
  const debounce = (fn, delay) => {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn(...args), delay);
    };
  };

  // Function to fetch address suggestions
  const fetchAddressSuggestions = async (value) => {
    if (!value || value.length < 2) {
      setSuggestions([]);
      return;
    }

    try {
      const suggestions = await getAddressSuggestions(value);
      setSuggestions(suggestions);
    } catch (err) {
      console.error("Error fetching suggestions:", err);
      setSuggestions([]);
    }
  };

  const debouncedFetchSuggestions = debounce(fetchAddressSuggestions, 300);

  // Function to handle manual location input
  const handleLocationInput = (e) => {
    const value = e.target.value;
    setCustomLocation(value);
    setIsTyping(true);
    setUsingCurrentLocation(false);
    debouncedFetchSuggestions(value);
  };

  // Function to handle suggestion selection
  const handleSuggestionSelect = (suggestion) => {
    setCustomLocation(suggestion.display_name);
    setSuggestions([]);
    setIsTyping(false);
    calculateDistance(suggestion.display_name);
  };

  // Function to get user's current location
  const getCurrentLocation = () => {
    // First check if location is enabled
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    setIsTyping(false);
    setUsingCurrentLocation(true);
    setCustomLocation("");

    // Check location permissions
    navigator.permissions
      .query({ name: "geolocation" })
      .then((permissionStatus) => {
        if (permissionStatus.state === "denied") {
          alert(
            "Please enable location services to use this feature. After enabling, try again."
          );
          setLoading(false);
          setUsingCurrentLocation(false);
          return;
        }

        navigator.geolocation.getCurrentPosition(
          async (position) => {
            try {
              const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?` +
                  `lat=${position.coords.latitude}&` +
                  `lon=${position.coords.longitude}&` +
                  `format=json`,
                {
                  headers: {
                    "Accept-Language": "en-US,en;q=0.9",
                    "User-Agent": "White Oasis Application",
                  },
                }
              );

              if (!response.ok) {
                throw new Error("Failed to fetch location details");
              }

              const data = await response.json();
              setUserLocation(data);
              calculateDistance(data.display_name);
            } catch (err) {
              console.error("Error:", err);
              setError("Error getting location details. Please try again.");
              setUsingCurrentLocation(false);
            } finally {
              setLoading(false);
            }
          },
          (error) => {
            console.error("Geolocation error:", error);
            switch (error.code) {
              case error.PERMISSION_DENIED:
                alert("Please enable location services to use this feature.");
                break;
              case error.POSITION_UNAVAILABLE:
                setError("Location information is unavailable.");
                break;
              case error.TIMEOUT:
                setError("Location request timed out. Please try again.");
                break;
              default:
                setError("An unknown error occurred. Please try again.");
            }
            setLoading(false);
            setUsingCurrentLocation(false);
          },
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0,
          }
        );
      });
  };

  // Calculate distance using Haversine formula
  const calculateHaversineDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return (R * c).toFixed(2);
  };

  const toRad = (value) => (value * Math.PI) / 180;

  // Function to calculate distance
  const calculateDistance = async (userLocationString) => {
    setLoading(true);
    setError(null);

    try {
      // Get coordinates for user location
      const userLocationResponse = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
          userLocationString
        )}&format=json&limit=1`,
        {
          headers: {
            "User-Agent": "White Oasis Application",
          },
        }
      );
      const userLocationData = await userLocationResponse.json();

      if (userLocationData.length === 0) {
        setError("Location not found");
        return;
      }

      // Get coordinates for old age home
      const homeAddressComplete = `${homeAddress}`;
      const homeLocationResponse = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
          homeAddressComplete
        )}&format=json&limit=1`,
        {
          headers: {
            "User-Agent": "White Oasis Application",
          },
        }
      );
      const homeLocationData = await homeLocationResponse.json();

      if (homeLocationData.length === 0) {
        setError("Old age home location not found");
        return;
      }

      // Calculate distance using Haversine formula
      const distance = calculateHaversineDistance(
        parseFloat(userLocationData[0].lat),
        parseFloat(userLocationData[0].lon),
        parseFloat(homeLocationData[0].lat),
        parseFloat(homeLocationData[0].lon)
      );

      setDistance(distance);
    } catch (err) {
      console.error("Error calculating distance:", err);
      setError("Error calculating distance. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-6 p-4 bg-white rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-4">Check Distance</h3>

      <div className="space-y-4">
        <button
          onClick={getCurrentLocation}
          disabled={loading || isTyping}
          className={`w-full bg-blue-500 text-white px-4 py-2 rounded transition
            ${
              loading || isTyping
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-blue-600"
            }`}
        >
          {loading ? "Getting Location..." : "Use Current Location"}
        </button>

        <div className="relative">
          <input
            type="text"
            value={customLocation}
            onChange={handleLocationInput}
            placeholder="Or enter location manually"
            className="w-full p-2 border rounded"
            disabled={loading || usingCurrentLocation}
          />

          {suggestions.length > 0 && (
            <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 max-h-60 overflow-auto shadow-md">
              {suggestions.map((suggestion, index) => (
                <li
                  key={index}
                  onClick={() => handleSuggestionSelect(suggestion)}
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                >
                  {suggestion.display_name}
                </li>
              ))}
            </ul>
          )}
        </div>

        {loading && (
          <div className="text-center text-gray-600">
            <p>Calculating distance...</p>
          </div>
        )}

        {error && (
          <div className="text-center text-red-500">
            <p>{error}</p>
          </div>
        )}

        {distance && (
          <div className="text-center text-green-600 font-semibold">
            <p>Distance: {distance} kilometers</p>
          </div>
        )}
      </div>
    </div>
  );
};
DistanceChecker.propTypes = {
  homeAddress: PropTypes.string.isRequired,
};

export default DistanceChecker;
