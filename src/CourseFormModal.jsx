import React, { useState, useEffect } from 'react';

function CourseFormModal({ isOpen, onClose, onSubmit, initialData, districts = [], selectedDistrictId }) {
   console.log("2. 모달이 부모로부터 받은 districts:", districts);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    parkingInfo: '',
    screenInfo: '',
    districtId: selectedDistrictId || '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        address: initialData.address || '',
        parkingInfo: initialData.parkingInfo || '',
        screenInfo: initialData.screenInfo || '',
        districtId: initialData.districtId || selectedDistrictId || '',
      });
    }
  }, [initialData, selectedDistrictId]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <h2>{initialData ? '골프장 정보 수정' : '신규 골프장 추가'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="districtId">지역 그룹</label>
            <select id="districtId" name="districtId" value={formData.districtId} onChange={handleChange} required>
                <option value="" disabled>지역 그룹 선택</option>
                {districts.map(d => <option key={d.districtId} value={d.districtId}>{d.name}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="name">이름</label>
            <input id="name" type="text" name="name" value={formData.name} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="address">주소</label>
            <input id="address" type="text" name="address" value={formData.address} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="parkingInfo">주차 정보</label>
            <input id="parkingInfo" type="text" name="parkingInfo" value={formData.parkingInfo} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label htmlFor="screenInfo">스크린 정보</label>
            <input id="screenInfo" type="text" name="screenInfo" value={formData.screenInfo} onChange={handleChange} />
          </div>
          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn-cancel">취소</button>
            <button type="submit" className="btn-submit">저장</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CourseFormModal;
