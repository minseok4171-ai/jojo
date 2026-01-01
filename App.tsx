import React, { useState, useCallback } from 'react';
import { ReportState, WeeklyTestInfo, StudentBasicInfo } from './types.ts';
import WeeklyForm from './components/WeeklyForm.tsx';
import MonthlyReport from './components/MonthlyReport.tsx';
import { GoogleGenAI } from "@google/genai";

const initialWeeklyData: WeeklyTestInfo[] = [
  { week: 1, content: '', score: 0, result: '', completion: 0, additionalPlan: '' },
  { week: 2, content: '', score: 0, result: '', completion: 0, additionalPlan: '' },
  { week: 3, content: '', score: 0, result: '', completion: 0, additionalPlan: '' },
  { week: 4, content: '', score: 0, result: '', completion: 0, additionalPlan: '' },
];

const App: React.FC = () => {
  const [state, setState] = useState<ReportState>({
    month: '3월',
    academyName: '동탄목동 와와학습코칭학원',
    student: { school: '', grade: '', name: '' },
    weeklyData: initialWeeklyData,
    coachingComment: '',
  });

  const [isGeneratingAI, setIsGeneratingAI] = useState(false);

  const handleWeeklyChange = useCallback((weekNum: number, field: keyof WeeklyTestInfo, value: any) => {
    setState(prev => ({
      ...prev,
      weeklyData: prev.weeklyData.map(w => w.week === weekNum ? { ...w, [field]: value } : w)
    }));
  }, []);

  const handleStudentChange = useCallback((field: keyof StudentBasicInfo, value: string) => {
    setState(prev => ({
      ...prev,
      student: { ...prev.student, [field]: value }
    }));
  }, []);

  const handleCommentChange = useCallback((val: string) => {
    setState(prev => ({ ...prev, coachingComment: val }));
  }, []);

  const handleAcademyNameChange = useCallback((val: string) => {
    setState(prev => ({ ...prev, academyName: val }));
  }, []);

  const generateAIComment = async () => {
    if (isGeneratingAI) return;
    
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      alert("API 키가 설정되지 않았습니다.");
      return;
    }

    setIsGeneratingAI(true);
    
    try {
      const ai = new GoogleGenAI({ apiKey });
      const prompt = `
        학습 코칭 전문가로서 학생의 한 달 학습 리포트를 기반으로 종합 의견(코칭 코멘트)을 작성해줘.
        
        학생 정보: ${state.student.school} ${state.student.grade} ${state.student.name}
        기간: ${state.month}
        학원: ${state.academyName}

        주간 학습 데이터:
        ${state.weeklyData.map(w => `
          ${w.week}주차: 
          - 평가내용: ${w.content || '기록없음'}
          - 점수: ${w.score}점
          - 결과: ${w.result}
          - 과제달성률: ${w.completion}%
        `).join('\n')}

        작성 지침:
        - 학생의 이름을 언급하며 따뜻하고 전문적인 선생님의 말투(해요체)로 작성하세요.
        - 점수와 과제달성률을 구체적으로 칭찬하거나 보완할 점을 제시하세요.
        - 다음 달 성장을 기대하는 응원 메시지로 마무리하세요.
        - 4~5문장 정도로 작성하세요.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
            systemInstruction: "당신은 와와학습코칭센터의 베테랑 학습 코칭 전문가입니다. 학생의 성취를 격려하고 성장을 돕는 통찰력 있는 코멘트를 작성하세요.",
            temperature: 0.8,
        }
      });

      if (response.text) {
        setState(prev => ({ ...prev, coachingComment: response.text.trim() }));
      }
    } catch (error) {
      console.error('AI Comment Generation Error:', error);
      alert('AI 코멘트 생성 중 오류가 발생했습니다.');
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSaveImage = async () => {
    const element = document.getElementById('monthly-report-capture');
    if (!element) return;
    
    // @ts-ignore
    const h2c = window.html2canvas;
    if (!h2c) {
      alert("이미지 캡처 라이브러리가 로드되지 않았습니다. 잠시 후 다시 시도해주세요.");
      return;
    }
    
    await new Promise(resolve => setTimeout(resolve, 400));

    try {
      const canvas = await h2c(element, {
        scale: 3, 
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false,
        onclone: (clonedDoc: Document) => {
          const clonedElement = clonedDoc.getElementById('monthly-report-capture');
          if (clonedElement) {
            const inputs = clonedElement.querySelectorAll('input, textarea');
            inputs.forEach(input => {
              const typedInput = input as HTMLInputElement | HTMLTextAreaElement;
              const textNode = clonedDoc.createElement('div');
              textNode.innerText = typedInput.value;
              
              const styles = window.getComputedStyle(typedInput);
              textNode.style.fontSize = styles.fontSize;
              textNode.style.fontWeight = styles.fontWeight;
              textNode.style.fontFamily = styles.fontFamily;
              textNode.style.color = styles.color;
              textNode.style.textAlign = styles.textAlign;
              textNode.style.lineHeight = styles.lineHeight;
              textNode.style.width = '100%';
              textNode.style.display = 'flex';
              textNode.style.alignItems = 'center';
              textNode.style.justifyContent = styles.textAlign === 'center' ? 'center' : 'flex-start';
              textNode.style.whiteSpace = styles.whiteSpace === 'nowrap' ? 'nowrap' : 'pre-wrap';
              textNode.style.padding = styles.padding;
              
              typedInput.parentNode?.replaceChild(textNode, typedInput);
            });
            clonedElement.style.boxShadow = 'none';
          }
        }
      });
      
      const dataUrl = canvas.toDataURL('image/png', 1.0);
      const link = document.createElement('a');
      const fileName = `${state.student.name || '학생'}_${state.month}_월간리포트.png`;
      link.download = fileName;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error('Failed to save image:', error);
      alert('이미지 저장 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8 bg-slate-50">
      <header className="max-w-7xl mx-auto mb-8 flex flex-col md:flex-row justify-between items-center gap-6 no-print">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl rotate-3">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>
          </div>
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight italic">WAWA Smart Report</h1>
            <p className="text-gray-500 font-bold text-xs uppercase tracking-widest">Wawa Coaching Center Management System</p>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-3 items-center justify-center">
            <div className="flex items-center gap-3 bg-white px-5 py-3 rounded-2xl border border-gray-200 shadow-sm">
                <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Select Month</span>
                <input 
                    type="text" 
                    className="w-12 border-none outline-none text-center font-black text-gray-900 bg-transparent text-lg" 
                    value={state.month} 
                    onChange={(e) => setState(prev => ({ ...prev, month: e.target.value }))}
                />
            </div>
            
            <button 
                onClick={handleSaveImage}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-black py-3.5 px-8 rounded-2xl transition-all shadow-lg hover:shadow-emerald-200 flex items-center gap-3 active:scale-95"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                이미지 저장
            </button>
            
            <button 
                onClick={handlePrint}
                className="bg-gray-900 hover:bg-black text-white font-black py-3.5 px-8 rounded-2xl transition-all shadow-lg hover:shadow-gray-300 flex items-center gap-3 active:scale-95"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg>
                인쇄하기
            </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        <section className="no-print pb-20">
          <div className="space-y-4">
            <h2 className="text-2xl font-black mb-8 flex items-center gap-4 text-gray-900 italic">
                <span className="w-12 h-12 bg-[#FFC000] rounded-2xl flex items-center justify-center text-gray-900 shadow-lg -rotate-6">01</span>
                주간 평가 데이터 입력
            </h2>
            <div className="relative">
                {state.weeklyData.map((data, idx) => (
                    <WeeklyForm 
                        key={data.week} 
                        data={data} 
                        student={state.student}
                        onChange={handleWeeklyChange}
                        onStudentChange={handleStudentChange}
                        isFirst={idx === 0}
                    />
                ))}
            </div>
          </div>
        </section>

        <section>
          <div className="sticky top-8">
            <h2 className="text-2xl font-black mb-8 flex items-center gap-4 text-gray-900 italic no-print">
                <span className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg rotate-6">02</span>
                리포트 실시간 미리보기
            </h2>
            <MonthlyReport 
              state={state} 
              onCommentChange={handleCommentChange} 
              onAcademyNameChange={handleAcademyNameChange}
              onGenerateAI={generateAIComment}
              isGeneratingAI={isGeneratingAI}
            />
          </div>
        </section>
      </main>
    </div>
  );
};

export default App;