// /frontend/src/pages/Trust/constants/formInitialState.js

export const initialFormState = {
  old_age_home_name: "",
  old_age_home_upi_id: "",
  old_age_home_country: "",
  old_age_home_state: "",
  old_age_home_city: "",
  old_age_home_address: "",
  opens_on: "",
  closes_on: "",
  working_days: [],
  contact_numbers: [""],
  email: "",
  social_links: {
    facebook: "",
    instagram: "",
    twitter: "",
    website: "",
    whatsapp_group: "",
    youtube: "",
  },
  capacity: 0,
  occupied_seats: 0,
  facilities: [],
  services: [],
  staff_info: {
    medical_staff: 0,
    care_workers: 0,
  },
  diet_type: "",
  fee_structure: {
    monthly: 0,
    yearly: 0,
  },
  yearOfEstablishment: 0,
  appointment_settings: {
    duration: 30,
    max_appointments_per_day: 5,
  },
};
