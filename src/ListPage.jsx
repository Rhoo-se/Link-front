import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { api } from './api';
import ProfessionalDetail from './ProfessionalDetail'; // 상세 정보 컴포넌트 import
import './ListPage.css'; // ListPage에 필요한 CSS import

function ListPage() {
  // State: 목록에 표시될 프로들의 정보
  const [professionals, setProfessionals] = useState([]);
  
  // State: 모달 제어를 위한 상태
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProId, setSelectedProId] = useState(null);

  // Router hooks
  const location = useLocation();
  const navigate = useNavigate();

  // 이전 페이지(HomePage)에서 넘겨받은 지역 정보
  const districtInfo = location.state?.districtInfo;
  const districtId = districtInfo?.districtId;

  // --- Effects ---

  // 1. districtId를 기반으로 프로 목록을 불러오는 Effect
  useEffect(() => {
    // districtId가 없으면 홈페이지로 리디렉션
    if (!districtId) {
      console.warn("District ID가 없습니다. 홈페이지로 이동합니다.");
      navigate('/');
      return;
    }

    const fetchProfessionals = async () => {
      try {
        const data = await api.get(`/api/professionals/district?districtId=${districtId}`);
        
        // --- ⬇️ 수정된 부분: 가격 낮은 순으로 정렬 ⬇️ ---
        const sortedData = data.sort((a, b) => a.price - b.price);
        setProfessionals(sortedData);
        // --- ⬆️ 여기까지 수정 ⬆️ ---

      } catch (error) {
        console.error("프로 목록을 불러오는 데 실패했습니다:", error);
      }
    };

    fetchProfessionals();
  }, [districtId, navigate]);

  
  // --- Handlers ---

  // '상세 보기' 버튼 클릭 핸들러
  const handleDetailClick = (proId) => {
    setSelectedProId(proId); // 어떤 프로를 보여줄지 ID 저장
    setIsModalOpen(true);   // 모달 열기
  };

  // 모달 닫기 핸들러
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProId(null); // ID 초기화
  };


  // --- Render ---

  // 지역 정보가 없는 경우의 예외 처리
  if (!districtInfo) {
    return <div>지역 그룹을 먼저 선택해주세요.</div>;
  }

  return (
    <div className="container list-page">
      <div className="content-card">
        <h2 className="page-title" style={{ textAlign: 'center' }}>
          {districtInfo.name} 담당 프로
        </h2>
      </div>
      
      <div className="pro-list-container">
        {professionals.length > 0 ? (
          professionals.map(pro => (
            <div key={pro.proId} className="pro-card">
              <img src={pro.profilePicUrl || '/pro_pic.svg'} alt={pro.name} className="pro-card-image" />
              <div className="pro-card-info">
                <p className="pro-affiliation">{pro.affiliation}</p>
                <p className="pro-teacher-name">{pro.name} 프로</p>
                {pro.parkingInfo && (
                  <p className="parking-screen-info">🚗 {pro.parkingInfo}  🏌️‍♂️{pro.screenInfo}</p>
                )}
                <p className="pro-phrase">"{pro.phrase}"</p>
                <p className="package-info">{pro.packageInfo}</p>
                <p className="price">{pro.price.toLocaleString()}원</p>
                
                <button 
                  className="detail-button" 
                  onClick={(e) => {
                    e.stopPropagation(); // 카드 전체의 다른 이벤트 전파를 막음
                    handleDetailClick(pro.proId);
                  }}
                >
                  상세 보기
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="content-card">
            <p>등록된 프로 강사가 없습니다.</p>
          </div>
        )}
      </div>

      {/* 모달 UI: isModalOpen이 true일 때만 렌더링 */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-button" onClick={closeModal}>X</button>
            {/* 선택된 proId가 있을 때 ProfessionalDetail 컴포넌트를 렌더링 */}
            {selectedProId && <ProfessionalDetail proId={selectedProId} />}
          </div>
        </div>
      )}
    </div>
  );
}

export default ListPage;
