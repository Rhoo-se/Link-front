// src/PrivateRoute.jsx
import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

const PrivateRoute = () => {
  const token = localStorage.getItem('adminToken');
  const location = useLocation();

  if (!token) {
    // 로그인 페이지로 보낼 때, 로그인 후 돌아올 현재 경로를 state로 함께 전달
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;