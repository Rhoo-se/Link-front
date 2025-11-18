// src/Layout.jsx

import React from 'react';
import { Outlet, Link } from 'react-router-dom';

function Layout() {
  return (
    <>
      <header className="global-header">
        <Link to="/">
          <img 
            src="/logo.png" 
            alt="GolfLink Chroma Logo" 
            className="header-logo" 
          />
        </Link>
      </header>
      <main>
        <Outlet /> {/* 이 부분에 각 페이지의 내용이 렌더링됩니다. */}
      </main>
    </>
  );
}

export default Layout;