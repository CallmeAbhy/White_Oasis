// src/utils/navigationUtils.js

export const navigateWithState = (navigate, route, state = {}) => {
  navigate(route, { state });
};

// For specific navigation scenarios
export const navigateToHome = (navigate, userId) => {
  navigate(`/home/${userId}`);
};

export const navigateToLogin = (navigate) => {
  navigate("/login");
};

export const navigateToDashboard = (navigate, profile) => {
  navigateWithState(navigate, "/dashboard", { profile });
};

export const navigateToUserDetail = (navigate, user, profile) => {
  navigateWithState(navigate, "/user-detail", { user, profile });
};
