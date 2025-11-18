import React from 'react';
import { useNavigate } from 'react-router-dom';
import './MatchingSuccessPage.css'; // Success Page를 위한 CSS 파일

function MatchingSuccessPage() {
  const navigate = useNavigate();

  return (
    <div className="container success-page">
      <div className="success-card">
        <div className="success-icon">
          <span>✔️</span>
        </div>
        <h1 className="success-title">매칭 신청이 완료되었습니다.</h1>
        <p className="success-message">
          입력한 내용을 바탕으로 매칭이 진행됩니다.
        </p>
        <p className="success-message">
          매칭이 확정되면 카카오톡 메시지로 상세히 안내드릴 예정이에요.
        </p>
        <p className="success-info">
          추가적인 정보는 첫 화면의 <strong>자세히보기</strong> 메뉴 에서 확인하실 수 있습니다.
        </p>
        <p className="thank-you-message">
          감사합니다
        </p>
        <button onClick={() => navigate('/')} className="home-button">
          홈으로 돌아가기
        </button>
      </div>
    </div>
  );
}

export default MatchingSuccessPage;
