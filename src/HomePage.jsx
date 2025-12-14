import React from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css'; // CSS 파일 임포트

/**
 * 활기차고 동적인 느낌을 주는 새로운 메인 진입 페이지입니다.
 * 히어로 섹션과 카드형 UI로 사용자의 흥미를 유발합니다.
 */
function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="container home-page">
      {/* 1. 히어로 섹션: 서비스의 첫인상을 결정합니다. */}
      <div className="hero-section">
        <div className="hero-content">
          <img src="/logo_bw.svg" alt="GolfLink 서비스 로고" className="hero-logo" />
          <h1 className="hero-title">골프를 즐기는<br/>새로운 방식</h1>
          <a 
        href="https://youtube.com/shorts/QuPAtO1wrY0?si=qDB4CHtd0gVJEheH" 
        className="hero-brand-film-link"
        target="_blank"
        rel="noopener noreferrer"
      >
        매칭 영상 보기 ▶
      </a>
        </div>
      </div>

      {/* 2. 서비스 선택 섹션: 카드형 UI로 개선 */}
      <div className="selection-wrapper">
        <p className="selection-guide">어떤 서비스를 이용하시겠어요?</p>
        <div className="choice-container">
          
          <div className="choice-card" onClick={() => navigate('/matching-user-info')}>
            <div className="card-icon">🤝</div>
            <h2 className="card-title">스크린 골프 매칭</h2>
            <p className="card-description">간편하게, 나와 맞는 골퍼와 플레이하세요.</p>
          </div>

          {
          <div className="choice-card" onClick={() => navigate('/lessons')}>
            <div className="card-icon">🏌️</div>
            <h2 className="card-title">골프 레슨 예약</h2>
            <p className="card-description">필요한 날만, 합리적으로 배우세요.</p>
          </div>
        }

          <div className="choice-card choice-card--recommended" // <--- 이 클래스를 추가해주세요
            onClick={() => navigate('/info')}>
            <span className="card-badge">추천</span> {/* <--- 이 뱃지를 추가해주세요 */}
            <div className="card-icon">ℹ️</div>
            <h2 className="card-title">자세히 알아보기</h2>
            <p className="card-description">골프링크의 모든 것을 확인해보세요.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;