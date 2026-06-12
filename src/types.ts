export interface PersonalDetails {
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  website: string;
  github: string;
}

export interface WorkExperience {
  id: string;
  company: string;
  role: string;
  period: string;
  description: string;
  metrics: string[]; // Auto-generated or custom impact metrics
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  period: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  technologies: string;
}

export interface ResumeData {
  personal: PersonalDetails;
  summary: string;
  experience: WorkExperience[];
  education: Education[];
  skills: string[];
  projects: Project[];
  languages: string[];
}

export interface CoverLetter {
  recipient: string;
  company: string;
  jobTitle: string;
  content: string;
  date: string;
}

export interface AtsAnalysis {
  score: number;
  grammarAndFormatting: string[];
  suggestedKeywords: string[];
  matchingKeywords: string[];
  impactMetricsTips: string[];
  overallFeedback: string;
}

export interface LinkedInPost {
  id: string;
  content: string;
  scheduledTime: string;
  status: 'draft' | 'scheduled' | 'published';
  views: number;
  likes: number;
  comments: number;
  shares: number;
}

export interface LinkedInMetrics {
  profileViews: number;
  searchAppearances: number;
  postImpressions: number;
  connectionsCount: number;
  monthlyGrowthRate: number; // percentage
  topTrafficSources: { source: string; percentage: number }[];
  weeklyViewsData: { day: string; views: number; impressions: number }[];
  connectionsIndustryData: { industry: string; count: number }[];
}

export interface SystemIntegrationState {
  googleDriveConnected: boolean;
  googleCalendarConnected: boolean;
  slackConnected: boolean;
}
