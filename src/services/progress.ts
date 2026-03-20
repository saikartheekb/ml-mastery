import type { UserProgress, Achievement } from '../types';
import { defaultUserProgress, defaultAchievements } from '../data/curriculum';

const STORAGE_KEYS = {
  USER_PROGRESS: 'ml_mastery_progress',
  USER_ACHIEVEMENTS: 'ml_mastery_achievements',
};

// Initialize or get user progress
export function getUserProgress(): UserProgress {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.USER_PROGRESS);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error('Error reading progress:', e);
  }
  return { ...defaultUserProgress };
}

// Save user progress
export function saveUserProgress(progress: UserProgress): void {
  try {
    localStorage.setItem(STORAGE_KEYS.USER_PROGRESS, JSON.stringify(progress));
  } catch (e) {
    console.error('Error saving progress:', e);
  }
}

// Initialize or get achievements
export function getAchievements(): Achievement[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.USER_ACHIEVEMENTS);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error('Error reading achievements:', e);
  }
  return [...defaultAchievements];
}

// Save achievements
export function saveAchievements(achievements: Achievement[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.USER_ACHIEVEMENTS, JSON.stringify(achievements));
  } catch (e) {
    console.error('Error saving achievements:', e);
  }
}

// Update progress when lesson completed
export function completeLesson(lessonId: string): UserProgress {
  const progress = getUserProgress();
  
  if (!progress.completedLessons.includes(lessonId)) {
    progress.completedLessons.push(lessonId);
    progress.overallCompletion = calculateCompletion(progress);
    
    // Check for achievements
    checkAndAwardAchievements(progress);
    
    saveUserProgress(progress);
  }
  
  return progress;
}

// Update progress when assessment completed
export function completeAssessment(assessmentId: string, score: number): UserProgress {
  const progress = getUserProgress();
  
  if (!progress.completedAssessments.includes(assessmentId)) {
    progress.completedAssessments.push(assessmentId);
  }
  
  // Update or add score
  const existingScoreIndex = progress.assessmentScores.findIndex(
    s => s.assessmentId === assessmentId
  );
  
  if (existingScoreIndex >= 0) {
    // Keep best score
    if (score > progress.assessmentScores[existingScoreIndex].score) {
      progress.assessmentScores[existingScoreIndex].score = score;
      progress.assessmentScores[existingScoreIndex].completedAt = new Date().toISOString();
    }
  } else {
    progress.assessmentScores.push({
      assessmentId,
      score,
      completedAt: new Date().toISOString()
    });
  }
  
  progress.overallCompletion = calculateCompletion(progress);
  saveUserProgress(progress);
  
  return progress;
}

// Update progress when project completed
export function completeProject(projectId: string): UserProgress {
  const progress = getUserProgress();
  
  if (!progress.completedProjects.includes(projectId)) {
    progress.completedProjects.push(projectId);
    progress.overallCompletion = calculateCompletion(progress);
    
    checkAndAwardAchievements(progress);
    
    saveUserProgress(progress);
  }
  
  return progress;
}

// Update current lesson
export function setCurrentLesson(courseId: string, lessonId: string): void {
  const progress = getUserProgress();
  progress.currentCourse = courseId;
  progress.currentLesson = lessonId;
  progress.lastActivityDate = new Date().toISOString().split('T')[0];
  
  // Update streak
  updateStreak(progress);
  
  saveUserProgress(progress);
}

// Update time spent
export function addTimeSpent(minutes: number): void {
  const progress = getUserProgress();
  progress.totalTimeSpent += minutes;
  progress.lastActivityDate = new Date().toISOString().split('T')[0];
  
  updateStreak(progress);
  
  saveUserProgress(progress);
}

// Calculate overall completion
function calculateCompletion(progress: UserProgress): number {
  // Total items to complete: 15 lessons + 3 assessments + 3 projects = 21
  const totalItems = 21;
  const completed = 
    progress.completedLessons.length +
    progress.completedAssessments.length +
    progress.completedProjects.length;
  
  return Math.round((completed / totalItems) * 100);
}

// Update learning streak
function updateStreak(progress: UserProgress): void {
  const today = new Date().toISOString().split('T')[0];
  const lastDate = progress.lastActivityDate;
  
  if (lastDate === today) {
    return; // Already active today
  }
  
  const lastDateObj = new Date(lastDate);
  const todayObj = new Date(today);
  const diffDays = Math.floor(
    (todayObj.getTime() - lastDateObj.getTime()) / (1000 * 60 * 60 * 24)
  );
  
  if (diffDays === 1) {
    progress.streak += 1;
  } else if (diffDays > 1) {
    progress.streak = 1;
  }
  
  checkAndAwardAchievements(progress);
}

// Check and award achievements
function checkAndAwardAchievements(progress: UserProgress): void {
  const achievements = getAchievements();
  const today = new Date().toISOString();
  
  // First lesson achievement
  if (progress.completedLessons.length >= 1) {
    const achievement = achievements.find(a => a.id === 'first-lesson');
    if (achievement && !achievement.earnedAt) {
      achievement.earnedAt = today;
    }
  }
  
  // First course achievement
  if (progress.completedLessons.length >= 5) {
    const achievement = achievements.find(a => a.id === 'first-course');
    if (achievement && !achievement.earnedAt) {
      achievement.earnedAt = today;
    }
  }
  
  // Week warrior achievement
  if (progress.streak >= 7) {
    const achievement = achievements.find(a => a.id === 'streak-7');
    if (achievement && !achievement.earnedAt) {
      achievement.earnedAt = today;
    }
  }
  
  // Math master achievement (5 math lessons)
  if (progress.completedLessons.filter(l => l.startsWith('phase1-')).length >= 5) {
    const achievement = achievements.find(a => a.id === 'math-master');
    if (achievement && !achievement.earnedAt) {
      achievement.earnedAt = today;
    }
  }
  
  // Deep thinker achievement
  if (progress.completedLessons.filter(l => l.startsWith('phase3-')).length >= 5) {
    const achievement = achievements.find(a => a.id === 'deep-thinker');
    if (achievement && !achievement.earnedAt) {
      achievement.earnedAt = today;
    }
  }
  
  saveAchievements(achievements);
}

// Reset all progress
export function resetProgress(): void {
  localStorage.removeItem(STORAGE_KEYS.USER_PROGRESS);
  localStorage.removeItem(STORAGE_KEYS.USER_ACHIEVEMENTS);
}
