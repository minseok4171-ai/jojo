
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { WeeklyTestInfo } from '../types';

interface TrendChartProps {
  data: WeeklyTestInfo[];
}

const TrendChart: React.FC<TrendChartProps> = ({ data }) => {
  const chartData = data.map(d => ({
    name: `${d.week}주`,
    score: d.score || 0,
    completion: d.completion || 0,
  }));

  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#6b7280', fontSize: 12, fontWeight: 700 }}
            dy={10}
          />
          <YAxis 
            domain={[0, 100]} 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#9ca3af', fontSize: 10 }}
          />
          <Tooltip 
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
          />
          <Legend 
            verticalAlign="top" 
            align="right"
            height={40}
            iconType="circle"
            wrapperStyle={{ fontSize: '12px', fontWeight: 600, paddingBottom: '20px' }}
          />
          <Line 
            name="평가점수" 
            type="monotone" 
            dataKey="score" 
            stroke="#3b82f6" 
            strokeWidth={4}
            dot={{ r: 6, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff' }}
            activeDot={{ r: 8, strokeWidth: 0 }} 
          />
          <Line 
            name="과제달성률" 
            type="monotone" 
            dataKey="completion" 
            stroke="#ef4444" 
            strokeWidth={4}
            dot={{ r: 6, fill: '#ef4444', strokeWidth: 2, stroke: '#fff' }}
            activeDot={{ r: 8, strokeWidth: 0 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TrendChart;
