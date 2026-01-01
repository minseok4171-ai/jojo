import React from 'react';
import { WeeklyTestInfo, StudentBasicInfo } from '../types.ts';

interface WeeklyFormProps {
  data: WeeklyTestInfo;
  student: StudentBasicInfo;
  onChange: (week: number, field: keyof WeeklyTestInfo, value: any) => void;
  onStudentChange: (field: keyof StudentBasicInfo, value: string) => void;
  isFirst?: boolean;
}

const WeeklyForm: React.FC<WeeklyFormProps> = ({ data, student, onChange, onStudentChange, isFirst }) => {
  return (
    <div className="mb-8 bg-white border-2 border-gray-800 shadow-sm overflow-hidden">
      <div className="bg-[#FFC000] p-2 text-center font-bold border-b-2 border-gray-800 flex justify-between px-4">
        <span>주간학습평가서</span>
        <span>{data.week}주차</span>
      </div>
      <table className="w-full text-sm">
        <tbody>
          <tr className="border-b border-gray-300">
            <td className="w-1/3 bg-gray-100 p-2 text-center font-semibold border-r border-gray-300">학교/학년/이름</td>
            <td className="p-0">
              <input
                type="text"
                className="w-full p-2 bg-[#FDE9D9] outline-none text-center"
                placeholder="ㅇㅇ중 ㅇ학년 ㅇㅇㅇ"
                value={`${student.school} ${student.grade} ${student.name}`.trim()}
                onChange={(e) => {
                  const parts = e.target.value.split(' ');
                  if (parts.length >= 3) {
                    onStudentChange('school', parts[0]);
                    onStudentChange('grade', parts[1]);
                    onStudentChange('name', parts.slice(2).join(' '));
                  } else {
                    onStudentChange('name', e.target.value);
                  }
                }}
              />
            </td>
          </tr>
          <tr className="border-b border-gray-300">
            <td className="bg-gray-100 p-2 text-center font-semibold border-r border-gray-300">평가내용</td>
            <td className="p-0">
              <input
                type="text"
                className="w-full p-2 outline-none text-center"
                value={data.content}
                onChange={(e) => onChange(data.week, 'content', e.target.value)}
              />
            </td>
          </tr>
          <tr className="border-b border-gray-300">
            <td className="bg-gray-100 p-2 text-center font-semibold border-r border-gray-300">평가점수</td>
            <td className="p-0">
              <input
                type="number"
                className="w-full p-2 outline-none text-center"
                value={data.score || ''}
                onChange={(e) => onChange(data.week, 'score', Number(e.target.value))}
              />
            </td>
          </tr>
          <tr className="border-b border-gray-300">
            <td className="bg-gray-100 p-2 text-center font-semibold border-r border-gray-300">결과</td>
            <td className="p-0">
              <select
                className="w-full p-2 outline-none text-center appearance-none"
                value={data.result}
                onChange={(e) => onChange(data.week, 'result', e.target.value)}
              >
                <option value="">선택</option>
                <option value="pass">pass</option>
                <option value="fail">fail</option>
              </select>
            </td>
          </tr>
          <tr className="border-b border-gray-300">
            <td className="bg-gray-100 p-2 text-center font-semibold border-r border-gray-300">과제달성률</td>
            <td className="p-0">
              <input
                type="number"
                className="w-full p-2 outline-none text-center"
                value={data.completion || ''}
                onChange={(e) => onChange(data.week, 'completion', Number(e.target.value))}
              />
            </td>
          </tr>
          <tr>
            <td className="bg-gray-100 p-2 text-center font-semibold border-r border-gray-300">추가학습계획</td>
            <td className="p-0">
              <input
                type="text"
                className="w-full p-2 outline-none text-center"
                value={data.additionalPlan}
                onChange={(e) => onChange(data.week, 'additionalPlan', e.target.value)}
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default WeeklyForm;