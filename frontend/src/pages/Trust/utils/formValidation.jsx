// /frontend/src/pages/Trust/utils/formValidation.js

export const validateStep = (currentStep, formData) => {
  switch (currentStep) {
    case 1:
      // Basic Info Validation
      return formData.old_age_home_name && formData.old_age_home_upi_id;

    case 2:
      // Location Validation
      return (
        formData.old_age_home_country &&
        formData.old_age_home_state &&
        formData.old_age_home_city &&
        formData.old_age_home_address
      );

    case 3:
      // Timings Validation
      return (
        formData.opens_on &&
        formData.closes_on &&
        formData.working_days.length > 0
      );

    case 4:
      // Contact Info Validation
      return formData.contact_numbers[0] && formData.email;

    case 5:
      // Capacity and Staff Info Validation
      return (
        formData.capacity &&
        formData.staff_info.medical_staff &&
        formData.staff_info.care_workers &&
        formData.diet_type &&
        formData.fee_structure.monthly &&
        formData.fee_structure.yearly
      );

    case 6:
      // Facilities and Services Validation
      return formData.facilities.length > 0 && formData.services.length > 0;

    default:
      return true;
  }
};

// Optional: Add helper validation functions
export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
};

export const validatePhoneNumber = (phone) => {
  const re = /^\d{10}$/;
  return re.test(String(phone));
};

export const validateFeeStructure = (fee) => {
  return !isNaN(fee) && Number(fee) > 0;
};

export const validateCapacity = (capacity) => {
  return !isNaN(capacity) && Number(capacity) > 0;
};

export const validateStaffCount = (count) => {
  return !isNaN(count) && Number(count) >= 0;
};
