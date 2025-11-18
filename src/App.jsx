import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import ScrollToTop from './ScrollToTop';
import ReactGA from 'react-ga4';

// --- 컴포넌트 import ---
import Layout from './Layout';
import ChatButton from './ChatButton'; // ◀◀◀ 1. 채팅 버튼을 여기서 import 합니다.
import WelcomePopup from './WelcomePopup';
import PrivateRoute from './PrivateRoute';
import HomePage from './HomePage';
import LessonHomePage from './LessonHomePage';
import ListPage from './ListPage';
import BookingPage from './BookingPage';
import ConfirmationPage from './ConfirmationPage';
import UserInfoPage from './UserInfoPage';
import SuccessPage from './SuccessPage';
import MatchingHomePage from './MatchingHomePage';
import MatchingUserInfoPage from './MatchingUserInfoPage';
import MatchingSuccessPage from './MatchingSuccessPage';
import InfoPage from './InfoPage';
import InfoPlatformPage from './InfoPlatformPage';
import InfoTeamPage from './InfoTeamPage';
import InfoLessonPage from './InfoLessonPage';
import InfoMatchingPage from './InfoMatchingPage';
import InfoLaunchPage from './InfoLaunchPage';
import InfoPaymentPage from './InfoPaymentPage';
import LoginPage from './LoginPage';
import AdminPage from './AdminPage';
import AllReservation from './AllReservationPage';
import AdminSettingPage from './AdminSettingPage';
import AdminProPage from './AdminProPage';
import AdminCourseDetailPage from './AdminCourseDetailPage';

const RouteChangeTracker = () => {
  const location = useLocation();
  useEffect(() => {
    ReactGA.send({ hitType: "pageview", page: location.pathname + location.search });
  }, [location]);
  return null;
};

function App() {
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const lastHiddenDate = localStorage.getItem('popupHiddenDate');
    if (lastHiddenDate !== today) {
      setShowPopup(true);
    }
  }, []);

  const handleClosePopup = () => setShowPopup(false);
  const handleHideToday = () => {
    const today = new Date().toISOString().split('T')[0];
    localStorage.setItem('popupHiddenDate', today);
    setShowPopup(false);
  };

  return (
    <>
      {showPopup && <WelcomePopup onClose={handleClosePopup} onHideToday={handleHideToday} />}
      <RouteChangeTracker />
      <ScrollToTop />

      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<HomePage />} />
        <Route element={<Layout />}>
          <Route path="/lessons" element={<LessonHomePage />} />
          <Route path="/list" element={<ListPage />} /> 
          <Route path="/booking" element={<BookingPage />} />
          <Route path="/confirmation" element={<ConfirmationPage />} />
          <Route path="/user-info" element={<UserInfoPage />} />
          <Route path="/success" element={<SuccessPage />} />
          <Route path="/matchings" element={<MatchingHomePage />} />
          <Route path="/matching-user-info" element={<MatchingUserInfoPage />} />
          <Route path="/matching-success" element={<MatchingSuccessPage />} />
          <Route path="/info" element={<InfoPage />} />
          <Route path="/info/platform" element={<InfoPlatformPage />} />
          <Route path="/info/team" element={<InfoTeamPage />} />
          <Route path="/info/lesson" element={<InfoLessonPage />} />
          <Route path="/info/matching" element={<InfoMatchingPage />} />
          <Route path="/info/launch" element={<InfoLaunchPage />} />
          <Route path="/info/payment" element={<InfoPaymentPage />} />  
          <Route element={<PrivateRoute />}>
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/admin/all-reservations" element={<AllReservation />} />
            <Route path="/admin/setting" element={<AdminSettingPage />} />
            <Route path="/admin/professionals" element={<AdminProPage />} />
            <Route path="/admin/course/:id" element={<AdminCourseDetailPage />} />
          </Route>
        </Route>
      </Routes>
      
      {/* ◀◀◀ 2. 이 위치에 ChatButton을 추가하여 모든 페이지에 보이도록 합니다. */}
      <ChatButton />
    </>
  );
}

export default App;

