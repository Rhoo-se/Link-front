import React from 'react';
import { TimeSlotPicker } from './TimeSlotPicker';
import './SchedulePickerModal.css'; // 👈 새로운 CSS 파일 import

function SchedulePickerModal({ isOpen, initialSelection, onSave, onCancel }) {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <TimeSlotPicker
          initialSelection={initialSelection}
          onSave={onSave}
          onCancel={onCancel}
        />
      </div>
    </div>
  );
}
export default SchedulePickerModal;