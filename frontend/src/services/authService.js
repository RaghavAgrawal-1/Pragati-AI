import { api, tokenStore, ApiError } from "./apiClient";

export const authService = {
  async login({ email, password, remember = true }) {
    // Temporary hackathon authentication.
    // Real JWT authentication can be connected later.
    if (!email || !password) {
      throw new ApiError("Email and password are required.", 400);
    }

    const demoToken = `pragati-demo-${Date.now()}`;

    tokenStore.set(demoToken);
    localStorage.setItem("pragati.user.email", email);

    if (!remember) {
      sessionStorage.setItem("pragati.session-only", "1");
    }

    return {
      token: demoToken,
      user: {
        email,
        name: email.split("@")[0],
        role: "Project Monitoring Officer",
      },
    };
  },

  async me() {
    if (!tokenStore.get()) return null;

    return {
      email: localStorage.getItem("pragati.user.email") || "officer@pragati.ai",
      name: "Project Monitoring Officer",
      role: "Project Monitoring Officer",
    };
  },

  requestPasswordReset: async () => {
    return { message: "Password reset is not enabled in demo mode." };
  },

  resetPassword: async () => {
    return { message: "Password reset is not enabled in demo mode." };
  },

  logout: () => tokenStore.clear(),
};