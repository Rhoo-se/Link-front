import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from './api';

function LessonHomePage() {
  const navigate = useNavigate();
  
  // HomePage와 동일하게 district 목록과 선택된 ID를 관리합니다.
  const [districts, setDistricts] = useState([]);
  const [selectedDistrictId, setSelectedDistrictId] = useState('');

  // API를 호출하여 district 목록을 가져옵니다.
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

  const handleNextClick = () => {
    if (selectedDistrictId) {
      const selectedDistrict = districts.find(d => d.districtId == selectedDistrictId);
      // 다음 페이지(ListPage)로 선택된 지역 그룹 정보를 넘깁니다.
      navigate('/list', { state: { districtInfo: selectedDistrict } });
    }
  };

  return (
    <div className="container lesson-home-page">
      <div className="lesson-content-wrapper">        
        <div className="selection-card">
          <div className="lesson-card-header">
            {/* 헤더 텍스트만 원하시는 내용으로 수정할 수 있습니다. */}
            <h3>레슨 지역 선택</h3>
            <p>원하시는 지역 그룹을 선택해주세요.</p>
          </div>

          {/* 지역 그룹 선택 드롭다운 */}
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
            </select>
          </div>
        </div>
        
        {/* 지역 그룹이 선택되면 버튼이 표시됩니다. */}
        {selectedDistrictId && (
          <button className="next-button" onClick={handleNextClick}>
            골프장 목록 보기
          </button>
        )}
      </div>
    </div>
  );
}

export default LessonHomePage;