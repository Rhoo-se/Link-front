// src/mockData.js

export const mockRegions = [
  { id: 1, name: '서울특별시' },
  { id: 2, name: '경기도' },
];

export const mockGolfCourses = [
  { id: 101, regionId: 1, name: '당산 탑 골프장' },
  { id: 102, regionId: 1, name: '여의도 스크린 골프' },
  { id: 201, regionId: 2, name: '판교 PGA 골프' },
];

export const mockReservations = [
  { id: 1, courseId: 101, date: '2025-09-25', time: '10:00~11:00', userName: '홍길동', status: 'booked' },
  { id: 2, courseId: 101, date: '2025-09-25', time: '10:15~11:15', userName: '김철수', status: 'booked' },
  { id: 3, courseId: 101, date: '2025-09-25', time: '10:30~11:30', userName: null, status: 'available' },
  { id: 4, courseId: 101, date: '2025-09-25', time: '11:20~12:20', userName: null, status: 'blocked' },
  { id: 5, courseId: 101, date: '2025-09-25', time: '11:40~12:40', userName: null, status: 'available' },
  { id: 6, courseId: 101, date: '2025-09-26', time: '12:00~13:00', userName: '이영희', status: 'booked' },
];