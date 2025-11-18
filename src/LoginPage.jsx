import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom'; // useNavigate는 더 이상 필요 없으므로 삭제
import { api } from './api';

function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/admin";

    const handleLogin = async (e) => {
    e.preventDefault();
    try {
        // 1. `api.post`는 백엔드가 보낸 '토큰 문자열'을 직접 반환합니다.
        const token = await api.post('/api/login', { username, password });

        // 2. 이 `token` 변수에는 순수한 토큰 문자열이 들어있으므로, 바로 저장합니다.
        //    (response.data를 사용할 필요가 없습니다.)
        localStorage.setItem('adminToken', token);
        
        console.log("localStorage에 저장된 토큰:", localStorage.getItem('adminToken')); // 저장 후 확인용 로그

        navigate(from, { replace: true });
    } catch (error) {
        alert('아이디 또는 비밀번호가 일치하지 않습니다.');
        console.error('로그인 실패:', error);
    }
};

    return (
        <div className="container login-container">
<div>      </div>            <form className="info-form login-form" onSubmit={handleLogin}>
                <h2>관리자 로그인</h2>
                <div className="form-group">
                    <label htmlFor="username">아이디</label>
                    <input 
                        id="username" 
                        type="text" 
                        value={username} 
                        onChange={e => setUsername(e.target.value)} 
                        required 
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">비밀번호</label>
                    <input 
                        id="password" 
                        type="password" 
                        value={password} 
                        onChange={e => setPassword(e.target.value)} 
                        required 
                    />
                </div>
                <button type="submit" className="next-button">로그인</button>
            </form>
        </div>
    );
}

export default LoginPage;