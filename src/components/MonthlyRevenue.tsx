'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, TrendingUp } from 'lucide-react';
import { formatCurrency, formatMonthYear, formatDate, formatWeekRange } from '@/lib/formatting';
import { calculateMonthStats, calculateWeekStats, getWeekStart, getMonthDates } from '@/lib/calculations';
import { RevenueEntry } from '@/lib/storage';

interface MonthlyRevenueProps {
  revenueData: RevenueEntry[];
  currency: string;
}

export function MonthlyRevenue({ revenueData, currency }: MonthlyRevenueProps) {
  const [currentDate, setCurrentDate] = useState(() => new Date());

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  const monthStats = calculateMonthStats(revenueData, currentYear, currentMonth);

  const goToPreviousMonth = () => {
    const newDate = new Date(currentYear, currentMonth - 1, 1);
    setCurrentDate(newDate);
  };

  const goToNextMonth = () => {
    const newDate = new Date(currentYear, currentMonth + 1, 1);
    setCurrentDate(newDate);
  };

  const goToCurrentMonth = () => {
    setCurrentDate(new Date());
  };

  const isCurrentMonth = currentYear === new Date().getFullYear() && 
                        currentMonth === new Date().getMonth();

  // Calculate weekly breakdown for the month
  const getWeeklyBreakdown = () => {
    const monthDates = getMonthDates(currentYear, currentMonth);
    const weeks: Array<{
      weekStart: Date;
      weekEnd: Date;
      total: number;
      daysRecorded: number;
    }> = [];

    // Get the first day of the month
    const firstDay = new Date(currentYear, currentMonth, 1);
    // Get the Monday of the week containing the first day
    const firstMonday = getWeekStart(firstDay);

    // Calculate all weeks in this month
    let currentWeekStart = new Date(firstMonday);
    let weekIndex = 0;

    while (true) {
      const weekEnd = new Date(currentWeekStart);
      weekEnd.setDate(weekEnd.getDate() + 6);

      // Check if this week has any days in the target month
      const hasDaysInMonth = (() => {
        for (let i = 0; i < 7; i++) {
          const checkDate = new Date(currentWeekStart);
          checkDate.setDate(checkDate.getDate() + i);
          if (checkDate.getMonth() === currentMonth && checkDate.getFullYear() === currentYear) {
            return true;
          }
        }
        return false;
      })();

      if (!hasDaysInMonth) {
        currentWeekStart.setDate(currentWeekStart.getDate() + 7);
        weekIndex++;
        continue;
      }

      const weekStats = calculateWeekStats(revenueData, currentWeekStart);
      
      weeks.push({
        weekStart: new Date(currentWeekStart),
        weekEnd: new Date(weekEnd),
        total: weekStats.total,
        daysRecorded: weekStats.daysRecorded
      });

      // Move to next week
      currentWeekStart.setDate(currentWeekStart.getDate() + 7);
      weekIndex++;

      // Stop if we've passed the end of the month
      const nextWeekStart = new Date(currentWeekStart);
      if (nextWeekStart.getMonth() > currentMonth || 
          (nextWeekStart.getMonth() === currentMonth && nextWeekStart.getDate() > 28 && weekIndex > 5)) {
        break;
      }

      // Safety break to prevent infinite loop
      if (weekIndex > 6) break;
    }

    return weeks;
  };

  const weeklyBreakdown = getWeeklyBreakdown();

  return (
    <div className="space-y-6">
      {/* Month Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={goToPreviousMonth}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          aria-label="Previous month"
        >
          <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </button>
        
        <div className="text-center">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Monthly Revenue
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {formatMonthYear(currentDate)}
          </p>
        </div>
        
        <button
          onClick={goToNextMonth}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          aria-label="Next month"
        >
          <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </button>
      </div>

      {/* Month Total Card */}
      <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-6 text-white shadow-lg">
        <p className="text-emerald-100 text-sm font-medium mb-2">
          Total Revenue
        </p>
        <p className="text-3xl font-bold mb-4">
          {formatCurrency(monthStats.total, currency)}
        </p>
        
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-emerald-400/30">
          <div>
            <p className="text-emerald-100 text-xs mb-1">Days Recorded</p>
            <p className="text-lg font-semibold">
              {monthStats.daysRecorded} / {monthStats.daysInMonth}
            </p>
          </div>
          <div>
            <p className="text-emerald-100 text-xs mb-1">Daily Average</p>
            <p className="text-lg font-semibold">
              {formatCurrency(monthStats.average, currency)}
            </p>
          </div>
        </div>
      </div>

      {/* Weekly Breakdown */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          Weekly Breakdown
        </h3>
        
        {weeklyBreakdown.length > 0 ? (
          <div className="space-y-3">
            {weeklyBreakdown.map((week, index) => (
              <div 
                key={index}
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-700"
              >
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Week {index + 1}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {formatWeekRange(week.weekStart, week.weekEnd)}
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    {week.daysRecorded} days recorded
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-gray-900 dark:text-white">
                    {formatCurrency(week.total, currency)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
            No weekly data for this month
          </p>
        )}
      </div>

      {/* Month Details */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Month Details
        </h3>
        
        {monthStats.bestDay && (
          <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Highest Earning Day
            </span>
            <span className="text-sm font-semibold text-gray-900 dark:text-white">
              {formatCurrency(monthStats.bestDay.revenue, currency)}
            </span>
          </div>
        )}
        
        {monthStats.bestWeek && (
          <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Highest Earning Week
            </span>
            <span className="text-sm font-semibold text-gray-900 dark:text-white">
              {formatCurrency(monthStats.bestWeek.total, currency)}
            </span>
          </div>
        )}
        
        <div className="flex justify-between items-center py-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Average Per Recorded Day
          </span>
          <span className="text-sm font-semibold text-gray-900 dark:text-white">
            {formatCurrency(monthStats.average, currency)}
          </span>
        </div>
      </div>

      {/* Back to current month button */}
      {!isCurrentMonth && (
        <button
          onClick={goToCurrentMonth}
          className="w-full py-2 text-sm text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-medium transition-colors"
        >
          Back to Current Month
        </button>
      )}
    </div>
  );
}