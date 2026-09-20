'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { RevenueInput } from './RevenueInput';
import { formatCurrency, formatDate, formatDayName, formatWeekRange } from '@/lib/formatting';
import { getWeekStart, getWeekEnd, getWeekDates } from '@/lib/calculations';
import { RevenueEntry } from '@/lib/storage';

interface WeeklyRevenueProps {
  revenueData: RevenueEntry[];
  currency: string;
  onRevenueChange: (date: string, value: number) => void;
  onRevenueDelete: (date: string) => void;
}

export function WeeklyRevenue({ revenueData, currency, onRevenueChange, onRevenueDelete }: WeeklyRevenueProps) {
  const [currentWeekStart, setCurrentWeekStart] = useState(() => getWeekStart(new Date()));

  const weekDates = getWeekDates(currentWeekStart);
  const weekEnd = getWeekEnd(currentWeekStart);

  const goToPreviousWeek = () => {
    const newDate = new Date(currentWeekStart);
    newDate.setDate(newDate.getDate() - 7);
    setCurrentWeekStart(newDate);
  };

  const goToNextWeek = () => {
    const newDate = new Date(currentWeekStart);
    newDate.setDate(newDate.getDate() + 7);
    setCurrentWeekStart(newDate);
  };

  const goToCurrentWeek = () => {
    setCurrentWeekStart(getWeekStart(new Date()));
  };

  const today = new Date().toISOString().split('T')[0];

  // Calculate week totals
  const weekEntries = revenueData.filter(entry => weekDates.includes(entry.date));
  const weekTotal = weekEntries.reduce((sum, entry) => sum + entry.revenue, 0);
  const daysRecorded = weekEntries.length;
  const average = daysRecorded > 0 ? weekTotal / daysRecorded : 0;
  
  let bestDay: { date: string; revenue: number } | null = null;
  if (weekEntries.length > 0) {
    bestDay = weekEntries.reduce((best, entry) => 
      entry.revenue > best.revenue ? entry : best
    );
  }

  const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  return (
    <div className="space-y-6">
      {/* Week Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={goToPreviousWeek}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          aria-label="Previous week"
        >
          <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </button>
        
        <div className="text-center">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Weekly Revenue
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {formatWeekRange(currentWeekStart, weekEnd)}
          </p>
        </div>
        
        <button
          onClick={goToNextWeek}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          aria-label="Next week"
        >
          <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </button>
      </div>

      {/* Day Inputs */}
      <div className="grid gap-3">
        {weekDates.map((date, index) => {
          const dayName = dayNames[index];
          const formattedDate = formatDate(date);
          const entry = revenueData.find(e => e.date === date);
          const value = entry ? entry.revenue : 0;
          const isToday = date === today;

          return (
            <RevenueInput
              key={date}
              date={date}
              dayName={dayName}
              formattedDate={formattedDate}
              value={value}
              currency={currency}
              onChange={onRevenueChange}
              onDelete={onRevenueDelete}
              isToday={isToday}
            />
          );
        })}
      </div>

      {/* Week Summary */}
      <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4 space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
            Weekly Total
          </span>
          <span className="text-lg font-bold text-gray-900 dark:text-white">
            {formatCurrency(weekTotal, currency)}
          </span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
            Average Per Day
          </span>
          <span className="text-lg font-bold text-gray-900 dark:text-white">
            {formatCurrency(average, currency)}
          </span>
        </div>
        
        {bestDay && (
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Best Day
            </span>
            <span className="text-sm font-semibold text-gray-900 dark:text-white">
              {formatDayName(bestDay.date)} — {formatCurrency(bestDay.revenue, currency)}
            </span>
          </div>
        )}
        
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
            Days Recorded
          </span>
          <span className="text-sm font-semibold text-gray-900 dark:text-white">
            {daysRecorded} / 7
          </span>
        </div>
      </div>

      {/* Back to current week button */}
      {currentWeekStart.getTime() !== getWeekStart(new Date()).getTime() && (
        <button
          onClick={goToCurrentWeek}
          className="w-full py-2 text-sm text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-medium transition-colors"
        >
          Back to Current Week
        </button>
      )}
    </div>
  );
}