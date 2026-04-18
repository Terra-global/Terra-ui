/**
 * config.ts
 * =========
 * Centralized configuration for the Agro-Tech platform.
 */

export const CONFIG = {
  // AI Configuration
  GEMINI_API_KEY: import.meta.env.VITE_GEMINI_API_KEY || "",

  // Default Thermal Thresholds
  DEFAULT_THRESHOLDS: {
    maxTemp: 38,
    minTemp: 10,
    maxHumidity: 85,
    minHumidity: 20,
  },

  // Social Media Config
  PLATFORM_NAME: "Terra Oracle AI",
};
