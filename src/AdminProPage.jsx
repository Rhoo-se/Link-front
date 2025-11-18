import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from './api';
import ProFormModal from './ProFormModal'; // 강사 정보 입력 모달
import './AdminProPage.css'; // 강사 관리 페이지 전용 CSS

function AdminProPage() {
  // 1. 상태 변수 선언
  const [regions, setRegions] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [courses, setCourses] = useState([]);
  const [professionals, setProfessionals] = useState([]); // 강사 목록 상태

  const [selectedRegionId, setSelectedRegionId] = useState('');
  const [selectedDistrictId, setSelectedDistrictId] = useState('');
  const [selectedCourseId, setSelectedCourseId] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPro, setEditingPro] = useState(null);
  const navigate = useNavigate();

  // 2. 드롭다운 데이터 로딩 (AdminPage와 동일한 안정적인 로직 적용)
  useEffect(() => {
    const fetchRegions = async () => {
      try {
        const data = await api.get('/api/admin/regions');
        setRegions(data || []);
      } catch (error) { 
        console.error("지역 정보 로딩 실패:", error); 
        setRegions([]);
      }
    };
    fetchRegions();
  }, []);

  useEffect(() => {
    if (!selectedRegionId) {
      setDistricts([]);
      setCourses([]);
      setSelectedDistrictId('');
      setSelectedCourseId('');
      return;
    }
    const fetchDistricts = async () => {
      try {
        const data = await api.get(`/api/admin/districts?regionId=${selectedRegionId}`);
        setDistricts(data || []);
        // 하위 목록 초기화를 위해 ID도 초기화
        setSelectedDistrictId(''); 
        setSelectedCourseId('');
        setCourses([]);
      } catch (error) { 
        console.error("지역 그룹 정보 로딩 실패:", error);
        setDistricts([]);
      }
    };
    fetchDistricts();
  }, [selectedRegionId]);
  
  useEffect(() => {
    if (!selectedDistrictId) {
      setCourses([]);
      setSelectedCourseId('');
      return;
    }
    const fetchCourses = async () => {
      try {
        const data = await api.get(`/api/admin/courses?districtId=${selectedDistrictId}`);
        setCourses(data || []);
        setSelectedCourseId(''); // 하위 목록 초기화
      } catch (error) { 
        console.error("골프장 정보 로딩 실패:", error); 
        setCourses([]);
      }
    };
    fetchCourses();
  }, [selectedDistrictId]);
  
  // 3. 골프장 선택 시 해당 강사 목록 로딩 (AdminProPage의 핵심 로직)
  useEffect(() => {
    if (!selectedCourseId) {
      setProfessionals([]); 
      return; 
    }
    const fetchProfessionals = async () => {
      try {
        const data = await api.get(`/api/admin/professionals?courseId=${selectedCourseId}`);
        setProfessionals(data || []);
      } catch (error) {
        console.error("강사 정보 로딩 실패:", error);
        setProfessionals([]);
      }
    };
    fetchProfessionals();
  }, [selectedCourseId]);


  // 4. 핸들러 함수 정의
  const handleOpenModal = (pro = null) => {
    setEditingPro(pro);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingPro(null);
  };

  const handleSubmit = async (formData) => {
    const action = editingPro ? '수정' : '추가';
    try {
      if (editingPro) {
        await api.put(`/api/admin/professionals/${editingPro.proId}`, formData);
      } else {
        await api.post('/api/admin/professionals', formData);
      }
      handleCloseModal();
      alert(`강사 ${action}이(가) 완료되었습니다.`);
      
      const response = await api.get(`/api/admin/professionals?courseId=${selectedCourseId}`);
      setProfessionals(response || []);
    } catch (error) {
      console.error(`강사 ${action} 실패:`, error);
      alert(`저장에 실패했습니다: ${error.response?.data?.message || '서버 오류'}`);
    }
  };

  const handleDelete = async (proId, proName) => {
    if (window.confirm(`'${proName}' 강사 정보를 정말로 삭제하시겠습니까?`)) {
      try {
        await api.delete(`/api/admin/professionals/${proId}`);
        alert("삭제가 완료되었습니다.");
        setProfessionals(professionals.filter(pro => pro.proId !== proId));
      } catch (error) {
        console.error("강사 삭제 실패:", error);
        alert(`삭제 실패: ${error.response?.data?.message || '서버 오류'}`);
      }
    }
  };

  return (
    <div className="admin-pro-page">
      <header className="admin-pro-header">
        <h1>강사 관리</h1>
        <div className="header-actions">
          <button onClick={() => navigate('/admin/setting')} className="btn-nav">골프장 관리</button>
          <button onClick={() => navigate('/admin')} className="btn-nav">예약 관리</button>
          <button 
            onClick={() => handleOpenModal()} 
            className="btn-add"
            disabled={!selectedCourseId}
          >
            + 신규 강사 추가
          </button>
        </div>
      </header>

      <div className="filter-bar">
        <label>필터:</label>
        <select onChange={(e) => setSelectedRegionId(e.target.value)} value={selectedRegionId}>
          <option value="">지역 선택</option>
          {regions.map(r => <option key={r.regionId} value={r.regionId}>{r.name}</option>)}
        </select>
        <select onChange={(e) => setSelectedDistrictId(e.target.value)} value={selectedDistrictId}>
          <option value="">지역 그룹 선택</option>
          {districts.map(d => <option key={d.districtId} value={d.districtId}>{d.name}</option>)}
        </select>
        <select onChange={(e) => setSelectedCourseId(e.target.value)} value={selectedCourseId}>
          <option value="">골프장 선택</option>
          {courses.map(c => <option key={c.courseId} value={c.courseId}>{c.name}</option>)}
        </select>
      </div>

      <div className="table-wrapper">
        <table className="pro-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>이름</th>
              <th>가격</th>
              <th>패키지 정보</th>
              <th>관리</th>
            </tr>
          </thead>
          <tbody>
            {professionals.length > 0 ? professionals.map(pro => (
              <tr key={pro.proId}>
                <td>{pro.proId}</td>
                <td>{pro.name}</td>
                <td>{pro.price?.toLocaleString()}원</td>
                <td>{pro.packageInfo}</td>
                <td>
                  <button onClick={() => handleOpenModal(pro)} className="table-btn btn--edit">수정</button>
                  <button onClick={() => handleDelete(pro.proId, pro.name)} className="table-btn btn--delete">삭제</button>
                </td>
              </tr>
            )) : (
              <tr><td colSpan="5" className="no-data-cell">선택된 골프장에 등록된 강사가 없습니다.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <ProFormModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSubmit={handleSubmit}
          initialData={editingPro}
          courseId={selectedCourseId}
        />
      )}
    </div>
  );
}

export default AdminProPage;

