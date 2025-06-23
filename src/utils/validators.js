export const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const isValidShortcode = (code) => /^[a-zA-Z0-9]{3,10}$/.test(code);

export const isValidValidity = (min) =>
  min === '' || (!isNaN(min) && parseInt(min) > 0);