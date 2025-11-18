// src/api.js

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
 

/**
 * API 요청을 보내는 기본 함수
 * @param {string} url - 요청할 URL
 * @param {object} options - fetch API에 전달될 옵션
 * @returns {Promise<any>} - API 응답 데이터
 */
const request = async (url, options = {}) => {
  const token = localStorage.getItem('adminToken'); // 'adminToken' 또는 사용하는 토큰 키

  // 기본 헤더 객체 생성
  const headers = {};

  // 토큰이 있으면 Authorization 헤더를 추가
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  // 1. body 데이터 타입에 따라 Content-Type과 body를 다르게 설정
  if (options.body) {
    if (options.body instanceof FormData) {
      // ✅ body가 FormData일 경우:
      // Content-Type 헤더를 설정하지 않습니다. (브라우저가 자동으로 'multipart/form-data'와 boundary를 설정)
      // body는 그대로 FormData 객체를 사용합니다.
    } else {
      // ✅ body가 일반 객체일 경우 (JSON):
      // Content-Type을 'application/json'으로 명시적으로 설정합니다.
      headers['Content-Type'] = 'application/json';
      // body를 JSON 문자열로 변환합니다.
      options.body = JSON.stringify(options.body);
    }
  }

  // 최종 config 객체 생성
  const config = {
    ...options,
    headers: {
      ...headers,
      ...options.headers, // 추가적인 헤더가 있을 경우 병합
    },
  };

  try {
    const response = await fetch(`${API_BASE_URL}${url}`, config);
    if (!response.ok) {
      if (response.status === 401) {
        localStorage.removeItem('adminToken');
        window.location.href = '/login';
        return Promise.reject(new Error('인증이 만료되었습니다.'));
      }
      // 서버가 보낸 에러 메시지를 우선적으로 사용
      const errorData = await response.json().catch(() => null);
      const errorMessage = errorData?.message || 'API 요청에 실패했습니다.';
      throw new Error(errorMessage);
    }

    // 응답 본문이 없는 경우 (204 No Content 등)
    if (response.status === 204 || !response.headers.get("content-type")) {
      return null;
    }

    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return response.json(); 
    } else {
      return response.text();
    }
  } catch (error) {
    console.error('API 에러:', error.message);
    throw error;
  }
};

// 2. 사용하기 편리하도록 API 메서드를 객체로 묶어 export
export const api = {
  // === JSON 데이터를 사용하는 기본 메서드들 ===
  get: (url) => request(url, { method: 'GET' }),
  post: (url, data) => request(url, { method: 'POST', body: data }),
  put: (url, data) => request(url, { method: 'PUT', body: data }),
  delete: (url) => request(url, { method: 'DELETE' }),

  // === FormData(파일 포함)를 사용하는 메서드들 ===
  // 이름만 다르게 하여 명확히 구분해서 사용합니다. 로직은 request 함수가 알아서 처리합니다.
  postMultipart: (url, formData) => request(url, { method: 'POST', body: formData }),
  putMultipart: (url, formData) => request(url, { method: 'PUT', body: formData }),
};