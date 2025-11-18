import React from 'react';
import { useNavigate } from 'react-router-dom';
import './InfoMatchingPage.css'; // 이 페이지를 위한 CSS 파일

function InfoMatchingPage() {
  const navigate = useNavigate();
  const NOTION_LINK = 'https://wool-principle-d05.notion.site/2994732a832c8000812fdf3c36552dc8?source=copy_link';

  return (
    <div className="container info-detail-page">
      <div className="info-header">
        <button onClick={() => navigate(-1)} className="back-button-large">{'<'} 뒤로 가기</button>
      </div>

      <div className="info-content">
        <div className="section text-center">
          <h2 className="section-title question">골프링크의 매칭은<br /> 어떻게 진행되나요?</h2>
        </div>
        <br></br>
        <div className="section">
            <h3 className="section-title highlight">📝 진행순서</h3>
              <br></br>

            <ol className="process-list">
                <li>
                    <strong>선호하는 시간, 조건을 입력해요.</strong>
                    <p> (<b>가능한 많은 날짜와 시간을  최대한 많이<br />
                     선택</b>해주셔야 빠르게 매칭이 확정됩니다!)</p>
                </li>
                <li>
                    <b>실력, 나이, 성별, 구력, 지역 등<br />
                    입력한 조건을 반영해 자동 매칭이 진행돼요.</b>
                </li>
                <li>
                    <strong>자동매칭이 완료되면,<br />
                     카카오톡 채팅방에서 일정을 확정해요.</strong>
                     <p>(노쇼 보증금을 설정할 수 있어요!)</p>
                </li>
                <li>
                    <strong>확정된 일정에 맞춰 스크린골프장에 방문해 골프를 즐겨요!</strong>
                    <p>(게임 비용은 방문 결제 입니다!)</p>
                    {/* ▼▼▼ 이 버튼을 추가했습니다 ▼▼▼ */}
                    <br />
                    <a
                      href={NOTION_LINK}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="info-link-button"
                    >
                      노쇼 보증금 정책
                    </a>
                    {/* ▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲ */}
                </li>
            </ol>
        </div>
        <br></br>
        <div className="divider"></div>
        <br></br>
        <div className="section">
            <h3 className="section-title quote">💬 "함께 즐길 사람이 부족해요."</h3>
            <p className="problem-dialogue">
            “혼자 연습만 하니 지루해요.”<br />
            “친구랑 시간 맞추는 게 너무 힘들어요.”<br />
            “동호회는 부담스러워요.”<br />
            “맨날 같은 사람과 쳐서 질려요”<br />
            </p>
            <br></br>
            <div className="solution-box">
                <h4 className="solution-title before">우리는 기존의 번거로움을 덜어내고</h4>
                <ul className="problem-list">
                    <li>직접 모집글을 올려야 함</li>
                    <li>레벨·나이·시간 조건 맞추기 번거로움</li>
                    <li>억지 모임, 부담스러운 동호회</li>
                </ul>
            </div>
            <br></br>
            <div className="solution-box">
                <h4 className="solution-title after">편안함을 추가했어요</h4>
                <ul className="solution-list">
                    <li>자동 매칭 → 조건 맞는 동네 골퍼 연결</li>
                    <li>원하는 시간에 스크린골프 플레이</li>
                    <li>지루한 혼자 연습 대신, 실전 같은 경험</li>
                </ul>
            </div>
        </div>
        <br></br>

        <div className="section conclusion">
          <p>
            <strong>골프링크 자동 매칭</strong>은<br/>
            <strong>“나와 맞는 골퍼와, 내가 원하는 시간에”</strong><br/>
            <strong>부담없이 스크린 골프를 편하게 즐길 수 있는 시스템이에요.</strong>
          </p>
        </div>
        <br></br>
        <br></br>
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
            <button onClick={() => navigate('/matching-user-info')} className="cta-button">
                매칭 신청하러 가기
            </button>
        </div>
      </div>
    </div>
  );
}

export default InfoMatchingPage;
