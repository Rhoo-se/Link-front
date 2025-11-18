import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from './api';
import './AllReservationPage.css';

function AllReservation() {
    const navigate = useNavigate();

    const [lessonReservations, setLessonReservations] = useState([]);
    const [isLessonLoading, setIsLessonLoading] = useState(true);
    const [lessonError, setLessonError] = useState(null);

    const [matchingReservations, setMatchingReservations] = useState([]);
    const [isMatchingLoading, setIsMatchingLoading] = useState(true);
    const [matchingError, setMatchingError] = useState(null);

    const [hiddenLessonIds, setHiddenLessonIds] = useState(new Set());
    const [hiddenMatchingIds, setHiddenMatchingIds] = useState(new Set());
    const [checkedLessonIds, setCheckedLessonIds] = useState(new Set());
    const [checkedMatchingIds, setCheckedMatchingIds] = useState(new Set());

    useEffect(() => {
        const token = localStorage.getItem('adminToken');
        if (!token) {
            alert('로그인이 필요한 페이지입니다.');
            navigate('/admin/login');
        }
    }, [navigate]);

    useEffect(() => {
        const fetchAllData = async () => {
            // 레슨 예약 데이터 가져오기
            setIsLessonLoading(true);
            try {
                const lessonData = await api.get(`/api/admin/all-reservations?_t=${new Date().getTime()}`);
                setLessonReservations(lessonData);
                setLessonError(null);
            } catch (err) {
                console.error("레슨 예약 목록 로딩 실패:", err);
                setLessonError("레슨 예약 목록을 불러오는데 실패했습니다.");
            } finally {
                setIsLessonLoading(false);
            }

            // 매칭 예약 데이터 가져오기
            setIsMatchingLoading(true);
            try {
                // ⬇️ API 엔드포인트를 정확하게 수정합니다.
                const matchingData = await api.get(`/api/matching-reservations?_t=${new Date().getTime()}`);
                setMatchingReservations(matchingData);
                setMatchingError(null);
            } catch (err) {
                console.error("매칭 예약 목록 로딩 실패:", err);
                if (err.response && err.response.status === 403) {
                    setMatchingError("매칭 예약 목록을 볼 권한이 없습니다.");
                } else {
                    setMatchingError("매칭 예약 목록을 불러오는데 실패했습니다.");
                }
            } finally {
                setIsMatchingLoading(false);
            }
        };
        fetchAllData();
    }, []);

    // --- 개별 체크박스 핸들러 ---
    const handleLessonCheckboxChange = (id, isChecked) => {
        setCheckedLessonIds(prev => {
            const newSet = new Set(prev);
            isChecked ? newSet.add(id) : newSet.delete(id);
            return newSet;
        });
    };

    const handleMatchingCheckboxChange = (id, isChecked) => {
        setCheckedMatchingIds(prev => {
            const newSet = new Set(prev);
            isChecked ? newSet.add(id) : newSet.delete(id);
            return newSet;
        });
    };
    
    // --- '전체 선택' 체크박스 핸들러 추가 ---
    const handleSelectAllLessons = (isChecked) => {
        if (isChecked) {
            const allVisibleIds = visibleLessonReservations.map(r => r.reservationId);
            setCheckedLessonIds(new Set(allVisibleIds));
        } else {
            setCheckedLessonIds(new Set());
        }
    };

    const handleSelectAllMatchings = (isChecked) => {
        if (isChecked) {
            const allVisibleIds = visibleMatchingReservations.map(m => m.matchingId);
            setCheckedMatchingIds(new Set(allVisibleIds));
        } else {
            setCheckedMatchingIds(new Set());
        }
    };


    // --- 숨기기/표시 핸들러 ---
    const handleHideSelectedLessons = () => {
        setHiddenLessonIds(prev => new Set([...prev, ...checkedLessonIds]));
        setCheckedLessonIds(new Set());
    };

    const handleHideSelectedMatchings = () => {
        setHiddenMatchingIds(prev => new Set([...prev, ...checkedMatchingIds]));
        setCheckedMatchingIds(new Set());
    };

    const handleShowAllLessons = () => {
        setHiddenLessonIds(new Set());
    };
    
    const handleShowAllMatchings = () => {
        setHiddenMatchingIds(new Set());
    };

    // --- 헬퍼 컴포넌트 및 변수 ---
    const ScheduleDisplay = ({ scheduleJson }) => {
        if (!scheduleJson) return <span>-</span>;
        try {
            const schedules = JSON.parse(scheduleJson);
            if (!Array.isArray(schedules) || schedules.length === 0) return <span>{scheduleJson}</span>;
            return (
                <div>
                    {schedules.map((item, index) => (
                        <div key={index} style={{ marginBottom: '5px' }}>
                            <strong>{new Date(item.date).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' })}:</strong> {item.hours.map(h => `${h}:00`).join(', ')}
                        </div>
                    ))}
                </div>
            );
        } catch {
            return <span>{scheduleJson}</span>;
        }
    };

    const visibleLessonReservations = Array.isArray(lessonReservations) 
        ? lessonReservations.filter(reservation => !hiddenLessonIds.has(reservation.reservationId))
        : [];

    const visibleMatchingReservations = Array.isArray(matchingReservations)
        ? matchingReservations.filter(match => !hiddenMatchingIds.has(match.matchingId))
        : [];

    // --- 렌더링 ---
    return (
        <div className="all-reservations-page">
            <div className="page-header">
                <h1>전체 예약 현황</h1>
                <button onClick={() => navigate(-1)} className="back-button">뒤로 가기</button>
            </div>

            {/* --- 레슨 전체 예약자 --- */}
            <div className="reservation-section">
                <div className="section-header">
                    <h2>레슨 전체 예약자</h2>
                    <div className="button-group">
                        <button onClick={handleHideSelectedLessons} className="hide-selected-button">선택 항목 숨기기</button>
                        <button onClick={handleShowAllLessons} className="show-all-button">숨김 해제</button>
                    </div>
                </div>
                {isLessonLoading ? <p>데이터를 불러오는 중입니다...</p> : lessonError ? <p style={{ color: 'red' }}>{lessonError}</p> : (
                    <div className="table-wrapper">
                        <table>
                            <thead>
                                <tr>
                                    {/* ⬇️ '전체 선택' 체크박스 추가 ⬇️ */}
                                    <th>
                                        <input
                                            type="checkbox"
                                            checked={visibleLessonReservations.length > 0 && checkedLessonIds.size === visibleLessonReservations.length}
                                            onChange={(e) => handleSelectAllLessons(e.target.checked)}
                                        />
                                    </th>
                                    <th>ID</th>
                                    <th>예약자</th>
                                    <th>연락처</th>
                                    <th>담당 프로</th>
                                    <th>예약일</th>
                                    <th>시간</th>
                                    <th>구력</th>
                                    <th>타수</th>
                                    <th>상태</th>
                                    <th>방문경로</th>
                                    <th>신청일</th>
                                </tr>
                            </thead>
                            <tbody>
                                {visibleLessonReservations.length > 0 ? (
                                    visibleLessonReservations.map(reservation => (
                                        <tr key={reservation.reservationId}>
                                            <td>
                                                <input 
                                                    type="checkbox" 
                                                    checked={checkedLessonIds.has(reservation.reservationId)}
                                                    onChange={(e) => handleLessonCheckboxChange(reservation.reservationId, e.target.checked)}
                                                />
                                            </td>
                                            <td>{reservation.reservationId}</td>
                                            <td>{reservation.userName || '정보 없음'}</td>
                                            <td>{reservation.phoneNumber || '정보 없음'}</td>
                                            <td>{reservation.proName || '미지정'}</td>
                                            <td>{reservation.reservationDate}</td>
                                            <td>{reservation.reservationTime}</td>
                                            <td>{reservation.experience}</td>
                                            <td>{reservation.swing_count}</td>
                                            <td>{reservation.status || '알 수 없음'}</td>
                                            <td>{reservation.channel || '-'} </td>
                                            <td>{reservation.createdAt ? new Date(reservation.createdAt).toLocaleString() : 'N/A'}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr><td colSpan="9">표시할 레슨 예약 내역이 없습니다.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* --- 매칭 전체 예약자 --- */}
            <div className="reservation-section">
                 <div className="section-header">
                    <h2>매칭 전체 예약자</h2>
                    <div className="button-group">
                        <button onClick={handleHideSelectedMatchings} className="hide-selected-button">선택 항목 숨기기</button>
                        <button onClick={handleShowAllMatchings} className="show-all-button">숨김 해제</button>
                    </div>
                </div>
                {isMatchingLoading ? <p>데이터를 불러오는 중입니다...</p> : matchingError ? <p style={{ color: 'red' }}>{matchingError}</p> : (
                    <div className="table-wrapper">
                        <table>
                            <thead>
                                <tr>
                                    {/* ⬇️ '전체 선택' 체크박스 추가 ⬇️ */}
                                    <th>
                                        <input
                                            type="checkbox"
                                            checked={visibleMatchingReservations.length > 0 && checkedMatchingIds.size === visibleMatchingReservations.length}
                                            onChange={(e) => handleSelectAllMatchings(e.target.checked)}
                                        />
                                    </th>
                                    <th>신청자</th>
                                    <th>연락처</th>
                                    <th>신청자 나이대</th>
                                    <th>성별</th>
                                    <th>활동 지역</th>
                                    <th>구력</th>
                                    <th>평균 타수</th>
                                    <th>선호 플레이</th>
                                    <th>선호 브랜드/시설</th>
                                    <th>요청사항</th>
                                    <th>희망 일정</th>
                                    <th>방문 경로</th>
                                    <th>신청일</th>
                                </tr>
                            </thead>
                            <tbody>
                                {visibleMatchingReservations.length > 0 ? (
                                    visibleMatchingReservations.map(match => (
                                        <tr key={match.matchingId}>
                                            <td>
                                                <input 
                                                    type="checkbox"
                                                    checked={checkedMatchingIds.has(match.matchingId)}
                                                    onChange={(e) => handleMatchingCheckboxChange(match.matchingId, e.target.checked)}
                                                />
                                            </td>
                                            <td>{match.name || '정보 없음'}</td>
                                            <td>{match.phoneNumber || '정보 없음'}</td>
                                            <td>{match.age || '-'}</td>
                                            <td>{match.gender || '-'}</td>
                                            <td>{match.subDistrictName || '-'}</td>
                                            <td>{match.experience || '-'}</td>
                                            <td>{match.score || '-'}</td>
                                            <td>{match.preferredPlay || '-'}</td>
                                            <td>{match.preferredBrand || '-'}</td>
                                            <td>{match.requests || '-'}</td>
                                            <td><ScheduleDisplay scheduleJson={match.schedule} /></td>
                                            <td>{match.inflowPath || '-'}</td>
                                            <td>{match.createdAt ? new Date(match.createdAt).toLocaleString() : 'N/A'}</td>

                                        </tr>
                                    ))
                                ) : (
                                    <tr><td colSpan="11">표시할 매칭 예약 내역이 없습니다.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

export default AllReservation;

