export type ReviewStatus = 'pending' | 'approved' | 'rejected';

export type ModerationReason =
  | 'offensive_content'
  | 'spam'
  | 'false_information'
  | 'off_topic'
  | 'other';

export interface AdminResponseData {
  id: string;
  text: string;
  adminName: string | null;
  createdAt: string;
}

export interface ModerationRecordData {
  id: string;
  reason: ModerationReason;
  notes: string | null;
  createdAt: string;
}

export interface ReviewClientUser {
  id: string;
  fullName: string;
  email: string;
}

export interface ReviewProduct {
  itemId: string;
  name: string;
  imageUrl: string | null;
}

export interface Review {
  id: string;
  productId: string;
  clientUserId: string;
  rating: number;
  comment: string;
  status: ReviewStatus;
  edited: boolean;
  helpfulVotes: number;
  unhelpfulVotes: number;
  createdAt: string;
  updatedAt: string;
  clientUser: ReviewClientUser;
  product: ReviewProduct;
  adminResponse?: AdminResponseData | null;
  moderationRecord?: ModerationRecordData | null;
}

export interface ReviewListResponse {
  total: number;
  items: Review[];
}

export interface ReviewStats {
  pending: number;
  approved: number;
  rejected: number;
  total: number;
}

export interface RejectReviewPayload {
  reason: ModerationReason;
  notes?: string;
}

export interface RespondReviewPayload {
  text: string;
}
