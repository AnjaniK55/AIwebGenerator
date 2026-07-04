export type UserRole = "user" | "client" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
  subscriptionPlan?: "free" | "pro" | "agency";
  subscriptionStatus?: string;
  subscriptionExpiry?: string | null;
  aiGenerationsLimit?: number;
  aiGenerationsUsed?: number;
  isBlocked?: boolean;
}

export type ProjectStatus = "Draft" | "Processing" | "Completed" | "Failed";

export interface Project {
  id: string;
  userId: string;
  projectName: string;
  businessType: string;
  description: string;
  websiteGoal: string;
  prompt: string;
  status: ProjectStatus;
  createdAt: string;
  updatedAt: string;
  aiGeneratedData?: any;
  generatedPages?: any[];
  generatedComponents?: any[];
  generationStatus?: ProjectStatus;
  aiModel?: string;
  generatedAt?: string;
}

export type ClientStatus = "active" | "inactive";

export interface Client {
  id: string;
  name: string;
  email: string;
  projectId: string;
  status: ClientStatus;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: any;
}
