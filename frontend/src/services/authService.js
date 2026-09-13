import { api, tokenStore } from "./apiClient";

export const authService = {
  async login({ email, password, remember = true }) {
    if (!email || !password) {
      throw new Error("Email and password are required.");
    }

    const response = await api.post("/api/auth/login", {
    email,
    password,
  });

    tokenStore.set(response.access_token);

    const user = response.user;

    localStorage.setItem(
      "pragati.user",
      JSON.stringify(user)
    );

    if (!remember) {
      sessionStorage.setItem("pragati.session-only", "1");
    }

    return {
      token: response.access_token,
      user,
    };
  },

  async signup({ name, email, password }) {
    if (!name || !email || !password) {
      throw new Error("Name, email and password are required.");
    }

    return api.post("/api/auth/signup", {
    name,
    email,
    password,
  });
  },

  async me() {
    const token = tokenStore.get();

    if (!token) {
      return null;
    }

    const storedUser = localStorage.getItem("pragati.user");

    if (!storedUser) {
      return null;
    }

    return JSON.parse(storedUser);
  },

  requestPasswordReset: async () => {
    return {
      message: "Password reset is not enabled yet.",
    };
  },

  resetPassword: async () => {
    return {
      message: "Password reset is not enabled yet.",
    };
  },

  logout: () => {
    tokenStore.clear();
    localStorage.removeItem("pragati.user");
    sessionStorage.removeItem("pragati.session-only");
  },
};