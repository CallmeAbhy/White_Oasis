// locationUtils.js
import axios from "axios";
import { Country, State, City } from "country-state-city";

export const getAddressSuggestions = async (value) => {
  try {
    const response = await axios.get(
      `https://nominatim.openstreetmap.org/search`,
      {
        params: {
          q: value,
          format: "json",
          limit: 5,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching address suggestions:", error);
    return [];
  }
};

export const getLocationSuggestions = (type, value, codes) => {
  switch (type) {
    case "country":
      return Country.getAllCountries().filter((country) =>
        country.name.toLowerCase().includes(value.toLowerCase())
      );
    case "state":
      return State.getStatesOfCountry(codes.countryCode).filter((state) =>
        state.name.toLowerCase().includes(value.toLowerCase())
      );
    case "city":
      return City.getCitiesOfState(codes.countryCode, codes.stateCode).filter(
        (city) => city.name.toLowerCase().includes(value.toLowerCase())
      );
    default:
      return [];
  }
};
