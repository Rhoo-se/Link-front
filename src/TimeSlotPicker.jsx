import React, { useState, useEffect, useMemo } from 'react';
import './TimeSlotPicker.css'; // 👈 CSS import

// 시간 블록 정의
const timeBlocks = [
  { start: 10, end: 13, label: `${String(10).padStart(2, '0')}:00 ~ ${String(13).padStart(2, '0')}:00` },
  { start: 13, end: 17, label: `${String(13).padStart(2, '0')}:00 ~ ${String(17).padStart(2, '0')}:00` },
  { start: 18, end: 21, label: `${String(18).padStart(2, '0')}:00 ~ ${String(21).padStart(2, '0')}:00` },
];

export function TimeSlotPicker({ initialSelection, onSave, onCancel }) {
  const [selections, setSelections] = useState([]);

  // 날짜를 YYYY-MM-DD 형식으로 변환
  const getLocalDateString = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // [핵심 수정 1] : 첫 번째 선택 가능 날짜 (Min Date) 정의
  // 11월 23일까지 선택 불가 => 11월 24일부터 선택 가능
  const firstSelectableDate = useMemo(() => {
    // 월은 0부터 시작 (10 = 11월)
    // (참고) 현재 날짜가 2025년 11월 17일이므로 2025년으로 설정합니다.
    const minDate = new Date(2025, 10, 24); // 2025년 11월 24일
    minDate.setHours(0, 0, 0, 0);

    // 만약 오늘 날짜가 11월 24일보다 더 미래라면, 오늘 날짜를 min으로 사용
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return minDate < today ? today : minDate;
  }, []); // 컴포넌트 마운트 시 한 번만 계산

  // [핵심 수정 2] : input의 min 속성에 사용할 날짜 문자열
  const minDateString = useMemo(() => getLocalDateString(firstSelectableDate), [firstSelectableDate, getLocalDateString]);


  // [핵심 1: 요일 계산 수정] 날짜 문자열을 받아 한국 시간 기준 "(요일)" 문자열로 변환
  const formatDayOfWeek = (dateString) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString + 'T00:00:00'); 
      if (isNaN(date)) return ""; 

      const days = ['일', '월', '화', '수', '목', '금', '토'];
      return `(${days[date.getDay()]})`;
    } catch (e) {
      console.error("Error formatting day of week:", e);
      return ""; 
    }
  };


  useEffect(() => {
    const validInitialSelection = Array.isArray(initialSelection)
      ? initialSelection.filter(s => s && s.date && Array.isArray(s.hours)) : [];
    setSelections(validInitialSelection);
  }, [initialSelection]);

  const totalSelectedDates = useMemo(() => {
     return selections.filter(day => day.hours.length > 0).length;
  }, [selections]);

  // const totalSelectedBlocks = useMemo(() => {
  //   return selections.reduce((total, day) => total + day.hours.length, 0);
  // }, [selections]);

   // [핵심 수정 3] handleAddDate 수정
   const handleAddDate = () => {
    let newDate;
    
    // 'today' 대신 'firstSelectableDate'를 기준으로 로직 수행
    if (selections.length > 0) {
      const lastDateStr = selections[selections.length - 1].date;
      const [year, month, day] = lastDateStr.split('-').map(Number);
      const lastDate = new Date(year, month - 1, day);
      lastDate.setDate(lastDate.getDate() + 1);
      newDate = lastDate;
    } else {
      newDate = firstSelectableDate; // 'today' 대신 'firstSelectableDate'
    }

     // 'firstSelectableDate' 이전 날짜는 'firstSelectableDate'로 설정
    if (newDate < firstSelectableDate) {
      newDate = firstSelectableDate;
    }

    const newDateString = getLocalDateString(newDate);

    if (selections.some(s => s.date === newDateString)) {
      alert('더 이상 추가할 날짜가 없거나, 날짜를 수동으로 변경해주세요.');
      return;
    }
    setSelections([...selections, { date: newDateString, hours: [] }]);
  };

  // [핵심 수정 4] handleDateChange 수정
  const handleDateChange = (index, newDateValue) => {
    const selectedDate = new Date(newDateValue + 'T00:00:00'); // 로컬 시간 기준

    // 'today' 대신 'firstSelectableDate'로 유효성 검사
    if (selectedDate < firstSelectableDate) {
        // 알림 메시지도 구체적으로 변경
        alert(`11월 24일 또는 그 이후의 날짜만 선택 가능합니다.`);
        // 입력값 되돌리기 (현재 값 유지)
        const inputElement = document.querySelectorAll('.date-input-button')[index];
        if (inputElement) inputElement.value = selections[index].date;
        return;
    }

    if (selections.some((s, i) => i !== index && s.date === newDateValue)) {
      alert('이미 선택된 날짜입니다. 다른 날짜를 선택해주세요.');
       // 입력값 되돌리기 (현재 값 유지)
       const inputElement = document.querySelectorAll('.date-input-button')[index];
       if (inputElement) inputElement.value = selections[index].date;
      return;
    }
    const updatedSelections = [...selections];
    updatedSelections[index].date = newDateValue;
    setSelections(updatedSelections);
  };

  const handleRemoveDate = (index) => {
    setSelections(selections.filter((_, i) => i !== index));
  };

  const toggleTimeBlock = (dateIndex, blockStartHour) => {
    const updatedSelections = [...selections];
    const currentHours = updatedSelections[dateIndex].hours;
    const newHours = currentHours.includes(blockStartHour)
      ? currentHours.filter(h => h !== blockStartHour)
      : [...currentHours, blockStartHour].sort((a, b) => a - b);
    updatedSelections[dateIndex].hours = newHours;
    setSelections(updatedSelections);
  };

  // [핵심 수정 5] : 이 라인을 삭제!
  // const todayString = getLocalDateString(new Date());

  return (
    <div className="time-slot-picker-content">
      <div className="time-picker-header">
        <h3>가능한 일정 선택</h3>
        <p className="subtitle">
          <span><strong>최소 2개 이상의 날짜</strong>을 선택해야 완료할 수 있습니다.</span>
          <span>원하시는 날짜와 시간대를 모두 선택해주세요.</span>
        </p>
      </div>
      <div className="time-picker-body">
        {selections.map((selection, index) => (
          <div key={index} className="date-selection-group">
            <div className="date-input-header">
              <div className="date-input-wrapper">
                <input
                  type="date"
                  className="date-input-button"
                  value={selection.date}
                  // [핵심 수정 6] : min 속성 변경
                  min={minDateString}
                  onChange={(e) => handleDateChange(index, e.target.value)}
                />
                {/* 수정된 함수 사용 */}
                <span className="date-day-label">{formatDayOfWeek(selection.date)}</span>
              </div>
              <button onClick={() => handleRemoveDate(index)} className="button-danger">삭제</button>
            </div>
            <div className="time-grid time-block-grid">
              {timeBlocks.map(block => (
                <button
                  key={block.start}
                  type="button"
                  className={`time-slot-button time-block-button ${selection.hours.includes(block.start) ? 'selected' : ''}`}
                  onClick={() => toggleTimeBlock(index, block.start)}
                >
                  {block.label}
                </button>
              ))}
            </div>
          </div>
        ))}
        <button onClick={handleAddDate} className="add-date-button">
          + 날짜 추가하기
        </button>
      </div>
      <div className="picker-footer">
        <div className="selection-counter">
          {totalSelectedDates === 0 ? (
            <>
              최소 2개의 날짜를 선택해주세요.
              <br />
              <span style={{ fontSize: '0.8em', color: '#888' }}>
                ex. 11월 24일 10:00 ~ 13:00, 11월 25일 18:00 ~ 21:00
              </span>
            </>
          ) : totalSelectedDates === 1 ? (
             '가능한 날짜를 하나 더 골라주세요'
          ) : (
            '선택완료 버튼을 눌러주세요.'
          )}
        </div>
        <div className="footer-buttons">
          <button type="button" onClick={onCancel} className="button button-secondary">취소</button>
          <button
            type="button"
            onClick={() => onSave(selections)}
            className="button"
            disabled={totalSelectedDates < 2}
          >
            선택 완료
          </button>
        </div>
      </div>
    </div>
  );
}




