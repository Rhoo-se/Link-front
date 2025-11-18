import React, { useState, useEffect } from 'react';

function ProFormModal({ isOpen, onClose, onSubmit, initialData, courseId }) {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    // ⬇️ phrase 필드를 packageInfo 위로 이동
    phrase: '',
    packageInfo: '',
    specialty: '', // specialty 필드 추가
  });
  // 이미지 파일은 별도의 state로 관리합니다.
  const [profilePicFile, setProfilePicFile] = useState(null);

  useEffect(() => {
    // 모달이 열리고 수정 데이터(initialData)가 있을 때 폼을 채웁니다.
    if (isOpen && initialData) {
      setFormData({
        name: initialData.name || '',
        price: initialData.price || '',
        phrase: initialData.phrase || '',
        packageInfo: initialData.packageInfo || '',
        specialty: initialData.specialty || '', // specialty 데이터 설정
      });
    } else {
      // 모달이 열리고 '추가' 모드일 때는 폼을 깨끗하게 비웁니다.
      setFormData({ name: '', price: '', phrase: '', packageInfo: '', specialty: '' });
    }

    // 모달이 열릴 때마다 파일 선택을 초기화합니다.
    setProfilePicFile(null);
    const fileInput = document.getElementById('profilePicFile');
    if (fileInput) {
      fileInput.value = '';
    }

  }, [initialData, isOpen]);

  // 모달이 닫혀있으면 아무것도 렌더링하지 않습니다.
  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setProfilePicFile(e.target.files[0]);
    } else {
      setProfilePicFile(null);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const data = new FormData();
    
    const proDto = initialData 
      ? { ...formData } 
      : { ...formData, courseId: courseId };
    
    data.append('proDto', new Blob([JSON.stringify(proDto)], { type: "application/json" }));
    
    if (profilePicFile) {
      data.append('image', profilePicFile);
    }
    
    onSubmit(data);
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <h2>{initialData ? '강사 정보 수정' : '신규 강사 추가'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">이름</label>
            <input id="name" type="text" name="name" value={formData.name} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="specialty">특이사항</label>
            <input id="specialty" type="text" name="specialty" value={formData.specialty} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label htmlFor="price">가격 (숫자만 입력)</label>
            <input id="price" type="number" name="price" value={formData.price} onChange={handleChange} required />
          </div>
          {/* --- ⬇️ '프로의 한마디' 필드가 '패키지 정보' 위로 이동하고, 라벨이 수정되었습니다. ⬇️ --- */}
          <div className="form-group">
            <label htmlFor="phrase">프로의 한마디</label>
            <textarea id="phrase" name="phrase" value={formData.phrase} onChange={handleChange}></textarea>
          </div>
          {/* --- ⬆️ 여기까지 수정 ⬆️ --- */}
          <div className="form-group">
            <label htmlFor="packageInfo">패키지 정보</label>
            <input id="packageInfo" type="text" name="packageInfo" value={formData.packageInfo} onChange={handleChange} />
          </div>          
          <div className="form-group">
            <label htmlFor="profilePicFile">프로필 사진 (수정 시, 변경할 경우에만 선택)</label>
            <input id="profilePicFile" type="file" onChange={handleFileChange} accept="image/*" />
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

export default ProFormModal;
