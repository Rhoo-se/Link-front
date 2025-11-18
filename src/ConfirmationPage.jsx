import React from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import './ConfirmationPage.css'; 

function ConfirmationPage() {
  const navigate = useNavigate();
  const location = useLocation();

  // 이전 페이지(BookingPage)에서 전달받은 정보 추출
  // state가 없는 경우를 대비해 기본값(|| {})을 설정하여 에러 방지
  const { bookingInfo, selectedTime, date } = location.state || {};
  const selectedDate = date || new Date().toISOString().split('T')[0];
  
  // 선택된 시간이 없을 경우를 대비한 기본값
  const safeSelectedTime = selectedTime || '00:00~00:00';
  const startTime = safeSelectedTime.split('~')[0];
  
  // 정확한 시간 계산 함수
  const addMinutes = (time, minutes) => {
    const [hours, mins] = time.split(':').map(Number);
    const dateObj = new Date();
    dateObj.setHours(hours, mins + minutes, 0, 0);
    const newHours = String(dateObj.getHours()).padStart(2, '0');
    const newMinutes = String(dateObj.getMinutes()).padStart(2, '0');
    return `${newHours}:${newMinutes}`;
  };

  // 타임라인 구간 정보
  const segments = [
    { label: '몸풀기', duration: 10, className: 'practice' },
    { label: '레슨', duration: 15, className: 'lesson' },
    { label: '연습', duration: 30, className: 'practice' },
    { label: '피드백', duration: 5, className: 'feedback' },
  ];

  // 경계선 시간 계산
  const timePoints = [];
  const labelPositions = [];
  let cumulativeMinutes = 0;
  timePoints.push(startTime);
  labelPositions.push(0);
  segments.forEach(segment => {
    cumulativeMinutes += segment.duration;
    timePoints.push(addMinutes(startTime, cumulativeMinutes));
    labelPositions.push((cumulativeMinutes / 60) * 100);
  });

  // 다음 단계로 이동하는 함수
  const handleNextStepClick = () => {
    // UserInfoPage로 필요한 모든 정보를 state에 담아 전달
    navigate('/user-info', { 
      state: { 
        bookingInfo,
        selectedTime: safeSelectedTime,
        date: selectedDate
      } 
    });
  };

  // bookingInfo가 없는 경우 (잘못된 접근) 처리
  if (!bookingInfo) {
      return (
        <div className="container" style={{ textAlign: 'center', paddingTop: '2rem' }}>
          <p>예약 정보가 올바르지 않습니다. 예약 페이지로 돌아가 다시 시도해주세요.</p>
          <button className="next-button" onClick={() => navigate('/')}>홈으로 돌아가기</button>
        </div>
      );
  }

  return (
    <div className="container confirmation-page">
      <div className="info-card">
        <p className="title">예약 내역 확인</p>
        <div className="pro-info">
          <img src={bookingInfo.profilePicUrl || "/pro_pic.svg"} alt="프로 사진" className="profile-pic small" />
          <div className="pro-details">
            <p className="golf-course">{bookingInfo.courseName}</p>
            <p className="pro-name">{bookingInfo.proName} 프로</p>
            <p className="package-info">{bookingInfo.packageInfo}</p>
            <p className="reserved-time">{selectedDate} / {safeSelectedTime}</p>
            <p className="price">{bookingInfo.price.toLocaleString()}원</p>
          </div>
        </div>
      </div>
      
      <div className="timeline-card">
        <p className="title">레슨 타임라인</p>
          <div className="timeline-wrapper">
            <div className="timeline-graph">
              {segments.map((segment, index) => (
                <div
                  key={index}
                  className={`timeline-segment ${segment.className}`}
                  style={{ flexGrow: segment.duration }} 
                >
                  {segment.label}
                </div>
              ))}
            </div>
            {timePoints.map((time, index) => (
              <span
                key={index}
                className="timeline-label"
                style={{ left: `${labelPositions[index]}%` }}
              >
                {time}
              </span>
            ))}
          </div>
      </div>
      
      <div className="notice-card">
        <p className="title">유의사항</p>
        <ul>
          <li>입금 확인 후 예약이 확정됩니다.</li>
          <li>정해진 시간에 맞춰 레슨이 진행됩니다.</li>
          <li>이용권 시작 시간 2시간 이전까지만<br />
              일정 변경 및 환불이 가능하며,<br />
              이후 환불 및 일정 변경이 불가능합니다.</li>
          <li>결제 후 1시간 내 취소는 언제든 환불 가능합니다.</li>
          <li>예약 변경 및 환불 문의는 010-6848-6373(대표 이재도)으로 연락주세요.</li>
        </ul>
      </div>

      <div className="account-card">
        <p className="title">입금 계좌 안내</p>
        <p>카카오뱅크 이재도</p>
        <p className="account-number">3333-34-9403186</p>
      </div>

      <button className="next-button" onClick={handleNextStepClick}>
        입금 후 다음 단계로
      </button>
    </div>
  );
}

export default ConfirmationPage;