'use client';

import { TrendingUp, DollarSign, Calendar, Award } from 'lucide-react';
import { formatCurrency } from '@/lib/formatting';

interface RevenueCardProps {
  title: string;
  amount: number;
  currency: string;
  icon?: 'trending' | 'dollar' | 'calendar' | 'award';
  subtitle?: string;
}

const icons = {
  trending: TrendingUp,
  dollar: DollarSign,
  calendar: Calendar,
  award: Award
};

export function RevenueCard({ title, amount, currency, icon = 'dollar', subtitle }: RevenueCardProps) {
  const Icon = icons[icon];
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
            {title}
          </h3>
          {subtitle && (
            <p className="text-xs text-gray-500 dark:text-gray-500">
              {subtitle}
            </p>
          )}
        </div>
        <div className="p-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
          <Icon className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
        </div>
      </div>
      <p className="text-2xl font-bold text-gray-900 dark:text-white">
        {formatCurrency(amount, currency)}
      </p>
    </div>
  );
}