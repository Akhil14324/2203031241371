const logs = [];

export const logEvent = (type, message, data = {}) => {
  const timestamp = new Date().toISOString();
  logs.push({ timestamp, type, message, ...data });
};

export const getLogs = () => logs;