// import React, { useState, useEffect, useMemo } from 'react';
// import './TimeSlotPicker.css'; // 👈 CSS import

// // 시간 블록 정의
// const timeBlocks = [
//   { start: 10, end: 13, label: `${String(10).padStart(2, '0')}:00 ~ ${String(13).padStart(2, '0')}:00` },
//   { start: 13, end: 17, label: `${String(13).padStart(2, '0')}:00 ~ ${String(17).padStart(2, '0')}:00` },
//   { start: 18, end: 21, label: `${String(18).padStart(2, '0')}:00 ~ ${String(21).padStart(2, '0')}:00` },
// ];

// export function TimeSlotPicker({ initialSelection, onSave, onCancel }) {
//   const [selections, setSelections] = useState([]);

//   // 날짜를 YYYY-MM-DD 형식으로 변환
//   const getLocalDateString = (date) => {
//     // KST 기준으로 날짜 문자열 생성 (옵션)
//     const year = date.getFullYear();
//     const month = String(date.getMonth() + 1).padStart(2, '0');
//     const day = String(date.getDate()).padStart(2, '0');
//     return `${year}-${month}-${day}`;
//   };

//   // [핵심 1: 요일 계산 수정] 날짜 문자열을 받아 한국 시간 기준 "(요일)" 문자열로 변환
//   const formatDayOfWeek = (dateString) => {
//     if (!dateString) return "";
//     try {
//       // YYYY-MM-DD 문자열은 로컬 시간대로 해석되도록 new Date() 사용
//       // 시간 정보를 추가하지 않아 시간대 오프셋 영향 최소화
//       const date = new Date(dateString + 'T00:00:00'); // 시간 정보 명시적 추가 (로컬 시간 기준)
//       if (isNaN(date)) return ""; // 유효하지 않은 날짜 처리

