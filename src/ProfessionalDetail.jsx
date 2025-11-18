import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from './api';
import './ProfessionalDetail.css';

const KAKAO_MAP_JAVASCRIPT_KEY = 'bacc25fd74fa95ebd584f4b3390c9a3e';

function ProfessionalDetail({ proId }) {
  const navigate = useNavigate();
  const mapRef = useRef(null);

  const [professional, setProfessional] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('info');

  useEffect(() => {
    if (!proId) return;
    const fetchProfessionalDetail = async () => {
      try {
        setLoading(true);
        const data = await api.get(`/api/professionals/detail/${proId}`);
        setProfessional(data);
      } catch (error) {
        console.error("프로 상세 정보 로딩 실패:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfessionalDetail();
  }, [proId]);

  useEffect(() => {
    if (activeTab !== 'location' || !professional?.course?.latitude) {
      return;
    }

    const loadKakaoMap = () => {
      window.kakao.maps.load(() => {
        if (mapRef.current) {
          const latLng = new window.kakao.maps.LatLng(professional.course.latitude, professional.course.longitude);
          const map = new window.kakao.maps.Map(mapRef.current, { center: latLng, level: 3 });
          const marker = new window.kakao.maps.Marker({ position: latLng });
          marker.setMap(map);
        }
      });
    };

    if (window.kakao && window.kakao.maps) {
      loadKakaoMap();
    } else {
      const script = document.createElement('script');
      script.id = 'kakao-map-script';
      script.async = true;
      script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_MAP_JAVASCRIPT_KEY}&autoload=false`;
      document.head.appendChild(script);
      script.onload = loadKakaoMap;
    }
  }, [professional, activeTab]);


  const handleBookingClick = () => {
    if(!professional) return;
    navigate('/booking', { state: { proId: professional.proId, courseId: professional.course.courseId } });
  };

  if (loading) return <div className="detail-loading">상세 정보를 불러오는 중...</div>;
  if (!professional) return <div className="detail-error">프로 정보를 찾을 수 없습니다.</div>;

  return (
    // [핵심 1] 전체 레이아웃을 Flexbox 컨테이너로 변경합니다.
    <div className="professional-detail">
      
      {/* [핵심 2] 스크롤이 필요한 모든 콘텐츠를 이 div로 감쌉니다. */}
      <div className="detail-content-scrollable">
        <div className="detail-profile">
          <h2 className="detail-name">{professional.name} 프로</h2>
        </div>
        
        <div className="detail-tabs">
          <button 
            className={`tab-button ${activeTab === 'info' ? 'active' : ''}`}
            onClick={() => setActiveTab('info')}
          >
            프로 정보
          </button>
          <button 
            className={`tab-button ${activeTab === 'location' ? 'active' : ''}`}
            onClick={() => setActiveTab('location')}
          >
            연습장 위치
          </button>
        </div>

        <div className="detail-tab-content">
          {activeTab === 'info' && (
            <>
              <div className="detail-section">
                <h3 className="detail-section-title">레슨 정보</h3>
                <div className="detail-info-item">
                  <span className="detail-info-label">가격</span>
                  <span className="detail-info-value price">{professional.price.toLocaleString()}원</span>
                </div>
                <div className="detail-info-item">
                  <span className="detail-info-label">패키지</span>
                  <span className="detail-info-value">{professional.packageInfo}</span>
                </div>
              </div>

              {professional.specialty && (
                <div className="detail-section">
                  <h3 className="detail-section-title">특이사항</h3>
                  <p className="detail-specialty-text">{professional.specialty}</p>
                </div>
              )}
            </>
          )}

          {activeTab === 'location' && (
            <>
              {professional.course && (
                <div className="detail-section">
                  <h3 className="detail-section-title">{professional.course.name}</h3>
                  <p className="detail-address-text">{professional.course.address}</p>
                  <div id="map" ref={mapRef} className="detail-map-container"></div>
                </div>
              )}
               {professional.course?.parkingInfo && (
                <div className="detail-section">
                  <h3 className="detail-section-title">주차 정보</h3>
                  <p className="detail-specialty-text">{professional.course.parkingInfo}</p>
                </div>
              )}
            </>
          )}
        </div>

        {professional.contact && (
          <div className="detail-contact-section">
            <p>📞 상담문의: {professional.contact}</p>
          </div>
        )}
      </div>

      {/* [핵심 3] 버튼을 별도의 푸터 영역으로 분리합니다. */}
      <div className="detail-footer">
        <button className="detail-next-button" onClick={handleBookingClick}>예약하기</button>
      </div>
    </div>
  );
}

export default ProfessionalDetail;
