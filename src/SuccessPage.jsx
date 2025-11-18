import React from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
// import './SuccessPage.css'; // SuccessPage 전용 CSS가 있다면 import

function SuccessPage() {
  const location = useLocation();
  const navigate = useNavigate();

  // --- [⭐ 1. 데이터 받는 방식 수정] ---
  // UserInfoPage에서 보낸 reservationDetails 객체를 먼저 꺼냅니다.
  const reservationDetails = location.state?.reservationDetails || {};

  // 2. 그 객체 안에서 필요한 정보들을 꺼내 씁니다.
  const selectedTime = reservationDetails.reservationTime || '시간 정보 없음';
  const userPhone = reservationDetails.phoneNumber || '전화번호 정보 없음';
  const selectedDate = reservationDetails.reservationDate || '날짜 정보 없음';
  const courseName = reservationDetails.courseName || '골프장 정보 없음';
  const userName = reservationDetails.userName || '고객'; // [추가] 사용자 이름

  // --- 3. 예외 처리 ---
  // reservationDetails 객체에 핵심 정보(ID)가 없다면 잘못된 접근으로 간주합니다.
  if (!reservationDetails.reservationId) {
    return (
      <div className="container" style={{ textAlign: 'center', paddingTop: '2rem' }}>
        <p>잘못된 접근입니다. 예약 내역을 찾을 수 없습니다.</p>
        <button className="next-button" onClick={() => navigate('/')}>홈으로 돌아가기</button>
      </div>
    );
  }

  // --- 4. JSX 렌더링 수정 ---
  return (
    <div className="container success-page">
      <div className="success-info-box">
        {/* 사용자 이름을 넣어 개인화된 메시지를 보여줍니다. */}
        <p className="success-title">{userName}님의 예약 신청이 완료되었습니다</p>
        <div className="reservation-details">
          <p><strong>골프장:</strong> {courseName}</p>
          <p><strong>날짜:</strong> {selectedDate}</p>
          <p><strong>시간:</strong> {selectedTime}</p>
        </div>
      </div>

      <div className="info-card success-message-card">
        <p>확정 후 입력해주신 전화번호</p>
        <p><strong>({userPhone})</strong>로</p>
        <p>예약 확정 연락을 드리겠습니다.</p>
        <br/>
        <p>이용해주셔서 감사합니다!</p>
      </div>

      {/* 홈으로 돌아가는 버튼 추가 */}
      <button className="next-button" onClick={() => navigate('/')}>
        홈으로 돌아가기
      </button>
    </div>
  );
}

export default SuccessPage;