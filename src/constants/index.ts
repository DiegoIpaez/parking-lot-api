const CORS = {
  origin: true,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  credentials: true,
};

export const CONFIG = {
  CORS,
  PORT: process.env.PORT || 3000,
  JWT_SECRET: process.env.JWT_SECRET || 'your-secret-key',
};
