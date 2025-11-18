import React from 'react';
import { useNavigate } from 'react-router-dom';
import './InfoLessonPage.css'; // 이 페이지를 위한 CSS 파일

// src/assets 폴더에 저장한 이미지를 import 합니다.
import lessonFlowImage from './assets/lesson-flow.png';
import lessonComparisonImage from './assets/lesson-comparison.png';

function InfoLessonPage() {
  const navigate = useNavigate();

  return (
    <div className="container info-detail-page">
      <div className="info-header">
        <button onClick={() => navigate(-1)} className="back-button-large">{'<'} 뒤로 가기</button>
      </div>

      <div className="info-content">
        <div className="section text-center">
          <h2 className="section-title question">골프링크의 레슨은<br /> 어떻게 진행되나요?</h2>
          <br></br>
          <p className="intro-text">
            우리는 레슨을 새롭게 구성했어요.
          </p>
          <br></br>
          <br></br>
          <img src={lessonFlowImage} alt="레슨 진행 순서" className="content-image" />
          <br></br>
          <br></br>
          <p className="image-caption">
            ❌ 기존 레슨처럼 <b>“레슨만 해주고 끝?”</b>❌<br />
            ✅ 총 60분, “배우고 → 연습하고 → 피드백까지”<br />
            피드백을 통해 배운 내용이 확실히 몸에 남도록 합니다.
          </p>
        </div>
        <br></br>
        <div className="divider"></div>
        <br></br>
        <br></br>
        <div className="section">
          <h3 className="section-title highlight">⛳ 골프링크 레슨의 장점</h3>
          <ul className="advantages-list">
            <li>
              📌 <b>수십, 수백 만원 선결제</b>를 없앴어요.<br/>
              <b>1회 33,000원,</b> <br/>
              낱개로 부담없이 시작할 수 있어요.
            </li>
            <li>
              📌 <b>검증된 프로님만 모셨어요.</b><br />
              <b>연습장을 직접 운영</b>하는<br />
               책임감있는 프로만 선별했어요.<br />
            </li>
            <li>
              📌 <b>골퍼의 연습 패턴</b>에 맞췄어요.<br />
              <b>갈 수 있는 날만, 시간 날때만 결제</b>하면 돼요.
            </li>
            <li>
              📌 <b>제약</b>을 없앴어요.<br />
              <b>환불 걱정, 레슨 기간 압박,</b><br />
              <b>연습장 이용권 강제</b>가 없어요.
            </li>
            <li>
              📌 끝까지 <b>케어</b>해요.<br />
              마무리 레슨 피드백까지 확실하게 책임져요.
            </li>
          </ul>
        </div>
        <br></br>
        <div className="divider"></div>
        <br></br>
        <br></br>
        <div className="section text-center">
          <img src={lessonComparisonImage} alt="기존 레슨과 비교" className="content-image comparison" />
          <div className="emphasis-box">
            <p>
              일주일에 2~3번 연습장에 간다면<br />
              <strong>골프링크 레슨이 무조건 이득입니다!</strong>
            </p>
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

        <div className="cta-section">
            <button onClick={() => navigate('/lessons')} className="cta-button">
                레슨 신청하러 가기
            </button>
        </div>
      </div>
    </div>
  );
}

export default InfoLessonPage;
