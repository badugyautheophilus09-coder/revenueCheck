'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface RevenueChartProps {
  data: Array<{
    day: string;
    revenue: number;
  }>;
  currency: string;
}

export function RevenueChart({ data, currency }: RevenueChartProps) {
  const maxValue = Math.max(...data.map(d => d.revenue), 1);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
        Weekly Revenue
      </h3>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" className="dark:stroke-gray-700" />
            <XAxis 
              dataKey="day" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#6b7280', fontSize: 12 }}
              dy={10}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#6b7280', fontSize: 12 }}
              tickFormatter={(value: number | undefined) => `${currency}${value || 0}`}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1f2937', 
                border: 'none', 
                borderRadius: '8px',
                color: '#fff'
              }}
              formatter={(value: number | undefined) => [`${currency} ${value?.toFixed(2) || '0.00'}`, 'Revenue']}
            />
            <Bar 
              dataKey="revenue" 
              radius={[4, 4, 0, 0]}
              className="fill-emerald-500"
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.revenue > 0 ? '#10b981' : '#e5e7eb'}
                  className="dark:fill-emerald-600"
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}