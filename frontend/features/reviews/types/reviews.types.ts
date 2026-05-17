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

export interface Review {
  id: string;
  externalId: string;
  productId: string;
  productName: string;
  clientId: string | null;
  clientName: string;
  clientEmail: string | null;
  rating: number;
  reviewText: string;
  isPriority: boolean;
  status: ReviewStatus;
  createdAt: string;
  updatedAt: string;
  adminResponse: AdminResponseData | null;
  moderationRecord: ModerationRecordData | null;
}

export interface RejectReviewPayload {
  reason: ModerationReason;
  notes?: string;
}

export interface RespondReviewPayload {
  text: string;
}
