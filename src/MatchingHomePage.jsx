import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from './api'; // api.js 경로는 실제 프로젝트에 맞게 확인해주세요.

function MatchingHomePage() {
  const navigate = useNavigate();
  
  const [districts, setDistricts] = useState([]);
  const [selectedDistrictId, setSelectedDistrictId] = useState('');

  useEffect(() => {
    const fetchDistricts = async () => {
      try {
        const data = await api.get('/api/districts');
        setDistricts(data);
      } catch (error) { 
        console.error("지역 그룹 정보 로딩 실패:", error); 
      }
    };
    fetchDistricts();
  }, []);

  // ⬇️ '다음' 버튼 클릭 시 실행되는 함수가 수정되었습니다.
  const handleNextClick = () => {
    // '기타' 옵션을 선택한 경우
    if (selectedDistrictId === 'etc') {
      // 다음 페이지로 '기타'를 선택했다는 특별한 정보를 전달합니다.
      navigate('/matching-user-info', { 
        state: { districtInfo: { districtId: 'etc', name: '기타 (직접 입력)' } } 
      });
    } 
    // 기존 지역을 선택한 경우 (이전과 동일)
    else if (selectedDistrictId) {
      const selectedDistrict = districts.find(d => d.districtId == selectedDistrictId);
      navigate('/matching-user-info', { state: { districtInfo: selectedDistrict } });
    }
  };

  return (
    <div className="container lesson-home-page">
      <div className="lesson-content-wrapper">        
        <div className="selection-card">
          <div className="lesson-card-header">
            <h3>매칭 지역 선택</h3>
            <p>매칭을 진행할 원하시는 지역 그룹을 선택해주세요.</p>
          </div>

          <div className="selection-box">
            <label htmlFor="district-select">지역 그룹</label>
            <select 
              id="district-select"
              value={selectedDistrictId} 
              onChange={e => setSelectedDistrictId(e.target.value)}
            >
              <option value="" disabled>지역 그룹을 선택해주세요</option>
              {districts.map(district => (
                <option key={district.districtId} value={district.districtId}>
                  {district.name}
                </option>
              ))}
              {/* ⬇️ '기타' 옵션이 하드코딩으로 추가되었습니다. */}
              <option value="etc">그 외 지역</option>
            </select>
          </div>
        </div>
        
        {selectedDistrictId && (
          <button className="next-button" onClick={handleNextClick}>
            매칭 정보 입력하기
          </button>
        )}
      </div>
    </div>
  );
}

export default MatchingHomePage;