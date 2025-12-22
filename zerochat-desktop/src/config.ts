/// <reference types="vite/client" />

/**
 * Global Configuration source
 * Reads from Vite environment variables
 */
export const SERVER_CONFIG = {
    // If .env is missing or variable is empty, fallback to the hardcoded string
    BASE_URL: import.meta.env.VITE_SERVER_URL || "https://joya-pentadactyl-lin.ngrok-free.dev",
};