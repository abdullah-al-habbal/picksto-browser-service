// picksto-browser-service/src/utils/validateUrl.util.js
const validateUrl = (url) => {
  if (!url || typeof url !== "string") {
    return { valid: false, message: "URL is required" };
  }
  try {
    const parsed = new URL(url);
    if (!["http:", "https:"].includes(parsed.protocol)) {
      return { valid: false, message: "URL must use http or https protocol" };
    }
    return { valid: true };
  } catch {
    return { valid: false, message: "Invalid URL format" };
  }
};

module.exports = validateUrl;
