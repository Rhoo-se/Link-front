import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * 이 컴포넌트는 라우트(경로)가 변경될 때마다
 * 페이지 스크롤을 맨 위(0, 0)로 이동시킵니다.
 * 화면에 보이는 UI는 없으며, 기능만 수행합니다.
 */
function ScrollToTop() {
  // 현재 경로 정보를 가져옵니다.
  const { pathname } = useLocation();

  // pathname이 바뀔 때마다 useEffect가 실행됩니다.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  // 이 컴포넌트는 아무것도 렌더링하지 않습니다.
  return null;
}

export default ScrollToTop;
