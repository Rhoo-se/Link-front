import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from './api';
import CourseFormModal from './CourseFormModal';
import './AdminSettingPage.css'; // 같은 폴더에 있는 CSS를 import 합니다.

function AdminSettingPage() {
  const [regions, setRegions] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedRegionId, setSelectedRegionId] = useState('');
  const [selectedDistrictId, setSelectedDistrictId] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRegions = async () => {
      try {
        const data = await api.get('/api/admin/regions');
        setRegions(data || []);
      } catch (error) { console.error("지역 정보 로딩 실패:", error); }
    };
    fetchRegions();
  }, []);

  useEffect(() => {
    if (!selectedRegionId) {
      setDistricts([]);
      setSelectedDistrictId('');
      setCourses([]);
      return;
    }
    const fetchDistricts = async () => {
      try {
        const data = await api.get(`/api/admin/districts?regionId=${selectedRegionId}`);
        setDistricts(data || []);
        setSelectedDistrictId('');
        setCourses([]);
      } catch (error) { console.error("지역 그룹 정보 로딩 실패:", error); }
    };
    fetchDistricts();
  }, [selectedRegionId]);

  useEffect(() => {
    if (!selectedDistrictId) {
      setCourses([]);
      return;
    }
    const fetchCoursesByDistrict = async () => {
      try {
        const data = await api.get(`/api/admin/courses?districtId=${selectedDistrictId}`);
        setCourses(data || []);
      } catch (error) { console.error("골프장 정보 로딩 실패:", error); }
    };
    fetchCoursesByDistrict();
  }, [selectedDistrictId]);

  const handleOpenModal = () => {
    if (!selectedDistrictId) {
      alert('먼저 지역 그룹을 선택해야 신규 구장을 추가할 수 있습니다.');
      return;
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => setIsModalOpen(false);

  const handleSubmit = async (formData) => {
    try {
      await api.post('/api/admin/courses', formData);
      handleCloseModal();
      alert('신규 골프장이 성공적으로 추가되었습니다.');
      const response = await api.get(`/api/admin/courses?districtId=${selectedDistrictId}`);
      setCourses(response || []);
    } catch (error) {
      console.error('골프장 추가 실패:', error);
      alert(`저장에 실패했습니다: ${error.response?.data?.message || '서버 오류'}`);
    }
  };
  
  const handleRowClick = (courseId) => {
    navigate(`/admin/course/${courseId}`);
  };

  return (
    <div className="admin-setting-page">
      <header className="admin-setting-header">
        <h1>골프장 목록</h1>
        <div className="header-actions">
          <button onClick={() => navigate('/admin')} className="btn-nav">예약 관리</button>
          <button onClick={handleOpenModal} className="btn-add">+ 신규 구장 추가</button>
        </div>
      </header>

      <div className="filter-bar">
        <label htmlFor="region-filter">필터:</label>
        <select id="region-filter" className="filter-select" value={selectedRegionId} onChange={(e) => setSelectedRegionId(e.target.value)}>
          <option value="">지역 선택</option>
          {regions.map(r => (<option key={r.regionId} value={r.regionId}>{r.name}</option>))}
        </select>
        <select className="filter-select" value={selectedDistrictId} onChange={(e) => setSelectedDistrictId(e.target.value)} disabled={!selectedRegionId}>
          <option value="">지역 그룹 선택</option>
          {districts.map(d => (<option key={d.districtId} value={d.districtId}>{d.name}</option>))}
        </select>
      </div>
      
      <div className="table-wrapper">
        <table className="course-table clickable">
          <thead>
            <tr>
              <th>ID</th>
              <th>이름</th>
              <th>주소</th>
            </tr>
          </thead>
          <tbody>
            {courses.length > 0 ? courses.map(course => (
              <tr key={course.courseId} onClick={() => handleRowClick(course.courseId)} title={`${course.name} 상세 정보 보기`}>
                <td>{course.courseId}</td>
                <td>{course.name}</td>
                <td>{course.address}</td>
              </tr>
            )) : (
              <tr><td colSpan="3" className="no-data-cell">표시할 데이터가 없습니다. 필터를 선택해주세요.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <CourseFormModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSubmit={handleSubmit}
          initialData={null}
          districts={districts}
          selectedDistrictId={selectedDistrictId}
        />
      )}
    </div>
  );
}

export default AdminSettingPage;
