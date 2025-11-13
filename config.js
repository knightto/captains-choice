// API Configuration
// In production, API calls go to same domain
// In development, they go to localhost:3000
export const API_BASE = import.meta.env.PROD 
  ? '/api'  // Production: relative path (same domain)
  : 'http://localhost:3000/api';  // Development: explicit localhost
