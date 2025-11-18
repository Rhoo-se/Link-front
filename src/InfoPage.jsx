import React from 'react';
import { useNavigate } from 'react-router-dom';
import './InfoPage.css'; // CSS 파일 import

// 각 주제에 아이콘과 설명을 추가하여 콘텐츠를 풍부하게 만듭니다.
const infoTopics = [
  // {
  //   icon: '💡',
  //   question: '어떤 플랫폼인가요?',
  //   description: 'GolfLink의 비전과 목표를 소개합니다.',
  //   path: '/info/platform',
  // },
  // {
  //   icon: '🏌️‍♀️',
  //   question: '레슨방식이\n궁금해요',
  //   description: '골프링크만의 새로운 레슨에 대해 알아보세요.',
  //   path: '/info/lesson',
  // },
  {
    icon: '🤝',
    question: '자동 매칭 방식이 궁금해요',
    description: '스크린 골프 파트너를 찾는 새로운 방법!',
    path: '/info/matching',
  },
  {
    icon: '🚀',
    question: '정식 출시는 언제인가요?',
    description: '서비스 런칭 일정과 계획을 확인하세요.',
    path: '/info/launch',
  },
  {
    icon: '💳',
    question: '결제는 어떻게 하나요?',
    description: '골프링크의 결제 방식을 확인하세요.',
    path: '/info/payment',
  },
];

function InfoPage() {
  const navigate = useNavigate();

  const handleNavigate = (path) => {
    navigate(path);
  };

  return (
    <div className="container info-page">
      <div className="info-header">
        <h1>자세히 알아보기</h1>
        <p>GolfLink에 대한 모든 것을 알려드려요.</p>
      </div>

      {/* 카드 그리드 레이아웃 컨테이너 */}
      <div className="info-grid-container">
        {infoTopics.map((topic, index) => (
          // 기존 button을 div 형태의 카드로 변경
          <div
            key={index}
            className="info-card"
            onClick={() => handleNavigate(topic.path)}
          >
            <div className="card-icon">{topic.icon}</div>
            <h2 className="card-question">{topic.question}</h2>
            <p className="card-description">{topic.description}</p>
            <span className="card-arrow">{'>'}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default InfoPage;