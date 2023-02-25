const pino = require('pino');

export const logger = pino({
  level: "error",
});
