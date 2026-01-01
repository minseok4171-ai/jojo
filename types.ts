
export interface WeeklyTestInfo {
  week: number;
  content: string;
  score: number;
  result: 'pass' | 'fail' | '';
  completion: number;
  additionalPlan: string;
}

export interface StudentBasicInfo {
  school: string;
  grade: string;
  name: string;
}

export interface ReportState {
  month: string;
  academyName: string;
  student: StudentBasicInfo;
  weeklyData: WeeklyTestInfo[];
  coachingComment: string;
}
