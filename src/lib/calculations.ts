import { RevenueEntry } from './storage';

export interface WeekStats {
  total: number;
  average: number;
  bestDay: { date: string; revenue: number } | null;
  daysRecorded: number;
  daysInWeek: number;
}

export interface MonthStats {
  total: number;
  average: number;
  bestDay: { date: string; revenue: number } | null;
  bestWeek: { weekStart: string; weekEnd: string; total: number } | null;
  daysRecorded: number;
  daysInMonth: number;
}

export interface AllTimeStats {
  total: number;
  totalDays: number;
  average: number;
  bestDay: { date: string; revenue: number } | null;
}

// Helper function to get the start of the week (Monday)
export function getWeekStart(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
  return new Date(d.setDate(diff));
}

// Helper function to get the end of the week (Sunday)
export function getWeekEnd(date: Date): Date {
  const weekStart = getWeekStart(date);
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 6);
  return weekEnd;
}

// Helper function to get all dates in a week
export function getWeekDates(startDate: Date): string[] {
  const dates: string[] = [];
  const current = new Date(startDate);
  
  for (let i = 0; i < 7; i++) {
    dates.push(current.toISOString().split('T')[0]);
    current.setDate(current.getDate() + 1);
  }
  
  return dates;
}

// Helper function to get all dates in a month
export function getMonthDates(year: number, month: number): string[] {
  const dates: string[] = [];
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    dates.push(date.toISOString().split('T')[0]);
  }
  
  return dates;
}

// Calculate statistics for a specific week
export function calculateWeekStats(
  revenueData: RevenueEntry[],
  weekStart: Date
): WeekStats {
  const weekDates = getWeekDates(weekStart);
  const weekEntries = revenueData.filter(entry => 
    weekDates.includes(entry.date)
  );
  
  const total = weekEntries.reduce((sum, entry) => sum + entry.revenue, 0);
  const daysRecorded = weekEntries.length;
  const average = daysRecorded > 0 ? total / daysRecorded : 0;
  
  let bestDay: { date: string; revenue: number } | null = null;
  if (weekEntries.length > 0) {
    bestDay = weekEntries.reduce((best, entry) => 
      entry.revenue > best.revenue ? entry : best
    );
  }
  
  return {
    total,
    average,
    bestDay,
    daysRecorded,
    daysInWeek: 7
  };
}

// Calculate statistics for a specific month
export function calculateMonthStats(
  revenueData: RevenueEntry[],
  year: number,
  month: number
): MonthStats {
  const monthDates = getMonthDates(year, month);
  const monthEntries = revenueData.filter(entry => 
    monthDates.includes(entry.date)
  );
  
  const total = monthEntries.reduce((sum, entry) => sum + entry.revenue, 0);
  const daysRecorded = monthEntries.length;
  const average = daysRecorded > 0 ? total / daysRecorded : 0;
  
  let bestDay: { date: string; revenue: number } | null = null;
  if (monthEntries.length > 0) {
    bestDay = monthEntries.reduce((best, entry) => 
      entry.revenue > best.revenue ? entry : best
    );
  }
  
  // Calculate best week
  let bestWeek: { weekStart: string; weekEnd: string; total: number } | null = null;
  const weeksInMonth = Math.ceil(monthDates.length / 7);
  
  for (let week = 0; week < weeksInMonth; week++) {
    const weekStartDate = new Date(year, month, week * 7 + 1);
    const weekStats = calculateWeekStats(revenueData, weekStartDate);
    
    if (weekStats.total > 0 && (!bestWeek || weekStats.total > bestWeek.total)) {
      const weekEndDate = new Date(weekStartDate);
      weekEndDate.setDate(weekEndDate.getDate() + 6);
      
      bestWeek = {
        weekStart: weekStartDate.toISOString().split('T')[0],
        weekEnd: weekEndDate.toISOString().split('T')[0],
        total: weekStats.total
      };
    }
  }
  
  return {
    total,
    average,
    bestDay,
    bestWeek,
    daysRecorded,
    daysInMonth: monthDates.length
  };
}

// Calculate all-time statistics
export function calculateAllTimeStats(revenueData: RevenueEntry[]): AllTimeStats {
  if (revenueData.length === 0) {
    return {
      total: 0,
      totalDays: 0,
      average: 0,
      bestDay: null
    };
  }
  
  const total = revenueData.reduce((sum, entry) => sum + entry.revenue, 0);
  const totalDays = revenueData.length;
  const average = total / totalDays;
  
  const bestDay = revenueData.reduce((best, entry) => 
    entry.revenue > best.revenue ? entry : best
  );
  
  return {
    total,
    totalDays,
    average,
    bestDay
  };
}

// Get today's revenue
export function getTodayRevenue(revenueData: RevenueEntry[]): number {
  const today = new Date().toISOString().split('T')[0];
  const entry = revenueData.find(entry => entry.date === today);
  return entry ? entry.revenue : 0;
}

// Get this week's revenue
export function getThisWeekRevenue(revenueData: RevenueEntry[]): WeekStats {
  const today = new Date();
  const weekStart = getWeekStart(today);
  return calculateWeekStats(revenueData, weekStart);
}

// Get this month's revenue
export function getThisMonthRevenue(revenueData: RevenueEntry[]): MonthStats {
  const today = new Date();
  return calculateMonthStats(revenueData, today.getFullYear(), today.getMonth());
}