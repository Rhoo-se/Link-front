import React from 'react';
import { useNavigate } from 'react-router-dom';
import './InfoLaunchPage.css'; // 이 페이지를 위한 CSS 파일

function InfoLaunchPage() {
  const navigate = useNavigate();

  return (
    <div className="container info-detail-page">
      <div className="info-header">
        <button onClick={() => navigate(-1)} className="back-button-large">{'<'} 뒤로 가기</button>
      </div>

      <div className="info-content">
        <div className="section text-center">
          <h2 className="section-title question">정식 출시는<br /> 언제부터 되나요?</h2>
        </div>
        <br></br>
        <div className="section">
          <p className="main-text">
            골프링크는 지금 시범 운영 단계예요.
          </p>
          <p className="sub-text">
            여러분이 직접 써보고 주시는 피드백을 꼼꼼히<br />
            반영해<br />
            더 나은 서비스를 만들고 있어요.
          </p>
        </div>
        <br></br>
        <br></br>
        <div className="section">
            <p className="main-text">
                <strong>정식 어플리케이션은<br />
                26년 1월 출시를 목표로 준비중이에요.</strong>
            </p>
            <br></br>
            <br></br>
            <p className="sub-text">
                여러분의 의견을 적극 반영해<br />
                골프링크를 더 편리하고 즐거운 플랫폼으로<br />
                만들어가겠습니다!
            </p>
        </div>
        <br></br>
        <div className="divider"></div>

        <br></br>
        <br></br>
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

export default InfoLaunchPage;
