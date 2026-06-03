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

export type { ToastItem } from '@/components/ui/Toast';

export type StatusFilter = ReviewStatus | 'all';

export interface ReviewTab {
  key: StatusFilter;
  label: string;
}

export interface ReviewModerationPanelProps {
  reviews: Review[];
  statusFilter: StatusFilter;
  onFilterChange: (filter: StatusFilter) => void;
  onApprove: (id: string) => void;
  onReject: (id: string, reason: ModerationReason, notes?: string) => void;
  onRespond: (id: string, responseText: string) => void;
  loadingId: string | null;
  errorId: string | null;
}

export interface RespondReviewModalProps {
  onConfirm: (responseText: string) => void;
  onClose: () => void;
  isLoading: boolean;
}

export interface AdminResponseProps {
  adminResponse: string;
  label: string;
}

export interface ReviewCardActionsProps {
  reviewId: string;
  clientName: string;
  isPending: boolean;
  canRespond: boolean;
  isLoading: boolean;
  hasError: boolean;
  hasAdminResponse: boolean;
  onApprove: (id: string) => void;
  onReject: (id: string, reason: ModerationReason, notes?: string) => void;
  onRespond: (id: string, responseText: string) => void;
}

export interface RejectReviewModalProps {
  reviewId: string;
  onConfirm: (reason: ModerationReason, notes?: string) => void;
  onClose: () => void;
  isLoading: boolean;
}

export interface ReviewModerationCardProps {
  review: Review;
  onApprove: (id: string) => void;
  onReject: (id: string, reason: ModerationReason, notes?: string) => void;
  onRespond: (id: string, responseText: string) => void;
  loadingId: string | null;
  errorId: string | null;
}
