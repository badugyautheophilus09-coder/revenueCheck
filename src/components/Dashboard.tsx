'use client';

import { useState, useEffect } from 'react';
import { Header } from './Header';
import { RevenueCard } from './RevenueCard';
import { WeeklyRevenue } from './WeeklyRevenue';
import { MonthlyRevenue } from './MonthlyRevenue';
import { RevenueChart } from './RevenueChart';
import { Toast } from './Toast';
import { storage, RevenueEntry } from '@/lib/storage';
import { getTodayRevenue, getThisWeekRevenue, getThisMonthRevenue, getWeekDates, getWeekStart } from '@/lib/calculations';
import { formatShortDayName } from '@/lib/formatting';

export function Dashboard() {
  const [revenueData, setRevenueData] = useState<RevenueEntry[]>([]);
  const [currency, setCurrency] = useState('GH₵');
  const [toast, setToast] = useState<{ message: string; visible: boolean }>({ message: '', visible: false });

  useEffect(() => {
    // Load data from localStorage
    const data = storage.getRevenueData();
    const settings = storage.getSettings();
    setRevenueData(data);
    setCurrency(settings.currency);
  }, []);

  const handleRevenueChange = (date: string, value: number) => {
    const newData = [...revenueData];
    const existingIndex = newData.findIndex(entry => entry.date === date);
    
    if (existingIndex >= 0) {
      if (value > 0) {
        newData[existingIndex] = { date, revenue: value };
      } else {
        newData.splice(existingIndex, 1);
      }
    } else if (value > 0) {
      newData.push({ date, revenue: value });
    }
    
    setRevenueData(newData);
    storage.saveRevenueData(newData);
    
    // Show toast notification
    setToast({ message: 'Revenue updated.', visible: true });
  };

  const handleRevenueDelete = (date: string) => {
    const newData = revenueData.filter(entry => entry.date !== date);
    setRevenueData(newData);
    storage.saveRevenueData(newData);
    setToast({ message: 'Revenue deleted.', visible: true });
  };

  const closeToast = () => {
    setToast({ message: '', visible: false });
  };

  // Calculate statistics
  const todayRevenue = getTodayRevenue(revenueData);
  const weekStats = getThisWeekRevenue(revenueData);
  const monthStats = getThisMonthRevenue(revenueData);
  const hasData = revenueData.length > 0;

  // Prepare chart data
  const currentWeekStart = getWeekStart(new Date());
  const weekDates = getWeekDates(currentWeekStart);
  const chartData = weekDates.map(date => {
    const entry = revenueData.find(e => e.date === date);
    return {
      day: formatShortDayName(date),
      revenue: entry ? entry.revenue : 0
    };
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black pb-20 md:pb-0">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <Header />
        
        {/* Always show dashboard */}
        <>
          {/* Dashboard Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <RevenueCard
              title="Today's Revenue"
              amount={todayRevenue}
              currency={currency}
              icon="calendar"
            />
            <RevenueCard
              title="This Week"
              amount={weekStats.total}
              currency={currency}
              icon="trending"
            />
            <RevenueCard
              title="This Month"
              amount={monthStats.total}
              currency={currency}
              icon="dollar"
            />
            <RevenueCard
              title="Daily Average"
              amount={weekStats.average}
              currency={currency}
              icon="award"
              subtitle={`Based on ${weekStats.daysRecorded} days`}
            />
          </div>

          {/* Chart */}
          <div className="mb-8">
            <RevenueChart data={chartData} currency={currency} />
          </div>

          {/* Weekly Revenue */}
          <div className="mb-8">
            <WeeklyRevenue
              revenueData={revenueData}
              currency={currency}
              onRevenueChange={handleRevenueChange}
              onRevenueDelete={handleRevenueDelete}
            />
          </div>

          {/* Monthly Revenue */}
          <div>
            <MonthlyRevenue
              revenueData={revenueData}
              currency={currency}
            />
          </div>
        </>
      </div>

      {/* Toast Notification */}
      {toast.visible && (
        <Toast
          message={toast.message}
          onClose={closeToast}
        />
      )}
    </div>
  );
}