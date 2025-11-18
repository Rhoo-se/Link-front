import React from "react";
import { Button } from "./ui/button";
import { Calendar, Check } from "lucide-react";

export function GolfMatchingForm({
  onScheduleSelect,
  hasSelectedSchedule,
}) {
  return (
    <div className="h-full bg-background overflow-hidden">
      {/* Status Bar Spacer for iOS */}
      <div className="safe-area-top" />

      <div className="h-full overflow-y-auto safe-area-left safe-area-right">
        <div className="px-4 py-6 space-y-6 safe-area-bottom">
          {/* 헤더 - GolfLink 로고 */}
          <div className="text-center py-4">
            <div className="flex items-center justify-center gap-2">
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                <div className="w-3 h-3 bg-white rounded-full"></div>
              </div>
              <h1 className="text-xl font-medium text-blue-600">
                GolfLink
              </h1>
            </div>
          </div>

          {/* 가능한 일정 선택 */}
          <div className="bg-white rounded-xl p-6 shadow-sm mx-2">
            <div className="space-y-3">
              <label className="text-sm text-gray-600">
                가능한 일정
              </label>
              <Button
                variant="outline"
                className="w-full h-12 justify-between bg-gray-50 border-gray-200 hover:bg-gray-100"
                onClick={onScheduleSelect}
              >
                <span
                  className={
                    hasSelectedSchedule
                      ? "text-blue-600 font-medium"
                      : "text-gray-500"
                  }
                >
                  {hasSelectedSchedule ? "선택 됨" : "선택하기"}
                </span>
                {hasSelectedSchedule ? (
                  <Check className="w-4 h-4 text-blue-600" />
                ) : (
                  <Calendar className="w-4 h-4 text-gray-400" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}