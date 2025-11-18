import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { api } from './api';
import './UserInfoPage.css';

function UserInfoPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const { bookingInfo, selectedTime, date } = location.state || {};

  const [userInfo, setUserInfo] = useState({
    userName: '',
    phoneNumber: '',
    experience: '',
    swingCount: '',
    coachingPart: '',
    channel: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserInfo(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // --- 유효성 검사 ---
    const phoneRegex = /^010\d{8}$/;
    if (!phoneRegex.test(userInfo.phoneNumber)) {
      alert('전화번호 형식이 올바르지 않습니다.\n010으로 시작하는 11자리 숫자를 입력해주세요.');
      return;
    }
    if (!userInfo.channel) {
      alert('방문 경로를 선택해주세요.');
      return;
    }
    
    // --- 백엔드 전송 데이터 구성 ---
    const reservationData = {
      userName: userInfo.userName,
      phoneNumber: userInfo.phoneNumber,
      experience: userInfo.experience,
      swingCount: userInfo.swingCount,
      coachingPart: userInfo.coachingPart,
      channel: userInfo.channel,
      proId: bookingInfo.proId,
      reservationDate: date,
      reservationTime: selectedTime
    };

    try {
      // API 호출 후 백엔드로부터 생성된 예약 정보 수신
      const createdReservation = await api.post('/api/reservations', reservationData);
      
      // --- ⬇️ 수정된 핵심 로직 ⬇️ ---
      // SuccessPage로 보낼 최종 데이터를 만듭니다.
      // 백엔드 응답(createdReservation)과 기존에 가지고 있던 bookingInfo의 courseName을 합칩니다.
      const successPageData = {
        ...createdReservation, // reservationId, userName, phoneNumber 등
        courseName: bookingInfo.courseName // bookingInfo에서 courseName을 추가
      };
      
      // 완성된 데이터를 SuccessPage로 전달하며 이동
      navigate('/success', { 
        state: { 
          reservationDetails: successPageData, 
        } 
      });
      // --- ⬆️ 여기까지 수정 ⬆️ ---

    } catch (error) {
      console.error('예약 생성 중 오류 발생:', error);
      alert('서버에 문제가 발생하여 예약을 완료할 수 없습니다. 잠시 후 다시 시도해주세요.');
    }
  };

  // --- 잘못된 접근 예외 처리 ---
  if (!bookingInfo) {
    return (
      <div className="container" style={{ textAlign: 'center', paddingTop: '2rem' }}>
        <p>잘못된 접근입니다. 예약 정보를 찾을 수 없습니다.</p>
        <button className="next-button" onClick={() => navigate('/')}>홈으로 돌아가기</button>
      </div>
    );
  }

  // --- JSX 렌더링 ---
  return (
    <div className="container user-info-page">
      <div className="user-form-card">
        <div className="card-header">
          <h1 className="title">레슨 예약 정보 입력</h1>
          <p className="subtitle">예약 확정 문자 전송 및 효율적인 레슨을 위해<br /> 
            정확한 정보 입력을 부탁드립니다.</p>
        </div>

        <form className="info-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="userName">이름</label>
            <input id="userName" type="text" name="userName" value={userInfo.userName} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label htmlFor="phoneNumber">전화번호 (필수)</label>
            <input 
              id="phoneNumber" 
              type="tel" 
              name="phoneNumber" 
              value={userInfo.phoneNumber} 
              onChange={handleChange}
              pattern="010[0-9]{8}"
              title="010으로 시작하는 11자리 숫자를 입력해주세요."
              required 
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="experience">구력</label>
            <select id="experience" name="experience" value={userInfo.experience} onChange={handleChange} required>
              <option value="" disabled>선택해주세요</option>
              <option value="1년 미만">1년 미만</option>
              <option value="1~3년">1~3년</option>
              <option value="3~5년">3~5년</option>
              <option value="5년 이상">5년 이상</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="swingCount">평균 타수</label>
            <select id="swingCount" name="swingCount" value={userInfo.swingCount} onChange={handleChange} required>
              <option value="" disabled>선택해주세요</option>
              <option value="100타 이상">100타 이상</option>
              <option value="90-99타">90-99타</option>
              <option value="80-89타">80-89타</option>
              <option value="79타 이하">79타 이하</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="coachingPart">요청사항</label>
            <input id="coachingPart" type="text" name="coachingPart" value={userInfo.coachingPart} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label htmlFor="channel">방문 경로 (필수)</label>
            <select id="channel" name="channel" value={userInfo.channel} onChange={handleChange} required>
              <option value="" disabled>어떻게 알게 되셨나요?</option>
              <option value="전단지">전단지</option>
              <option value="스크린골프장 전단지">스크린골프장 전단지</option>
              <option value="골프연습장 전단지">골프연습장 전단지</option>
              <option value="아파트 게시판">아파트 게시판</option>
              <option value="네이버 밴드">네이버 밴드</option>
              <option value="인스타그램">인스타그램</option>
              <option value="유튜브">유튜브</option>
              <option value="지인 추천">지인 추천</option>
              <option value="기타">기타</option>
            </select>
          </div>
          
          <button type="submit" className="next-button">완료하기</button>
        </form>
      </div>
    </div>
  );
}

export default UserInfoPage;
