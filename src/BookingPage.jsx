import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { api } from './api';
import { ALL_TIMES } from './timetable';
import './BookingPage.css';

// --- 헬퍼 함수들 ---

// 두 날짜가 같은 날인지 확인하는 함수
const isSameDay = (date1, date2) => {
  return date1.getFullYear() === date2.getFullYear() &&
         date1.getMonth() === date2.getMonth() &&
         date1.getDate() === date2.getDate();
};

// 특정 날짜가 오늘보다 이전인지 확인하는 함수
const isBeforeToday = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // 오늘 날짜의 자정으로 설정
    return date < today;
};

// 타임슬롯을 오전/오후/저녁으로 그룹화하는 헬퍼 함수
const groupTimeSlots = (slots) => {
  return slots.reduce((acc, slot) => {
    const hour = parseInt(slot.time.split(':')[0], 10);
    let period = '오후';
    if (hour < 12) period = '오전';
    else if (hour >= 18) period = '저녁';
    const hourKey = `${hour}시`;
    if (!acc[period]) acc[period] = {};
    if (!acc[period][hourKey]) acc[period][hourKey] = [];
    acc[period][hourKey].push(slot);
    return acc;
  }, {});
};

function BookingPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const proId = location.state?.proId;

  const [bookingInfo, setBookingInfo] = useState(null); 
  const [loading, setLoading] = useState(true);
  
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [groupedTimeSlots, setGroupedTimeSlots] = useState({});
  const [selectedPeriod, setSelectedPeriod] = useState('전체');

  // Effect 1: 기본 정보 로딩
  useEffect(() => {
    if (!proId) {
      alert("잘못된 접근입니다. 홈에서 다시 시도해주세요.");
      navigate('/');
      return;
    }
    const fetchBookingInfo = async () => {
      try {
        setLoading(true);
        const data = await api.get(`/api/booking/info?proId=${proId}`);
        setBookingInfo(data);
      } catch (error) {
        console.error("예약 정보를 불러오는 데 실패했습니다:", error);
        setBookingInfo(null);
      } finally {
        setLoading(false);
      }
    };
    fetchBookingInfo();
  }, [proId, navigate]);

  // Effect 2: 예약 현황 로딩
  useEffect(() => {
    if (!bookingInfo || !selectedDate) return;

    const fetchReservations = async () => {
      try {
        const dateString = selectedDate.toISOString().split('T')[0];
        const reservedSlots = await api.get(`/api/reservations?date=${dateString}&proId=${bookingInfo.proId}`);
        
        const today = new Date();
        const isToday = isSameDay(selectedDate, today);
        const currentHour = today.getHours();
        const currentMinute = today.getMinutes();

        const updatedSlots = ALL_TIMES.map(time => {
          // ⬇️ 'HH:MM~HH:MM' 같은 형식도 처리할 수 있도록 시작 시간만 파싱합니다.
          const startTime = time.split('~')[0];
          const [slotHour, slotMinute] = startTime.split(':').map(Number);
          
          // ⬇️ '시'와 '분'을 모두 비교하여 시간이 지났는지 정확하게 확인합니다.
          // 현재 시간이 슬롯 시작 시간보다 크거나 같은 경우 '지난 시간'으로 처리합니다.
          const hasPassed = isToday && (slotHour < currentHour || (slotHour === currentHour && slotMinute <= currentMinute));
          
          if (reservedSlots.includes(time) || hasPassed) {
            return { time, status: 'reserved' };
          }
          return { time, status: 'available' };
        });
        
        setGroupedTimeSlots(groupTimeSlots(updatedSlots));
      } catch (error) {
        console.error("예약 현황을 불러오는 데 실패했습니다:", error);
        setGroupedTimeSlots({});
      }
    };

    fetchReservations();
  }, [selectedDate, bookingInfo]); 

  // 월 선택 옵션을 생성하는 함수
  const generateMonthOptions = () => {
    const options = [];
    const today = new Date();
    for (let i = 0; i < 12; i++) {
      const date = new Date(today.getFullYear(), today.getMonth() + i, 1);
      options.push({ 
        value: `${date.getFullYear()}-${date.getMonth() + 1}`, 
        label: `${date.getFullYear()}년 ${date.getMonth() + 1}월` 
      });
    }
    return options;
  };

  // 월 변경 핸들러
  const handleMonthChange = (event) => {
    const [year, month] = event.target.value.split('-').map(Number);
    const newDate = new Date(year, month - 1, 1);
    
    const today = new Date();
    if (newDate.getFullYear() === today.getFullYear() && newDate.getMonth() === today.getMonth()) {
        setSelectedDate(today);
    } else {
        setSelectedDate(newDate);
    }
  };
  
  // 날짜 이동 시 이전 날짜로 가지 못하도록 수정합니다.
  const moveDate = (amount) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() + amount);
    if (isBeforeToday(newDate)) {
        alert("이전 날짜는 선택할 수 없습니다.");
        return;
    }
    setSelectedDate(newDate);
  };

  // 달력 렌더링 시 이전 날짜를 비활성화하도록 수정합니다.
  const renderCalendarDates = () => {
    const dates = [-2, -1, 0, 1, 2].map(offset => {
      const date = new Date(selectedDate);
      date.setDate(date.getDate() + offset);
      return date;
    });

    return dates.map(date => {
      const isPast = isBeforeToday(date);
      const isSelected = isSameDay(date, selectedDate);
      
      const classNames = `date-item ${isSelected ? 'selected' : ''} ${isPast ? 'disabled' : ''}`;

      return (
        <div 
          key={date.toISOString()}
          className={classNames}
          onClick={() => !isPast && setSelectedDate(date)} // 과거 날짜는 클릭 방지
        >
          <div className="day-of-week">{['일', '월', '화', '수', '목', '금', '토'][date.getDay()]}</div>
          <div className="day">{date.getDate()}</div>
        </div>
      );
    });
  };
  
  // 시간 선택 및 확인 페이지 이동 핸들러
  const handleTimeSlotClick = (time) => {
    navigate('/confirmation', { 
      state: { 
        bookingInfo: bookingInfo, 
        selectedTime: time, 
        date: selectedDate.toISOString().split('T')[0] 
      } 
    });
  };
  
  // 로딩 중일 때 표시할 UI
  if (loading) {
    return <div className="container booking-page-loading">예약 정보를 불러오는 중...</div>;
  }
  
  // bookingInfo를 불러오지 못했을 때 표시할 UI
  if (!bookingInfo) {
    return (
      <div className="container booking-page-error">
        <p>프로 정보가 없습니다. 홈에서 다시 선택해주세요.</p>
        <button onClick={() => navigate('/')}>홈으로</button>
      </div>
    );
  }

  const slotsToDisplay = selectedPeriod === '전체'
    ? groupedTimeSlots
    : groupedTimeSlots[selectedPeriod] ? { [selectedPeriod]: groupedTimeSlots[selectedPeriod] } : {};
  
  return (
    <div className="container booking-page">
      <div className="profile-section content-card">
        <img src={bookingInfo.profilePicUrl || '/pro_pic.svg'} alt={bookingInfo.proName} className="profile-pic" />
        <p className="pro-name">{bookingInfo.proName} 프로</p>
        <p className="golf-course">{bookingInfo.courseName}</p>
      </div>
      
      <div className="calendar-section content-card">
        <select 
          className="month-select"
          value={`${selectedDate.getFullYear()}-${selectedDate.getMonth() + 1}`}
          onChange={handleMonthChange}
        >
          {generateMonthOptions().map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        
        <div className="calendar-dates-wrapper">
          <div className="arrow" onClick={() => moveDate(-1)}>{'<'}</div>
          <div className="calendar-dates">
            {renderCalendarDates()}
          </div>
          <div className="arrow" onClick={() => moveDate(1)}>{'>'}</div>
        </div>
      </div>
      
      <div className="time-slots-container content-card">
        <div className="period-filter-container">
          <select 
            className="period-filter" 
            value={selectedPeriod} 
            onChange={(e) => setSelectedPeriod(e.target.value)}
          >
            <option value="전체">전체 시간</option>
            <option value="오전">🌞 오전</option>
            <option value="오후">🌤️ 오후</option>
            <option value="저녁">🌙 저녁</option>
          </select>
        </div>
        
        {Object.keys(slotsToDisplay).length > 0 ? (
          Object.entries(slotsToDisplay).map(([period, hours]) => (
            hours && (
              <div key={period} className="time-period">
                <h3 className="period-title">{period}</h3>
                {Object.entries(hours).map(([hour, slots]) => (
                  <div key={hour} className="hour-group">
                    <div className="hour-label">{hour}</div>
                    <div className="slots-grid">
                      {slots.map((slot) => (
                        <button
                          key={slot.time}
                          className={`time-slot ${slot.status}`}
                          disabled={slot.status === 'reserved'}
                          onClick={() => handleTimeSlotClick(slot.time)}
                        >
                          {slot.time}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )
          ))
        ) : (
          <p className="no-slots-message">선택하신 날짜에 예약 가능한 시간이 없습니다.</p>
        )}
      </div>
    </div>
  );
}

export default BookingPage;

