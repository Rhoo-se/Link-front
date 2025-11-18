import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from './api'; // 수정한 api.js를 import 합니다.
import CourseFormModal from './CourseFormModal';
import ProFormModal from './ProFormModal';
import './AdminCourseDetailPage.css';

function AdminCourseDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [districts, setDistricts] = useState([]);

  const [course, setCourse] = useState(null);
  const [professionals, setProfessionals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  const [isProModalOpen, setIsProModalOpen] = useState(false);
  const [editingPro, setEditingPro] = useState(null);

  // useCallback으로 감싸 불필요한 함수 재생성을 방지합니다.
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [courseResponse, proResponse, districtResponse] = await Promise.all([
        api.get(`/api/admin/courses/${id}`),
        api.get(`/api/admin/courses/${id}/professionals`),
        api.get('/api/admin/districts/all')
      ]);
      setCourse(courseResponse || null);
      setProfessionals(proResponse || []);
      setDistricts(districtResponse || []);
    } catch (error) {
      console.error("데이터 로딩 실패:", error);
      alert(`정보를 불러오는 데 실패했습니다: ${error.message}`);
      setCourse(null);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // 골프장 정보 수정 (JSON 데이터 사용)
  const handleCourseSubmit = async (formData) => {
    try {
      // 일반 JSON 데이터를 보내므로 기존 api.put을 사용합니다.
      await api.put(`/api/admin/courses/${id}`, formData);
      setIsCourseModalOpen(false);
      alert('골프장 정보가 성공적으로 수정되었습니다.');
      fetchData();
    } catch (error) {
      console.error('골프장 수정 실패:', error);
      alert(`수정에 실패했습니다: ${error.message}`);
    }
  };

  // 강사 정보 추가/수정 (FormData 사용)
  const handleProSubmit = async (processedFormData) => {
    const action = editingPro ? '수정' : '추가';
    try {
      if (editingPro) {
        // ✅ FormData(파일 포함)를 보내므로 api.putMultipart를 사용합니다.
        await api.putMultipart(`/api/admin/professionals/${editingPro.proId}`, processedFormData);
      } else {
        // ✅ FormData(파일 포함)를 보내므로 api.postMultipart를 사용합니다.
        await api.postMultipart('/api/admin/professionals', processedFormData);
      }
      setIsProModalOpen(false);
      setEditingPro(null);
      alert(`강사 정보 ${action}이(가) 완료되었습니다.`);
      fetchData();
    } catch (error) {
      console.error(`강사 ${action} 실패:`, error);
      alert(`${action}에 실패했습니다: ${error.message}`);
    }
  };
  
  // 골프장 삭제
  const handleCourseDelete = async () => {
    if (window.confirm(`'${course.name}' 골프장을 정말로 삭제하시겠습니까?\n소속된 모든 강사 정보도 함께 삭제됩니다.`)) {
        try {
            await api.delete(`/api/admin/courses/${id}`);
            alert('골프장이 삭제되었습니다.');
            navigate('/admin/setting');
        } catch (error) {
            console.error('골프장 삭제 실패:', error);
            alert(`삭제에 실패했습니다: ${error.message}`);
        }
    }
  };

  // 강사 삭제
  const handleProDelete = async (proId, proName) => {
    if (window.confirm(`'${proName}' 강사 정보를 정말로 삭제하시겠습니까?`)) {
      try {
        await api.delete(`/api/admin/professionals/${proId}`);
        alert('강사 정보가 삭제되었습니다.');
        fetchData();
      } catch (error) {
        console.error('강사 삭제 실패:', error);
        alert(`삭제에 실패했습니다: ${error.message}`);
      }
    }
  };
  
  // 강사 추가/수정 모달을 여는 함수
  const handleOpenProModal = (pro = null) => {
    setEditingPro(pro);
    setIsProModalOpen(true);
  };

  // 강사 모달을 닫는 함수
  const handleCloseProModal = () => {
    setIsProModalOpen(false);
    setEditingPro(null);
  };

  if (isLoading) return <div className="loading-container">로딩 중...</div>;
  if (!course) return <div className="loading-container">해당 골프장 정보를 찾을 수 없습니다.</div>;

  return (
    <div className="admin-detail-page">
      <header className="admin-detail-header">
        <h1>{course.name} - 상세 관리</h1>
        <button onClick={() => navigate('/admin/setting')} className="btn-nav">목록으로 돌아가기</button>
      </header>

      <section className="detail-section">
        <div className="section-header">
          <h2>골프장 정보</h2>
          <div>
            <button onClick={() => setIsCourseModalOpen(true)} className="btn--edit">정보 수정</button>
            <button onClick={handleCourseDelete} className="btn--delete">구장 삭제</button>
          </div>
        </div>
        <div className="info-grid">
          <p><strong>주소:</strong> {course.address}</p>
          <p><strong>연락처:</strong> {course.contact}</p> {/* 연락처 필드가 있다면 표시 */}
          <p><strong>주차 정보:</strong> {course.parkingInfo}</p>
          <p><strong>스크린 정보:</strong> {course.screenInfo}</p>
        </div>
      </section>

      <section className="detail-section">
        <div className="section-header">
          <h2>소속 강사 관리 ({professionals.length}명)</h2>
          <button onClick={() => handleOpenProModal()} className="btn-add">+ 신규 강사 추가</button>
        </div>
        <div className="table-wrapper">
          <table className="pro-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>이름</th>
                <th>가격</th>
                <th>관리</th>
              </tr>
            </thead>
            <tbody>
              {professionals.length > 0 ? professionals.map(pro => (
                <tr key={pro.proId}>
                  <td>{pro.proId}</td>
                  <td>{pro.name}</td>
                  <td>{pro.price?.toLocaleString()}원</td>
                  <td>
                    <button onClick={() => handleOpenProModal(pro)} className="table-btn btn--edit">수정</button>
                    <button onClick={() => handleProDelete(pro.proId, pro.name)} className="table-btn btn--delete">삭제</button>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan="4" className="no-data-cell">등록된 강사가 없습니다.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {isCourseModalOpen && (
        <CourseFormModal
          isOpen={isCourseModalOpen}
          onClose={() => setIsCourseModalOpen(false)}
          onSubmit={handleCourseSubmit}
          initialData={course}
          districts={districts} 
          selectedDistrictId={course.districtId}
        />
      )}
      {isProModalOpen && (
        <ProFormModal
          isOpen={isProModalOpen}
          onClose={handleCloseProModal}
          onSubmit={handleProSubmit}
          initialData={editingPro}
          courseId={id}
        />
      )}
    </div>
  );
}

export default AdminCourseDetailPage;