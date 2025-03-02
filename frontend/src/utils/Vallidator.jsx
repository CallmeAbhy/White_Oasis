// /frontend/src/utils/Validator.jsx
export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
};

export const validatePhone = (phone) => {
  const re = /^\d{10}$/;
  return re.test(String(phone));
};

export const validateDOB = (dob) => {
  const today = new Date();
  const birthDate = new Date(dob);
  const age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    return age < 18 ? false : true;
  }
  return age >= 18;
};

export const validateRequired = (value) => {
  return (
    value !== null && value !== undefined && value.toString().trim() !== ""
  );
};

export const validateMinLength = (value, minLength) => {
  return value && value.length >= minLength;
};

export const validateMaxLength = (value, maxLength) => {
  return value && value.length <= maxLength;
};

export const validateForm = (formData, validationRules) => {
  const errors = {};

  for (const field in validationRules) {
    const rules = validationRules[field];
    const value = formData[field];

    if (rules.required && !validateRequired(value)) {
      errors[field] = `${field
        .replace(/([A-Z])/g, " $1")
        .replace(/^./, (str) => str.toUpperCase())} is required`;
      continue;
    }

    if (rules.email && value && !validateEmail(value)) {
      errors[field] = "Please enter a valid email address";
      continue;
    }

    if (rules.phone && value && !validatePhone(value)) {
      errors[field] = "Please enter a valid 10-digit phone number";
      continue;
    }
    if (rules.dob && value && !validateDOB(value)) {
      errors[field] =
        "You must be at least 18 years old and the date cannot be in the future";
      continue;
    }

    if (
      rules.minLength &&
      value &&
      !validateMinLength(value, rules.minLength)
    ) {
      errors[field] = `${field} Must be at least ${rules.minLength} characters`;
      continue;
    }

    if (
      rules.maxLength &&
      value &&
      !validateMaxLength(value, rules.maxLength)
    ) {
      errors[field] = `Cannot exceed ${rules.maxLength} characters`;
      continue;
    }

    if (rules.custom && !rules.custom.validator(value)) {
      errors[field] = rules.custom.message;
      continue;
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
