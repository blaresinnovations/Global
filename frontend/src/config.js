// Central frontend config — single source for backend origin
export const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://www.globalgate.lk' || 'http://localhost:4000' ;

export default {
  BACKEND_URL,
};