//       const days = ['일', '월', '화', '수', '목', '금', '토'];
//       // 로컬 시간대의 요일을 가져옵니다.
//       return `(${days[date.getDay()]})`;
//     } catch (e) {
//       console.error("Error formatting day of week:", e);
//       return ""; // 에러 발생 시 빈 문자열 반환
//     }
//   };


//   useEffect(() => {
//     const validInitialSelection = Array.isArray(initialSelection)
//       ? initialSelection.filter(s => s && s.date && Array.isArray(s.hours)) : [];
//     setSelections(validInitialSelection);
//   }, [initialSelection]);

//   const totalSelectedDates = useMemo(() => {
//      return selections.filter(day => day.hours.length > 0).length;
//   }, [selections]);

//   // const totalSelectedBlocks = useMemo(() => {
//   //   return selections.reduce((total, day) => total + day.hours.length, 0);
//   // }, [selections]);

//    const handleAddDate = () => {
//     let newDate;
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);

//     if (selections.length > 0) {
//       const lastDateStr = selections[selections.length - 1].date;
//       const [year, month, day] = lastDateStr.split('-').map(Number);
//       // 로컬 시간 기준으로 다음 날 계산
//       const lastDate = new Date(year, month - 1, day);
//       lastDate.setDate(lastDate.getDate() + 1);
//       newDate = lastDate;
//     } else {
//       newDate = today;
//     }

//      // 오늘 이전 날짜는 오늘로 설정 (로컬 시간 기준)
//     if (newDate < today) {
//       newDate = today;
//     }

//     const newDateString = getLocalDateString(newDate);

//     if (selections.some(s => s.date === newDateString)) {
//       alert('더 이상 추가할 날짜가 없거나, 날짜를 수동으로 변경해주세요.');
//       return;
//     }
//     setSelections([...selections, { date: newDateString, hours: [] }]);
//   };

//   const handleDateChange = (index, newDateValue) => {
//     const selectedDate = new Date(newDateValue + 'T00:00:00'); // 로컬 시간 기준
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);

