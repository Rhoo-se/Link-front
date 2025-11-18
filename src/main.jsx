// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; // 이 부분을 추가
import App from './App.jsx';
import './index.css';
import ReactGA from "react-ga4";

const GA_MEASUREMENT_ID = "G-HK40NNYED7"; 
ReactGA.initialize(GA_MEASUREMENT_ID);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* App 컴포넌트를 BrowserRouter로 감싸줍니다. */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);