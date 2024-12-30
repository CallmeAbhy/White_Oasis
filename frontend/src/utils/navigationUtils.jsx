// src/utils/navigationUtils.js

export const navigateWithState = (navigate, route, state = {}) => {
  navigate(route, { state });
};

// For specific navigation scenarios
// export const navigateToHome = (navigate, userId) => {
//   navigate(`/home/${userId}`);
// };

export const navigateToLogin = (navigate) => {
  navigate("/login");
};

export const navigateToDashboard = (navigate) => {
  navigateWithState(navigate, "/dashboard");
};

export const navigateToUserDetail = (navigate, user) => {
  console.log("Navigating to user detail with user:", user);
  navigateWithState(navigate, "/user-detail", { user });
};
export const navigatetoAppointment = (navigate, id) => {
  navigateWithState(navigate, `/book-appointment/${id}`);
};

export const navigateToUserDashboard = (navigate) => {
  navigateWithState(navigate, "/UserDashboard");
};
