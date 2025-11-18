import React from 'react';
import { useNavigate } from 'react-router-dom';
import './InfoTeamPage.css'; // 이 페이지를 위한 새 CSS 파일

// 1. src/assets 폴더에서 이미지를 import 합니다.
import cauLogo from './assets/cau-logo.png'; 
import repPhoto from './assets/rep-photo.jpg';

function InfoTeamPage() {
  const navigate = useNavigate();

  return (
    <div className="container info-detail-page">
      <div className="info-header">
        <button onClick={() => navigate(-1)} className="back-button-large">{'<'} 뒤로 가기</button>
      </div>

      <div className="info-content">
        <div className="section text-center">
          <h2 className="section-title question">골프링크는 어떤 팀인가요?</h2>
          {/* 2. import한 이미지를 src 속성에 사용합니다. */}
          <img src={cauLogo} alt="중앙대학교 로고" className="team-logo" />
          <p className="intro-text">
            <strong>우리는 중앙대 창업동아리에서 시작했어요.</strong><br />
            졸업 후, 골프링크를 만들어가고 있어요.
          
          </p>
        </div>
        <br/>
        <div className="divider"></div>
        <br/>
        <div className="section">
          <p className="highlight-text">
            <strong>현재는 개발자 친구와 함께 <br/>서비스 테스트 단계에서 <br/>
              웹페이지로 시범 운영을 하고 있어요.</strong>
          </p>
          <p className="highlight-text goal">
            <strong>앱 정식 출시를 목표로 더 많은 사람이 가볍고<br />
            즐겁게 골프를 즐길 수 있는 환경을 만들기 위해<br />
            달리고 있어요.</strong>
          </p>
        </div>
        
        <div className="divider"></div>

        <div className="section">
            <p className="highlight-text final-word">
                <strong>마지막으로 운영자이자 대표로서 직접 인사 드리겠습니다!</strong>
            </p>
            <div className="representative-card">
                <img src={repPhoto} alt="대표 사진" className="rep-photo" />
                <div className="rep-greeting">
                    <p>안녕하세요!</p>
                    <p>골프링크를 운영 중인 이재도입니다.</p>
                    <p>골프링크는 제가 직접 책임지고 운영하는 서비스 입니다.</p>
                    <p>아직 시범 단계이지만, 더 많은 분들이 부담 없이 즐길 수 있도록 최선을 다하겠습니다!</p>
                </div>
            </div>
        </div>

        <div className="section contact">
          <h4>📞 문의 안내</h4>
          <p>
            불편한 사항이나 의견이 있으시면 언제든 말씀해주세요.<br />
            * 카카오톡 채널ID: golflink(골프링크)<br />
            * 전화/문자 010-6848-6373<br />
            여러분의 피드백을 소중히 반영하겠습니다.
          </p>
          <p className="thanks">이용해주셔서 감사합니다!</p>
        </div>
      </div>
    </div>
  );
}

export default InfoTeamPage;
