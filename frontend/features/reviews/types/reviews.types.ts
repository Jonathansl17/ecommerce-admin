export type ReviewStatus = 'pending' | 'approved' | 'rejected';

export type ModerationReason =
  | 'offensive_content'
  | 'spam'
  | 'false_information'
  | 'off_topic'
  | 'other';

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
  adminResponse?: string | null;
  createdAt: string;
  updatedAt: string;
  clientUser: ReviewClientUser;
  product: ReviewProduct;
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

export interface DeleteReviewPayload {
  reason: ModerationReason;
  detail?: string;
}

export interface ReviewModerationCardProps {
  review: Review;
  onApprove: (id: string) => void;
  onReject: (id: string, reason: ModerationReason, notes?: string) => void;
  onRespond: (id: string, responseText: string) => void;
  onDelete: (id: string, reason: ModerationReason, detail?: string) => void;
  loadingId: string | null;
  errorId: string | null;
}
