import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import {
  getLocationSuggestions,
  getAddressSuggestions,
} from "../../utils/locationUtils";

const LocationInput = ({
  type,
  name,
  value,
  onChange,
  codes,
  placeholder,
  required,
}) => {
  const [inputValue, setInputValue] = useState(value); // Local state for input value
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);

  const debounce = (fn, delay) => {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn(...args), delay);
    };
  };

  useEffect(() => {
    setInputValue(value); // Sync inputValue with external value
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (inputRef.current && !inputRef.current.contains(event.target)) {
        setSuggestions([]);
        setSelectedIndex(-1);
        setIsFocused(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchSuggestions = async () => {
    if (!inputValue || inputValue.length < 2) {
      setSuggestions([]);
      return;
    }

    setLoading(true);
    try {
      if (type === "address") {
        const addressSuggestions = await getAddressSuggestions(inputValue);
        setSuggestions(addressSuggestions);
      } else {
        const locationSuggestions = getLocationSuggestions(
          type,
          inputValue,
          codes
        );
        setSuggestions(locationSuggestions);
      }
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  };

  const debouncedFetch = debounce(fetchSuggestions, 300);

  useEffect(() => {
    debouncedFetch();
  }, [inputValue, type, codes]);

  const handleSelect = (suggestion) => {
    let selectedValue = "";
    let additionalData = {};

    switch (type) {
      case "country":
        selectedValue = suggestion.name;
        additionalData = { countryCode: suggestion.isoCode };
        break;
      case "state":
        selectedValue = suggestion.name;
        additionalData = { stateCode: suggestion.isoCode };
        break;
      case "city":
        selectedValue = suggestion.name;
        break;
      case "address":
        selectedValue = suggestion.display_name;
        break;
      default:
        selectedValue = suggestion;
    }

    // Reflect selection in the input box and notify parent
    setInputValue(selectedValue);
    onChange({
      target: { name, value: selectedValue },
      ...additionalData,
    });

    // Clear suggestions
    setSuggestions([]);
    setSelectedIndex(-1);
    setIsFocused(false);
  };

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setInputValue(newValue); // Update local input state
    onChange(e); // Notify parent
    if (!newValue) {
      setSuggestions([]);
      setSelectedIndex(-1);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      if (selectedIndex >= 0) handleSelect(suggestions[selectedIndex]);
    } else if (e.key === "Escape") {
      setSuggestions([]);
      setSelectedIndex(-1);
      setIsFocused(false);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prevIndex) =>
        Math.min(prevIndex + 1, suggestions.length - 1)
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prevIndex) => Math.max(prevIndex - 1, 0));
    }
  };

  const handleFocus = () => setIsFocused(true);

  const handleClearInput = () => {
    setInputValue("");
    onChange({ target: { name, value: "" } });
    setSuggestions([]);
    setSelectedIndex(-1);
    setIsFocused(false);
  };

  return (
    <div className="relative w-full" ref={inputRef}>
      <input
        type="text"
        name={name}
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onFocus={handleFocus}
        placeholder={placeholder}
        required={required}
        className="p-2 mt-1 rounded-xl border border-gray-300 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-autocomplete="list"
        aria-controls="suggestions-list"
        aria-activedescendant={
          selectedIndex >= 0 ? `suggestion-${selectedIndex}` : undefined
        }
      />

      {loading && (
        <div
          className="absolute right-10 top-1/2 transform -translate-y-1/2"
          aria-label="Loading suggestions"
        >
          <div className="loader w-4 h-4 border-2 border-t-transparent border-blue-500 rounded-full animate-spin"></div>
        </div>
      )}

      {isFocused && suggestions.length > 0 && (
        <ul
          id="suggestions-list"
          className="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 max-h-60 overflow-auto shadow-md"
          role="listbox"
        >
          {suggestions.map((suggestion, index) => (
            <li
              key={
                type === "address" ? index : suggestion.isoCode || suggestion.id
              }
              onClick={() => handleSelect(suggestion)}
              className={`p-3 cursor-pointer ${
                selectedIndex === index ? "bg-gray-200" : "hover:bg-gray-100"
              }`}
              id={`suggestion-${index}`}
              role="option"
              aria-selected={selectedIndex === index}
            >
              {type === "address" ? suggestion.display_name : suggestion.name}
            </li>
          ))}
        </ul>
      )}

      <button
        type="button"
        onClick={handleClearInput}
        className="absolute right-2 top-2 flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 focus:outline-none"
        aria-label="Clear input"
        title="Clear"
      >
        ⤫
      </button>
    </div>
  );
};

LocationInput.propTypes = {
  type: PropTypes.oneOf(["country", "state", "city", "address"]).isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  codes: PropTypes.arrayOf(PropTypes.string),
  placeholder: PropTypes.string,
  required: PropTypes.bool,
};

export default LocationInput;