//     if (selectedDate < today) {
//         alert('오늘 또는 미래의 날짜만 선택 가능합니다.');
//         // 입력값 되돌리기 (현재 값 유지)
//         const inputElement = document.querySelectorAll('.date-input-button')[index];
//         if (inputElement) inputElement.value = selections[index].date;
//         return;
//     }

//     if (selections.some((s, i) => i !== index && s.date === newDateValue)) {
//       alert('이미 선택된 날짜입니다. 다른 날짜를 선택해주세요.');
//        // 입력값 되돌리기 (현재 값 유지)
//        const inputElement = document.querySelectorAll('.date-input-button')[index];
//        if (inputElement) inputElement.value = selections[index].date;
//       return;
//     }
//     const updatedSelections = [...selections];
//     updatedSelections[index].date = newDateValue;
//     setSelections(updatedSelections);
//   };

//   const handleRemoveDate = (index) => {
//     setSelections(selections.filter((_, i) => i !== index));
//   };

//   const toggleTimeBlock = (dateIndex, blockStartHour) => {
//     const updatedSelections = [...selections];
//     const currentHours = updatedSelections[dateIndex].hours;
//     const newHours = currentHours.includes(blockStartHour)
//       ? currentHours.filter(h => h !== blockStartHour)
//       : [...currentHours, blockStartHour].sort((a, b) => a - b);
//     updatedSelections[dateIndex].hours = newHours;
//     setSelections(updatedSelections);
//   };

//   const todayString = getLocalDateString(new Date());

//   return (
//     <div className="time-slot-picker-content">
//       <div className="time-picker-header">
//         <h3>가능한 일정 선택</h3>
//         <p className="subtitle">
//           <span><strong>최소 2개 이상의 날짜</strong>을 선택해야 완료할 수 있습니다.</span>
//           <span>원하시는 날짜와 시간대를 모두 선택해주세요.</span>
//         </p>
//       </div>
//       <div className="time-picker-body">
//         {selections.map((selection, index) => (
//           <div key={index} className="date-selection-group">
//             <div className="date-input-header">
//               <div className="date-input-wrapper">
//                 <input
//                   type="date"
//                   className="date-input-button"
//                   value={selection.date}
//                   min={todayString}
//                   onChange={(e) => handleDateChange(index, e.target.value)}
//                 />
//                 {/* 수정된 함수 사용 */}
//                 <span className="date-day-label">{formatDayOfWeek(selection.date)}</span>
//               </div>
//               <button onClick={() => handleRemoveDate(index)} className="button-danger">삭제</button>
//             </div>
//             <div className="time-grid time-block-grid">
//               {timeBlocks.map(block => (
//                 <button
//                   key={block.start}
//                   type="button"
//                   className={`time-slot-button time-block-button ${selection.hours.includes(block.start) ? 'selected' : ''}`}
//                   onClick={() => toggleTimeBlock(index, block.start)}
//                 >
//                   {block.label}
//                 </button>
//               ))}
//             </div>
//           </div>
//         ))}
//         <button onClick={handleAddDate} className="add-date-button">
//           + 날짜 추가하기
//         </button>
//       </div>
//       <div className="picker-footer">
//         <div className="selection-counter">
//           {totalSelectedDates === 0 ? (
//             <>
//               최소 2개의 날짜를 선택해주세요.
//               <br />
//               <span style={{ fontSize: '0.8em', color: '#888' }}>
//                 ex. 11월 2일 10:00 ~ 13:00, 11월 5일 18:00 ~ 21:00
//               </span>
//             </>
//           ) : totalSelectedDates === 1 ? (
//              '가능한 날짜를 하나 더 골라주세요'
//           ) : (
//             '선택완료 버튼을 눌러주세요.'
//           )}
//         </div>
//         <div className="footer-buttons">
//           <button type="button" onClick={onCancel} className="button button-secondary">취소</button>
//           <button
//             type="button"
//             onClick={() => onSave(selections)}
//             className="button"
//             disabled={totalSelectedDates < 2}
//           >
//             선택 완료
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

