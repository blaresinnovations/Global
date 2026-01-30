import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

export default function RequireAuth({ children, role }) {
  const raw = typeof window !== 'undefined' ? sessionStorage.getItem('AUTH_USER') : null;
  const loc = useLocation();
  if (!raw) return <Navigate to="/login" replace state={{ from: loc }} />;
  try {
    const parsed = JSON.parse(raw);
    if (role && parsed.role !== role) return <Navigate to="/login" replace state={{ from: loc }} />;
    return children;
  } catch (e) {
    return <Navigate to="/login" replace state={{ from: loc }} />;
  }
}
