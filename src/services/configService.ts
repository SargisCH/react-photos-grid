export const getEnv = () => {
  return {
    pexelsApiKey: import.meta.env.VITE_PEXELS_API_KEY,
    pexelsBaseUrl: import.meta.env.VITE_PEXELS_BASE_URL,
  };
};
