'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { RevenueCard } from '@/components/RevenueCard';
import { BottomNavigation } from '@/components/BottomNavigation';
import { storage, RevenueEntry } from '@/lib/storage';
import { getThisWeekRevenue, getThisMonthRevenue, calculateAllTimeStats } from '@/lib/calculations';
import { formatCurrency, formatDate, formatDayName } from '@/lib/formatting';
import { TrendingUp, Calendar, Award, DollarSign } from 'lucide-react';

export default function ReportsPage() {
  const [revenueData, setRevenueData] = useState<RevenueEntry[]>([]);
  const [currency, setCurrency] = useState('GH₵');

  useEffect(() => {
    const data = storage.getRevenueData();
    const settings = storage.getSettings();
    setRevenueData(data);
    setCurrency(settings.currency);
  }, []);

  const weekStats = getThisWeekRevenue(revenueData);
  const monthStats = getThisMonthRevenue(revenueData);
  const allTimeStats = calculateAllTimeStats(revenueData);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black pb-20 md:pb-0">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <Header />
        
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Reports
        </h1>

        {/* This Week */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            This Week
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <RevenueCard
              title="Total Revenue"
              amount={weekStats.total}
              currency={currency}
              icon="dollar"
            />
            <RevenueCard
              title="Average Revenue"
              amount={weekStats.average}
              currency={currency}
              icon="trending"
              subtitle={`Based on ${weekStats.daysRecorded} days`}
            />
            {weekStats.bestDay && (
              <RevenueCard
                title="Best Day"
                amount={weekStats.bestDay.revenue}
                currency={currency}
                icon="award"
                subtitle={formatDayName(weekStats.bestDay.date)}
              />
            )}
            <RevenueCard
              title="Days Recorded"
              amount={weekStats.daysRecorded}
              currency={currency}
              icon="calendar"
              subtitle={`Out of 7 days`}
            />
          </div>
        </div>

        {/* This Month */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            This Month
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <RevenueCard
              title="Total Revenue"
              amount={monthStats.total}
              currency={currency}
              icon="dollar"
            />
            <RevenueCard
              title="Average Revenue"
              amount={monthStats.average}
              currency={currency}
              icon="trending"
              subtitle={`Based on ${monthStats.daysRecorded} days`}
            />
            {monthStats.bestDay && (
              <RevenueCard
                title="Best Day"
                amount={monthStats.bestDay.revenue}
                currency={currency}
                icon="award"
                subtitle={formatDate(monthStats.bestDay.date)}
              />
            )}
            {monthStats.bestWeek && (
              <RevenueCard
                title="Best Week"
                amount={monthStats.bestWeek.total}
                currency={currency}
                icon="trending"
                subtitle={`${formatDate(monthStats.bestWeek.weekStart)} - ${formatDate(monthStats.bestWeek.weekEnd)}`}
              />
            )}
            <RevenueCard
              title="Days Recorded"
              amount={monthStats.daysRecorded}
              currency={currency}
              icon="calendar"
              subtitle={`Out of ${monthStats.daysInMonth} days`}
            />
          </div>
        </div>

        {/* All Time */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            All Time
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <RevenueCard
              title="Total Revenue"
              amount={allTimeStats.total}
              currency={currency}
              icon="dollar"
            />
            <RevenueCard
              title="Total Days"
              amount={allTimeStats.totalDays}
              currency={currency}
              icon="calendar"
            />
            <RevenueCard
              title="Daily Average"
              amount={allTimeStats.average}
              currency={currency}
              icon="trending"
            />
            {allTimeStats.bestDay && (
              <RevenueCard
                title="Best Earning Day"
                amount={allTimeStats.bestDay.revenue}
                currency={currency}
                icon="award"
                subtitle={formatDate(allTimeStats.bestDay.date)}
              />
            )}
          </div>
        </div>

        {revenueData.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">
              No revenue data recorded yet. Start tracking to see reports.
            </p>
          </div>
        )}
      </div>
      
      <BottomNavigation />
    </div>
  );
}