import React, { useState, useMemo } from "react"; // useMemo 추가
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import { api } from "./api";
import SchedulePickerModal from "./SchedulePickerModal";
import "./MatchingUserInfoPage.css";

function MatchingUserInfoPage() {
  const navigate = useNavigate();
  const [isPickerModalOpen, setIsPickerModalOpen] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState([]);

  const [formData, setFormData] = useState({
    name: "없음",
    phoneNumber: "",
    age: "",
    experience: "",
    score: "",
    gender: "",
    subDistrictName: "",
    preferredPlay: null,
    preferredBrand: [{ value: "없음", label: "없음" }],
    requests: "",
    inflowPath: "",
  });

  // --- [핵심 수정 1] totalSelectedDates 계산 로직 위치 변경 ---
  // selectedSchedule이 변경될 때만 재계산하도록 useMemo 사용 (성능 최적화)
  const totalSelectedDates = useMemo(() => {
    return selectedSchedule.filter((day) => day.hours.length > 0).length;
  }, [selectedSchedule]);
  // ---

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handlePreferredPlayChange = (selectedOptions) => {
    let finalSelection = selectedOptions;
    if (selectedOptions && selectedOptions.length > 1) {
      const lastSelected = selectedOptions[selectedOptions.length - 1];
      if (lastSelected.value === "상관없음") {
        finalSelection = [lastSelected];
      } else {
        finalSelection = selectedOptions.filter(
          (opt) => opt.value !== "상관없음"
        );
      }
    }
    setFormData((prevState) => ({
      ...prevState,
      preferredPlay: finalSelection,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // hasSchedule 검증은 totalSelectedDates로 대체 가능
    // const hasSchedule = ...

    // --- [핵심 수정 2] handleSubmit 내부의 totalSelectedDates 선언 제거 ---
    // const totalSelectedDates = ... (제거)

    // 컴포넌트 레벨의 totalSelectedDates 사용
    if (totalSelectedDates < 2) {
      alert("가능한 날짜를 최소 2개 이상 선택해주세요!");
      return;
    }
    if (!formData.preferredPlay || formData.preferredPlay.length === 0) {
      alert("선호 플레이 방식을 선택해주세요.");
      return;
    }

    const dataToSend = { ...formData };
    dataToSend.name = "없음";
    const preferredBrandValue = "없음";

    const finalMatchingData = {
      ...dataToSend,
      districtId: 999,
      preferredPlay: dataToSend.preferredPlay
        .map((option) => option.value)
        .join(","),
      preferredBrand: preferredBrandValue,
      schedule: JSON.stringify(selectedSchedule.filter(d => d.hours.length > 0)),
    };

    try {
      await api.post("/api/matching-reservations", finalMatchingData);
      navigate("/matching-success");
    } catch (error) {
      alert(`매칭 신청에 실패했습니다: ${error.message}`);
    }
  };

  const handleSaveSchedule = (finalSelection) => {
    const sortedSelection = finalSelection.sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );
    setSelectedSchedule(sortedSelection);
    setIsPickerModalOpen(false);
  };

  // 헬퍼 함수들 (변경 없음)
  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("ko-KR", {
      month: "short",
      day: "numeric",
      weekday: "short",
    });
  const formatHour = (hour) => `${String(hour).padStart(2, "0")}:00`;

  const preferredPlayOptions = [
    { value: "캐주얼 라운드", label: "캐주얼 라운드(부담 없이 즐기는 플레이)" },
    { value: "집중 라운드", label: "집중 라운드 (스코어 중심 플레이)" },
    { value: "상관없음", label: "상관없음" },
  ];

  return (
    <>
      <div className="container user-info-page">
        <div className="info-card user-form-card">
          <div className="card-header">
            <h1 className="title">스크린골프 매칭 신청</h1>
            <p className="subtitle">
              정확한 매칭을 위해 아래 정보를 입력해주세요.
            </p>
          </div>
          <form className="info-form" onSubmit={handleSubmit}>
            {/* 전화번호 */}
            <div className="form-group">
              <label htmlFor="phoneNumber">전화번호</label>
              <input
                id="phoneNumber"
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                required
              />
            </div>
            {/* 나이대 */}
            <div className="form-group">
              <label htmlFor="age">신청자 나이대</label>
              <select
                id="age"
                name="age"
                value={formData.age}
                onChange={handleChange}
                required
              >
                <option value="" disabled>선택해주세요</option>
                <option value="10대">10대</option>
                <option value="20대">20대</option>
                <option value="30대">30대</option>
                <option value="40대">40대</option>
                <option value="50대">50대</option>
                <option value="60대">60대</option>
                <option value="70대">70대</option>
                <option value="80대 이상">80대 이상</option>
              </select>
            </div>
            {/* 구력 */}
            <div className="form-group">
              <label htmlFor="experience">구력</label>
              <select
                id="experience"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                required
              >
                <option value="" disabled>선택해주세요</option>
                <option value="1년 미만">1년 미만</option>
                <option value="1~3년">1~3년</option>
                <option value="3~5년">3~5년</option>
                <option value="5년 이상">5년 이상</option>
              </select>
            </div>
            {/* 평균 타수 */}
            <div className="form-group">
              <label htmlFor="score">평균 타수</label>
              <select
                id="score"
                name="score"
                value={formData.score}
                onChange={handleChange}
                required
              >
                <option value="" disabled>선택해주세요</option>
                <option value="100타 이상">100타 이상</option>
                <option value="90-99타">90-99타</option>
                <option value="80-89타">80-89타</option>
                <option value="79타 이하">79타 이하</option>
              </select>
            </div>
            {/* 성별 */}
            <div className="form-group">
              <label htmlFor="gender">성별</label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                required
              >
                <option value="" disabled>선택해주세요</option>
                <option value="male">남자</option>
                <option value="female">여자</option>
              </select>
            </div>
            {/* 가능한 일정 */}
            <div className="form-group">
              <label>가능한 일정</label>
              <button
                type="button"
                className="schedule-trigger-button"
                onClick={() => setIsPickerModalOpen(true)}
              >
                {/* --- [핵심 수정 3] JSX에서 컴포넌트 레벨의 totalSelectedDates 사용 --- */}
                <span className={totalSelectedDates >= 2 ? "selected" : ""}>
                  {totalSelectedDates > 0
                    ? `총 ${totalSelectedDates}일 선택됨`
                    : "최소 2개 이상의 가능한 날짜를 선택해주세요"}
                </span>
                <span>{totalSelectedDates >= 2 ? "✔️" : "🗓️"}</span>
              </button>
              {totalSelectedDates > 0 && (
                <div className="selection-summary-inline">
                  {selectedSchedule.map(
                    (slot) =>
                      slot.hours.length > 0 && (
                        <div key={slot.date} className="summary-item-inline">
                          <div className="summary-date-inline">
                            {formatDate(slot.date)}
                          </div>
                          <div className="summary-times-inline">
                            {slot.hours.map((hour) => (
                              <span key={hour} className="time-tag-inline">
                                {formatHour(hour)}
                              </span>
                            ))}
                          </div>
                        </div>
                      )
                  )}
                </div>
              )}
            </div>
            {/* 세부 활동 지역 */}
            <div className="form-group">
              <label htmlFor="subDistrictName">세부 활동 지역</label>
              <input
                id="subDistrictName"
                type="text"
                name="subDistrictName"
                value={formData.subDistrictName}
                onChange={handleChange}
                placeholder="ex. 서울시 양천구 목4동"
                required
              />
            </div>
            {/* 선호 플레이 */}
            <div className="form-group">
              <label htmlFor="preferredPlay">선호 플레이</label>
              <Select
                id="preferredPlay"
                isMulti
                isSearchable={false}
                name="preferredPlay"
                options={preferredPlayOptions}
                className="basic-multi-select"
                classNamePrefix="select"
                placeholder="중복 선택 가능"
                value={formData.preferredPlay}
                onChange={handlePreferredPlayChange}
              />
            </div>
            {/* 추가 요청 사항 */}
            <div className="form-group">
              <label htmlFor="requests">추가 요청 사항</label>
              <textarea
                id="requests"
                name="requests"
                value={formData.requests}
                onChange={handleChange}
                placeholder="ex. 동성끼리 플레이하고 싶어요"
                rows="3"
              ></textarea>
            </div>
            {/* 방문 경로 */}
            <div className="form-group">
              <label htmlFor="inflowPath">방문 경로</label>
              <select
                id="inflowPath"
                name="inflowPath"
                value={formData.inflowPath}
                onChange={handleChange}
                required
              >
                <option value="" disabled>어떻게 알게 되셨나요?</option>
                <option value="전단지">전단지</option>
                <option value="스크린골프장 전단지">스크린골프장 전단지</option>
                <option value="골프연습장 전단지">골프연습장 전단지</option>
                <option value="아파트 게시판">아파트 게시판</option>
                <option value="네이버 밴드">네이버 밴드</option>
                <option value="인스타그램">인스타그램</option>
                <option value="유튜브">유튜브</option>
                <option value="지인 추천">지인 추천</option>
                <option value="기타">기타</option>
              </select>
            </div>

            <button type="submit" className="next-button">
              매칭 신청하기
            </button>
          </form>
        </div>
      </div>
      <SchedulePickerModal
        isOpen={isPickerModalOpen}
        initialSelection={selectedSchedule}
        onSave={handleSaveSchedule}
        onCancel={() => setIsPickerModalOpen(false)}
      />
    </>
  );
}
export default MatchingUserInfoPage;

