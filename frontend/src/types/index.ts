export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
}

export interface FeatureRequest {
  id: string;
  title: string;
  description: string;
  created_by: User;
  status: FeatureStatus;
  vote_count: number;
  has_voted: boolean;
  created_at: string;
  updated_at: string;
}

export type FeatureStatus =
  | "open"
  | "under_review"
  | "planned"
  | "in_progress"
  | "completed"
  | "declined";

export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
}

export interface RegisterResponse {
  user: User;
  tokens: AuthTokens;
}

export interface LoginResponse {
  access: string;
  refresh: string;
}

export interface VoteResponse {
  vote_count: number;
  has_voted: boolean;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}
