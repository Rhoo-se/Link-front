import React from 'react';
import './WelcomePopup.css'; // 팝업 디자인을 위한 CSS

function WelcomePopup({ onClose, onHideToday }) {
  return (
    <div className="popup-backdrop">
      <div className="popup-content">
        <h2 className="popup-title">📢 안내</h2>
        <div className="popup-body">
          <p>현재 웹페이지로 예약 운영 중입니다.</p>
          <p>25년 1월 어플리케이션 정식 출시 예정입니다.</p>
          <p>현재 11월 23일까지의 매칭이 마감되었습니다!</p>
          <p>24일 이후의 매칭 신청을 부탁드립니다.</p>
          <p>감사합니다!</p>
          <hr />
          <p className="popup-info">
            매칭 서비스에 대한 소개는<br />
            ‘자세히 알아보기’ 에서 확인 하실 수 있습니다!
          </p>
        </div>
        <div className="popup-footer">
          <button onClick={onHideToday} className="popup-button hide-today">오늘 보지 않기</button>
          <button onClick={onClose} className="popup-button close">닫기</button>
        </div>
      </div>
    </div>
  );
}

export default WelcomePopup;
