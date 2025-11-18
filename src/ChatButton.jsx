import React from 'react';
import './ChatButton.css'; // 버튼 스타일을 위한 CSS 파일을 import 합니다.

function ChatButton() {
  // 사용자가 제공한 카카오톡 채널 채팅 URL
  const KAKAO_CHAT_URL = 'http://pf.kakao.com/_LlYkn/chat';

  return (
    // a 태그를 사용하여 간단한 링크로 구현합니다.
    // target="_blank"는 새 탭에서 링크를 열도록 하여, 사용자가 기존 페이지를 벗어나지 않게 합니다.
    <a
      href={KAKAO_CHAT_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="floating-chat-button"
      aria-label="채팅 문의하기"
    >
      {/* [핵심 수정] <br> 태그 대신, 각 텍스트를 별도의 <span>으로 분리합니다. */}
      <span>채팅</span>
      <span>문의</span>
    </a>
  );
}

export default ChatButton;

