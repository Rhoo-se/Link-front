import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from './api';
import './AdminPage.css'; // 새로 분리된 CSS 파일을 import 합니다.

function AdminPage() {
  // --- 1. State 변수 정의 ---
  const navigate = useNavigate();
  const [regions, setRegions] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [golfCourses, setGolfCourses] = useState([]);
  const [timeSlots, setTimeSlots] = useState([]);
  const [selectedRegionId, setSelectedRegionId] = useState('');
  const [selectedDistrictId, setSelectedDistrictId] = useState('');
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [notification, setNotification] = useState(null);
  const [hasUnread, setHasUnread] = useState(false); // 새로운 알림 유무 상태


  // --- 2. 데이터 로딩 로직 (useEffect) ---
  useEffect(() => {
    const fetchRegions = async () => {
      try {
        const data = await api.get('/api/admin/regions');
        setRegions(data);
        if (data.length > 0) {
          setSelectedRegionId(data[0].regionId);
        }
      } catch (error) {
        console.error("지역 정보 로딩 실패:", error);
      }
    };
    fetchRegions();
  }, []);

  useEffect(() => {
    if (!selectedRegionId) {
      setDistricts([]);
      setGolfCourses([]);
      setSelectedDistrictId('');
      setSelectedCourseId('');
      return;
    }
    const fetchDistricts = async () => {
      try {
        const data = await api.get(`/api/admin/districts?regionId=${selectedRegionId}`);
        setDistricts(data);
        if (data.length > 0) {
          setSelectedDistrictId(data[0].districtId);
        } else {
          setGolfCourses([]);
          setSelectedDistrictId('');
          setSelectedCourseId('');
        }
      } catch (error) {
        console.error("지역 그룹 정보 로딩 실패:", error);
        setDistricts([]);
      }
    };
    fetchDistricts();
  }, [selectedRegionId]);

  useEffect(() => {
    if (!selectedDistrictId) {
      setGolfCourses([]);
      setSelectedCourseId('');
      return;
    }
    const fetchCourses = async () => {
      try {
        const data = await api.get(`/api/admin/courses?districtId=${selectedDistrictId}`);
        setGolfCourses(data);
        if (data.length > 0) {
          setSelectedCourseId(data[0].courseId);
        } else {
          setSelectedCourseId('');
        }
      } catch (error) {
        console.error("골프장 정보 로딩 실패:", error);
        setGolfCourses([]);
      }
    };
    fetchCourses();
  }, [selectedDistrictId]);

  const fetchAdminTimeSlots = async () => {
    if (!selectedCourseId || !selectedDate) {
      setTimeSlots([]);
      return;
    }
    try {
      const data = await api.get(`/api/admin/timeslots?date=${selectedDate}&courseId=${selectedCourseId}`);
      console.log('API로부터 받은 시간표 데이터:', data);

      // [수정] 백엔드가 수정되었으므로 불필요한 데이터 보정 로직을 제거합니다.
      setTimeSlots(data);
      
      // [알림 기능] 원본 데이터를 기준으로 'PENDING' 상태를 확인합니다.
      const pendingIds = data
        .filter(slot => slot.status && slot.status.toUpperCase() === 'PENDING')
        .map(slot => slot.reservationId)
        .filter(id => id != null); // reservationId가 null이 아닌 경우만 필터링
      
      const seenIds = JSON.parse(localStorage.getItem('seenPendingReservations')) || [];
      const hasNewPending = pendingIds.some(id => !seenIds.includes(id));
      setHasUnread(hasNewPending);

    } catch (error) {
      console.error("시간표 정보 로딩 실패:", error);
    }
  };

  useEffect(() => {
    const intervalId = setInterval(fetchAdminTimeSlots, 5000); // 5초마다 데이터 확인
    fetchAdminTimeSlots(); // 초기 로딩
    return () => clearInterval(intervalId);
  }, [selectedCourseId, selectedDate]);


  // --- 3. 핸들러 함수 정의 ---
  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    window.location.replace('/login');
  };

  const handleBellClick = () => {
    const currentPendingIds = timeSlots
      .filter(slot => slot.status && slot.status.toUpperCase() === 'PENDING')
      .map(slot => slot.reservationId)
      .filter(id => id != null);
    
    localStorage.setItem('seenPendingReservations', JSON.stringify(currentPendingIds));
    setHasUnread(false);
  };

  const handleStatusChange = async (slot, newStatus) => {
    try {
      if (newStatus === 'confirmed') {
        await api.post(`/api/admin/reservations/${slot.reservationId}/confirm`, {});
        alert('예약이 확정되었습니다.');
      } else if (newStatus === 'canceled') {
        if (window.confirm(`${slot.reservationId}번 예약을 정말로 취소하시겠습니까?`)) {
          await api.delete(`/api/admin/reservations/${slot.reservationId}`);
          alert('예약이 성공적으로 취소되었습니다.');
        }
      } else if (newStatus === 'blocked') {
        await api.post('/api/admin/blocked-slots', {
          proId: slot.proId, // proId가 필요합니다. TimeSlotDto에 proId를 추가해야 할 수 있습니다.
          blockedDate: selectedDate,
          blockedTime: slot.time,
        });
        alert('해당 시간이 마감 처리되었습니다.');
      } else if (newStatus === 'available') {
        if (window.confirm(`'${slot.time}' 시간의 마감을 해제하시겠습니까?`)) {
          await api.delete(`/api/admin/blocked-slots/${slot.blockedSlotId}`);
          alert('마감이 해제되었습니다.');
        }
      }
      fetchAdminTimeSlots();
    } catch (error) {
      alert('작업에 실패했습니다.');
      console.error('상태 변경 중 오류:', error);
    }
  };

  return (
    <div className="admin-page">
      <header className="admin-header">
        <div />
        <div className="admin-profile">
          <div className="admin-notification-bell" onClick={handleBellClick}>
            <span>🔔</span>
            {hasUnread && <div className="notification-dot"></div>}
          </div>
          <span>Admin</span>
          <button onClick={handleLogout} className="logout-button">로그아웃</button>
        </div>
      </header>
      
      {notification && (
        <div className="notification-popup">
          {notification}
          <button onClick={() => setNotification(null)}>×</button>
        </div>
      )}

      <main className="admin-content">
        <div className="admin-navigation">
            <h2>예약 관리 대시보드</h2>
            <div className="admin-nav-buttons">
                <button 
                  onClick={() => navigate('/admin/all-reservations')}
                  className="nav-button"
                >
                  전체 현황
                </button>
                <button 
                  onClick={() => navigate('/admin/setting')}
                  className="nav-button"
                >
                  골프장 관리
                </button>
            </div>
        </div>

        <div className="top-section-wrapper">
          <div className="filters-container">
            <div className="admin-filters">
              <select value={selectedRegionId} onChange={e => setSelectedRegionId(e.target.value)}>
                <option value="" disabled>지역 선택</option>
                {regions.map(r => <option key={r.regionId} value={r.regionId}>{r.name}</option>)}
              </select>
              <select value={selectedDistrictId} onChange={e => setSelectedDistrictId(e.target.value)}>
                <option value="" disabled>지역 그룹 선택</option>
                {districts.map(d => <option key={d.districtId} value={d.districtId}>{d.name}</option>)}
              </select>
              <select value={selectedCourseId} onChange={e => setSelectedCourseId(e.target.value)}>
                <option value="" disabled>골프장 선택</option>
                {golfCourses.map(c => <option key={c.courseId} value={c.courseId}>{c.name}</option>)}
              </select>
            </div>
            <div className="date-selector">
              <input 
                type="date" 
                value={selectedDate} 
                onChange={e => setSelectedDate(e.target.value)} 
              />
            </div>
          </div>
        </div>

        <div className="reservation-list">
          {timeSlots.map((slot, index) => ( // proId가 없을 수 있으므로 index를 key로 추가
            <div key={`${slot.time}-${index}`} className={`reservation-item status-${slot.status ? slot.status.toLowerCase() : 'available'}`}>
              <div className="info">
                <span className="time">{slot.time}</span>
                <span className="status-text">
                  {/* [수정] 백엔드 상태값(CONFIRMED)과 정확히 일치시킵니다. */}
                  {slot.status && slot.status.toUpperCase() === 'CONFIRMED' && '예약 확정'}
                  {slot.status && slot.status.toUpperCase() === 'PENDING' && '예약 신청'}
                  {slot.status && slot.status.toUpperCase() === 'AVAILABLE' && '예약 가능'}
                  {slot.status && slot.status.toUpperCase() === 'BLOCKED' && '관리자 마감'}
                </span>
                {slot.proName && <span className="user-name"> 프로: {slot.proName}</span>}
                {slot.userName && <span className="user-name"> 손님: {slot.userName}</span>}
                {slot.coachingPart && <span className="coaching-part"> 레슨요청: "{slot.coachingPart}"</span>}
                {slot.channel && <span className="channel"> 방문경로: {slot.channel}</span>}
              </div>
              <div className="actions">
                {/* [수정] 백엔드 상태값(CONFIRMED)과 정확히 일치시킵니다. */}
                {slot.status && slot.status.toUpperCase() === 'PENDING' && (
                  <>
                    <button className="action-button confirm" onClick={() => handleStatusChange(slot, 'confirmed')}>확정</button>
                    <button className="action-button cancel" onClick={() => handleStatusChange(slot, 'canceled')}>취소</button>
                  </>
                )}
                {slot.status && slot.status.toUpperCase() === 'CONFIRMED' && <button className="action-button cancel" onClick={() => handleStatusChange(slot, 'canceled')}>예약취소</button>}
                {slot.status && slot.status.toUpperCase() === 'BLOCKED' && <button className="action-button release" onClick={() => handleStatusChange(slot, 'available')}>해제</button>}
                {slot.status && slot.status.toUpperCase() === 'AVAILABLE' && <button className="action-button block" onClick={() => handleStatusChange(slot, 'blocked')}>마감</button>}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default AdminPage;

