// hooks/useOldAgeHomeForm.js
import { useState } from "react";

export const useOldAgeHomeForm = (initialState) => {
  const [formData, setFormData] = useState(initialState);
  const [error, setError] = useState("");
  const [locationCodes, setLocationCodes] = useState({
    countryCode: "",
    stateCode: "",
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFacilitiesChange = (e) => {
    const value = e.target.value;
    const facilitiesArray = value.split("\n• ").filter((item) => item.trim());
    setFormData({ ...formData, facilities: facilitiesArray });
  };

  const handleServicesChange = (e) => {
    const value = e.target.value;
    const servicesArray = value.split("\n• ").filter((item) => item.trim());
    setFormData({ ...formData, services: servicesArray });
  };

  const handleSocialLinksChange = (index, field, value) => {
    const newSocialLinks = { ...formData.social_links };
    const platform = Object.keys(newSocialLinks)[index];
    if (field === "platform") {
      const newPlatform = value;
      newSocialLinks[newPlatform] = newSocialLinks[platform];
      delete newSocialLinks[platform];
    } else {
      newSocialLinks[platform] = value;
    }
    setFormData({ ...formData, social_links: newSocialLinks });
  };
  // const addSocialLinkField = () => {
  //   setFormData({
  //     ...formData,
  //     social_links: { ...formData.social_links, new_platform: "" },
  //   });
  // };

  const addSocialLinkField = (platform) => {
    if (!formData.social_links[platform]) {
      setFormData((prev) => ({
        ...prev,
        social_links: {
          ...prev.social_links,
          [platform]: "",
        },
      }));
    }
  };

  const removeSocialLinkField = (platform) => {
    const newSocialLinks = { ...formData.social_links };
    delete newSocialLinks[platform];
    setFormData({ ...formData, social_links: newSocialLinks });
  };
  const handlePhoneNumberChange = (index, value) => {
    const updatedNumbers = [...formData.contact_numbers];
    updatedNumbers[index] = value;
    setFormData((prev) => ({
      ...prev,
      contact_numbers: updatedNumbers,
    }));
  };

  const addPhoneNumberField = () => {
    setFormData((prev) => ({
      ...prev,
      contact_numbers: [...prev.contact_numbers, ""],
    }));
  };
  const removePhoneNumberField = (index) => {
    setFormData((prev) => ({
      ...prev,
      contact_numbers: prev.contact_numbers.filter((_, i) => i !== index),
    }));
  };
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
    }
  };
  const handleLocationChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Update location codes if provided
    if (e.countryCode || e.stateCode) {
      setLocationCodes((prev) => ({
        ...prev,
        ...(e.countryCode && { countryCode: e.countryCode }),
        ...(e.stateCode && { stateCode: e.stateCode }),
      }));
    }
  };
  const handleWorkingDaysChange = (day) => {
    setFormData((prev) => ({
      ...prev,
      working_days: prev.working_days.includes(day)
        ? prev.working_days.filter((d) => d !== day)
        : [...prev.working_days, day],
    }));
  };

  const handleFacilityChange = (index, value) => {
    const newFacilities = [...formData.facilities];
    newFacilities[index] = value;
    setFormData({ ...formData, facilities: newFacilities });
  };

  const addFacilityField = () => {
    setFormData({
      ...formData,
      facilities: [...formData.facilities, ""],
    });
  };

  const removeFacilityField = (index) => {
    const newFacilities = formData.facilities.filter((_, i) => i !== index);
    setFormData({ ...formData, facilities: newFacilities });
  };

  const handleServiceChange = (index, value) => {
    const newServices = [...formData.services];
    newServices[index] = value;
    setFormData({ ...formData, services: newServices });
  };

  const addServiceField = () => {
    setFormData({
      ...formData,
      services: [...formData.services, ""],
    });
  };

  const removeServiceField = (index) => {
    const newServices = formData.services.filter((_, i) => i !== index);
    setFormData({ ...formData, services: newServices });
  };

  return {
    formData,
    setFormData,
    error,
    setError,
    handleInputChange,
    handleSocialLinksChange,
    handleFacilitiesChange,
    addSocialLinkField,
    removeSocialLinkField,
    handleServicesChange,
    handlePhoneNumberChange,
    addPhoneNumberField,
    removePhoneNumberField,
    handleKeyPress,
    locationCodes,
    handleLocationChange,
    handleWorkingDaysChange,
    handleFacilityChange,
    addFacilityField,
    removeFacilityField,
    handleServiceChange,
    addServiceField,
    removeServiceField,
  };
};
