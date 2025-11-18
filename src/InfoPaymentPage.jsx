import React from 'react';
import { useNavigate } from 'react-router-dom';
import './InfoPaymentPage.css'; // 이 페이지를 위한 CSS 파일

function InfoPaymentPage() {
  const navigate = useNavigate();

  return (
    <div className="container info-detail-page">
      <div className="info-header">
        <button onClick={() => navigate(-1)} className="back-button-large">{'<'} 뒤로 가기</button>
      </div>

      <div className="info-content">
        <div className="section text-center">
          <h2 className="section-title question">결제는 어떻게 하나요?</h2>
          <p className="intro-text">
            아직 결제 시스템을 구현하는 단계에 있어요.<br />
            그래서 현재 웹 내 결제는 할 수 없어요
          </p>
        </div>

        <div className="divider"></div>

          <div className="section payment-method">
            <h3 className="section-title highlight">🏌️‍♂️ 스크린 골프 자동 매칭</h3>
            <p className="description">
              예약된 스크린 골프장에서 <br />
              직접 현장 결제를 하면 돼요.<br />
              따로 수수료가 책정되어 있지 않아요.
            </p>
          </div>

        <div className="divider"></div>

          <div className="section payment-method">
            <h3 className="section-title highlight">💳 레슨+연습권 (진행 예정) </h3>
            <p className="description">
              현재는 계좌이체로만 레슨 결제가 가능해요.<br />
              프로님께 수수료 없이 그대로 전달하고 있어요.<br />
              환불 단계를 깔끔하게 하기 위함이에요.
            </p>
          </div>
        
        <div className="divider"></div>

        <div className="section contact">
          <h4>📞 문의 안내</h4>
          <p>
            불편한 사항이나 의견이 있으시면 언제든 말씀해주세요.<br />
            * 카카오톡 채널 Golflink(골프링크)<br />
            * 전화/문자 010-6848-6373<br />
            여러분의 피드백을 소중히 반영하겠습니다.
          </p>
          <p className="thanks">이용해주셔서 감사합니다!</p>
        </div>
      </div>
    </div>
  );
}

export default InfoPaymentPage;
