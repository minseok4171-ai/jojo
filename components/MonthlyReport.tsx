import React from 'react';
import { ReportState } from '../types.ts';
import TrendChart from './TrendChart.tsx';

interface MonthlyReportProps {
  state: ReportState;
  onCommentChange: (val: string) => void;
  onAcademyNameChange: (val: string) => void;
  onGenerateAI: () => Promise<void>;
  isGeneratingAI: boolean;
}

const MonthlyReport: React.FC<MonthlyReportProps> = ({ 
  state, 
  onCommentChange, 
  onAcademyNameChange, 
  onGenerateAI,
  isGeneratingAI
}) => {
  return (
    <div id="monthly-report-capture" className="print-area bg-white border-2 border-gray-800 shadow-xl p-10 max-w-2xl mx-auto min-h-[842px] flex flex-col box-border overflow-hidden">
      {/* Header Section - Enhanced Rigid Layout for Capture */}
      <div className="border-b-4 border-gray-800 pb-6 mb-8 flex items-center h-28">
        {/* Left Side (Spacer) */}
        <div className="w-24 shrink-0"></div>
        
        {/* Middle Area (Title) */}
        <div className="flex-1 flex flex-col items-center justify-center text-center">
          <div className="w-full flex justify-center items-center mb-1">
            <input
              type="text"
              className="w-full text-2xl font-black text-gray-900 border-none outline-none bg-transparent text-center placeholder-gray-300 p-0 m-0 leading-tight"
              value={state.academyName}
              onChange={(e) => onAcademyNameChange(e.target.value)}
              placeholder="학원 이름을 입력하세요"
            />
          </div>
          <div className="text-xl font-bold text-gray-700 tracking-tight leading-none whitespace-nowrap">
            {state.month} 월간학습평가서
          </div>
        </div>
        
        {/* Right Side (Logo) */}
        <div className="w-24 flex flex-col items-end shrink-0 border-l-2 border-gray-200 pl-4 justify-center h-full">
          <div className="text-[#F97316] font-black text-2xl leading-none italic tracking-tighter">WAWA</div>
          <div className="text-[7px] font-extrabold text-gray-500 leading-tight text-right tracking-tighter mt-1 uppercase">
            와와학습코칭센터<br/>
            <span className="text-gray-400">COACHING CENTER</span>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-grow">
        {/* Student Info */}
        <div className="mb-6">
          <table className="w-full border-collapse border-2 border-gray-800 text-sm table-fixed">
            <tbody>
              <tr>
                <td className="bg-gray-100 w-1/4 p-3 text-center font-bold border-2 border-gray-800 text-gray-700">학교 / 학년 / 이름</td>
                <td className="p-3 text-center border-2 border-gray-800 bg-[#FFF4E5] font-bold text-lg text-gray-900">
                  {state.student.school} {state.student.grade} {state.student.name}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Summary Table */}
        <div className="mb-6">
          <table className="w-full border-collapse border-2 border-gray-800 text-xs table-fixed">
            <thead>
              <tr className="bg-[#FFF4E5]">
                <th className="border-2 border-gray-800 p-2 w-14 text-gray-700">주차</th>
                <th className="border-2 border-gray-800 p-2 text-gray-700">평가내용</th>
                <th className="border-2 border-gray-800 p-2 w-16 text-gray-700">점수</th>
                <th className="border-2 border-gray-800 p-2 w-14 text-gray-700">결과</th>
                <th className="border-2 border-gray-800 p-2 w-16 text-gray-700">달성률</th>
                <th className="border-2 border-gray-800 p-2 w-16 text-gray-700">추가학습</th>
              </tr>
            </thead>
            <tbody>
              {state.weeklyData.map((week) => (
                <tr key={week.week} className="text-center h-12">
                  <td className="border-2 border-gray-800 p-2 font-bold bg-gray-50">{week.week}주</td>
                  {/* Increased font size to text-sm and font-bold for better visibility */}
                  <td className="border-2 border-gray-800 p-2 bg-pink-50/20 text-center font-bold text-sm truncate">{week.content}</td>
                  <td className="border-2 border-gray-800 p-2 text-red-600 font-black text-sm">{week.score || '-'}</td>
                  <td className="border-2 border-gray-800 p-2 font-bold uppercase">{week.result}</td>
                  <td className="border-2 border-gray-800 p-2 font-black text-blue-600">{week.completion ? `${week.completion}%` : '-'}</td>
                  <td className="border-2 border-gray-800 p-2">
                    <div className="flex justify-center">
                      <div className={`w-4 h-4 border-2 border-gray-300 rounded flex items-center justify-center ${week.additionalPlan ? 'bg-green-500 border-green-600' : 'bg-white'}`}>
                        {week.additionalPlan && <span className="text-white text-[8px]">✓</span>}
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Chart Section */}
        <div className="bg-white border-2 border-gray-800 mb-6 overflow-hidden">
          <div className="bg-[#FFC000] text-center text-[10px] font-black py-1.5 border-b-2 border-gray-800 text-gray-900 uppercase">
            {state.month} 학습 성취도 분석 그래프
          </div>
          <div className="p-4 bg-white">
            <TrendChart data={state.weeklyData} />
          </div>
        </div>

        {/* Coaching Comment */}
        <div className="border-2 border-gray-800 flex flex-col relative">
          <div className="bg-[#FFC000] flex justify-between items-center px-4 py-2 border-b-2 border-gray-800">
            <div className="w-16"></div>
            <span className="text-xs font-black text-gray-900 text-center uppercase tracking-tight">종합 코칭 코멘트</span>
            <div className="w-16 flex justify-end">
                <button 
                  onClick={onGenerateAI}
                  disabled={isGeneratingAI}
                  className="no-print flex items-center gap-1 bg-indigo-600 hover:bg-indigo-700 text-white text-[9px] font-bold py-1 px-2 rounded transition-all shadow-sm active:scale-95 disabled:opacity-50 whitespace-nowrap"
                >
                  {isGeneratingAI ? 'AI...' : 'AI 자동'}
                </button>
            </div>
          </div>
          <div className="p-6 bg-blue-50/20">
            <textarea
              className="w-full min-h-[160px] text-sm text-blue-800 font-medium leading-relaxed text-center outline-none resize-none bg-transparent placeholder:text-blue-200 border-none p-0"
              placeholder="학생의 이번 달 학습 태도와 향후 계획에 대한 코멘트를 작성해 주세요."
              value={state.coachingComment}
              onChange={(e) => onCommentChange(e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MonthlyReport;