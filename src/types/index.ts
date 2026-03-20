// Core Types for ML Mastery Platform

export interface User {
  id: string;
  name: string;
  email: string;
  progress: UserProgress;
  achievements: Achievement[];
  createdAt: string;
}

export interface UserProgress {
  overallCompletion: number;
  totalTimeSpent: number; // in minutes
  currentPhase: number;
  currentCourse: string | null;
  currentLesson: string | null;
  completedLessons: string[];
  completedAssessments: string[];
  completedProjects: string[];
  assessmentScores: AssessmentScore[];
  streak: number;
  lastActivityDate: string;
}

export interface AssessmentScore {
  assessmentId: string;
  score: number;
  completedAt: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedAt: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  phase: number;
  lessons: Lesson[];
  assessments: Assessment[];
  projects: Project[];
  prerequisites: string[];
  estimatedHours: number;
  icon: string;
}

export interface Lesson {
  id: string;
  courseId: string;
  title: string;
  content: string;
  codeExamples: CodeExample[];
  practiceProblems: PracticeProblem[];
  duration: number; // in minutes
  order: number;
}

export interface CodeExample {
  id: string;
  title: string;
  code: string;
  language: 'python' | 'javascript';
  explanation: string;
}

export interface PracticeProblem {
  id: string;
  title: string;
  description: string;
  solution: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface Assessment {
  id: string;
  courseId: string;
  title: string;
  type: 'quiz' | 'project';
  questions: Question[];
  passingScore: number;
  duration: number; // in minutes, 0 = untimed
}

export interface Question {
  id: string;
  type: 'multiple_choice' | 'fill_blank' | 'short_answer';
  question: string;
  options?: string[];
  correctAnswer: string | string[];
  explanation: string;
  points: number;
}

export interface Project {
  id: string;
  courseId: string;
  title: string;
  description: string;
  objectives: string[];
  starterCode: string;
  expectedOutput: string;
  hints: string[];
  rubric: RubricItem[];
  estimatedHours: number;
}

export interface RubricItem {
  criterion: string;
  maxPoints: number;
  description: string;
}

export interface LearningPath {
  id: string;
  title: string;
  description: string;
  phases: Phase[];
}

export interface Phase {
  number: number;
  title: string;
  description: string;
  courses: Course[];
  isLocked: boolean;
  estimatedHours: number;
}
