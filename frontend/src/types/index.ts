// ============================================================
// TypeScript Types — Job Search Manager
// ============================================================

/** Mirrors the backend OpenAiModel enum. Values are the raw OpenAI model IDs. */
export type OpenAiModel = 'gpt-4o-mini' | 'gpt-4.1-mini' | 'gpt-4.1';

export const OPENAI_MODEL_DEFAULT: OpenAiModel = 'gpt-4.1-mini';

export type ApplicationStatus =
  | 'INTERESTED'
  | 'APPLIED'
  | 'HR_SCREEN'
  | 'TECH_INTERVIEW'
  | 'OFFER'
  | 'REJECTED'
  | 'FOLLOW_UP_NEEDED';

export type RelationshipType =
  | 'RECRUITER'
  | 'ENGINEER'
  | 'MANAGER'
  | 'REFERRAL'
  | 'LOCAL_CONTACT'
  | 'OTHER';

export type Channel = 'LINKEDIN' | 'EMAIL' | 'PHONE' | 'IN_PERSON' | 'OTHER';

export type MessageDirection = 'INBOUND' | 'OUTBOUND';

export type PromptType =
  | 'RESUME_TAILORING'
  | 'LINKEDIN_MESSAGE'
  | 'FOLLOW_UP'
  | 'COVER_LETTER'
  | 'OTHER';

// ---- Entities ----

export interface Company {
  id: number;
  name: string;
  industry?: string;
  location?: string;
  website?: string;
  notes?: string;
  priority?: number;
  createdAt: string;
  updatedAt: string;
}

export interface JobApplication {
  id: number;
  companyId?: number;
  companyName?: string;
  jobTitle: string;
  jobDescription?: string;
  status: ApplicationStatus;
  salaryRange?: string;
  sourceUrl?: string;
  resumeVersionUsed?: string;
  appliedAt?: string;
  nextFollowUpAt?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Contact {
  id: number;
  companyId?: number;
  companyName?: string;
  fullName: string;
  roleTitle?: string;
  linkedinUrl?: string;
  email?: string;
  relationshipType?: RelationshipType;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Conversation {
  id: number;
  contactId?: number;
  contactName?: string;
  companyId?: number;
  companyName?: string;
  channel?: Channel;
  messageDirection?: MessageDirection;
  messageText?: string;
  conversationDate?: string;
  nextFollowUpAt?: string;
  aiSuggestedReply?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PromptTemplate {
  id: number;
  name: string;
  type?: PromptType;
  promptText: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ResumeDocument {
  id: number;
  name: string;
  originalFilename?: string;
  contentText?: string;
  filePath?: string;
  isMaster: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface TailoredResume {
  id: number;
  jobApplicationId?: number;
  jobTitle?: string;
  masterResumeId?: number;
  masterResumeName?: string;
  promptTemplateId?: number;
  promptTemplateName?: string;
  generatedContent?: string;
  changeSummary?: string;
  gapsOrWarnings?: string;
  createdAt: string;
}

export interface DashboardStats {
  activeApplications: number;
  followUpsDue: number;
  totalContacts: number;
  generatedResumes: number;
  applicationsByStatus: Record<ApplicationStatus, number>;
}

// ---- Request Payloads ----

export interface CompanyRequest {
  name: string;
  industry?: string;
  location?: string;
  website?: string;
  notes?: string;
  priority?: number;
}

export interface JobApplicationRequest {
  companyId?: number;
  jobTitle: string;
  jobDescription?: string;
  status: ApplicationStatus;
  salaryRange?: string;
  sourceUrl?: string;
  resumeVersionUsed?: string;
  appliedAt?: string;
  nextFollowUpAt?: string;
  notes?: string;
}

export interface ContactRequest {
  companyId?: number;
  fullName: string;
  roleTitle?: string;
  linkedinUrl?: string;
  email?: string;
  relationshipType?: RelationshipType;
  notes?: string;
}

export interface ConversationRequest {
  contactId: number;
  channel?: Channel;
  messageDirection?: MessageDirection;
  messageText?: string;
  conversationDate?: string;
  nextFollowUpAt?: string;
  aiSuggestedReply?: string;
}

export interface PromptTemplateRequest {
  name: string;
  type?: PromptType;
  promptText: string;
  isDefault?: boolean;
}

export interface ResumeTextRequest {
  name: string;
  contentText: string;
  isMaster?: boolean;
}

export interface TailoringRequest {
  masterResumeId: number;
  promptTemplateId: number;
  jobApplicationId?: number;
  jobDescription?: string;
  /** OpenAI model ID to use for generation. Omitting uses the backend default (gpt-4.1-mini). */
  model?: OpenAiModel;
}

export interface ApiError {
  status: number;
  error: string;
  message: string;
  timestamp: string;
}
