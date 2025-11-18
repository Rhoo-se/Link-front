import React from 'react';
import { useNavigate } from 'react-router-dom';
import './InfoPlatformPage.css'; // 새 CSS 파일 import

function InfoPlatformPage() {
  const navigate = useNavigate();

  return (
    <div className="container info-detail-page">
      <div className="info-header">
        <button onClick={() => navigate(-1)} className="back-button-large">{'<'} 뒤로 가기</button>
      </div>

      <div className="info-content">
        <div className="section">
          <h2 className="section-title question">골프링크는 <br /> 어떤 플랫폼인가요?</h2>
          <p className="main-copy">
            저희는 누구나 골프를 부담없이<br></br>
            즐길 수 있도록, 현재 골프 시장의 <br></br>
            두가지 문제를 해결하려하고 있어요.<br></br> 
          </p>
        </div>
        <br></br>
        <div className="divider"><br></br></div>
        <br></br>
        <div className="section">
          <h3 className="section-title quote">💬 "기존 레슨의 부담스러웠어요."</h3>
          <p className="problem-dialogue">
            “80만원... 너무 비싸다..”<br />
            “일주일에 세번도 못 가는데,<br /> 
            종일 연습장 이용권을 왜 사야해?”<br />
            “장기로 등록하기엔 너무 부담이야”<br />
            “레슨 받는 날만 겨우 가는데,<br />
            연습장 이용권은 안사고 싶다..”<br />
            “필요할 때만 연습하고 싶은데,<br />
             단기는 가격이 너무하네..”
      
          </p>
          <br></br>
          <div className="solution-box">
            <h4 className="solution-title before">우리는 기존의 부담을 없애고</h4>
            <ul className="problem-list">
              <li>수 십, <b>수 백만 원 선결제</b> 강요</li>
              <li>종일권 <b>몇달치 결제</b> 강제</li>
              <li><b>기한 압박</b>과 <b>환불 제한</b></li>
            </ul>
          </div>
          <br></br>
          <div className="solution-box">
            <h4 className="solution-title after">새로운 선택지를 만들었어요.</h4>
            <ul className="solution-list">
              <li>연습+레슨 통합 1회권</li>
              <li><b>1회 단위 33,000원</b></li>
              <li>할 수 있는 날만, 원하는 만큼만</li>
              <li>먼저 경험 후, 맞으면 이어가기</li>
            </ul>
          </div>
        </div>

        <br></br>
        <div className="divider"></div>
        <br></br>
        <div className="section">
          <h3 className="section-title quote">💬 "함께 즐길 사람이 부족해요."</h3>
          <p className="problem-dialogue">
            “혼자 연습만 하니까 금방 지루해..”<br />
            “어른이 돼서 친구 만나기가 어렵네.”<br />
            “맨날 같은 사람들하고만 치니까 재미없다..”
          </p>
          <br></br>

          <div className="solution-box">
            <h4 className="solution-title before">우리는 불편함을 덜어내고</h4>
            <ul className="problem-list">
              <li><b>혼자 연습 → 지루함</b> + 실전감각 부족</li>
              <li>억지 모임, <b>부담스러운 동호회</b></li>
            </ul>
          </div>
          <br></br>
          <div className="solution-box">
            <h4 className="solution-title after">자연스러운 즐거움을 더했어요.</h4>
            <ul className="solution-list">
              <li><b>스크린 골프 자동 매칭</b></li>
              <li><b>동네 골퍼</b>와 가볍게, 실전처럼 플레이</li>
              <li>새롭게, <b>자연스럽게</b> 즐기는 골프</li>
            </ul>
          </div>
        </div>
        <br></br>
        <div className="divider"></div>
        <br></br>
        <div className="section conclusion">
          <p>
            골프링크는  골프의 부담스러움을 <br/>
            해결하려고 하는 플랫폼이에요.
          </p>
        </div>
        <br></br>
        <br></br>
        <div className="section contact">
          <h4>📞 문의 안내</h4>
          <p>
            불편한 사항이나 문의사항이 있으면 언제든 말씀해주세요.<br />
            (카카오톡 채널ID: golflink)<br />
            * 전화/문자 010-6848-6373<br />
            여러분 덕분에 발전합니다!
          </p>
          <p className="thanks">이용해주셔서 감사합니다!</p>
        </div>
      </div>
    </div>
  );
}

export default InfoPlatformPage;
