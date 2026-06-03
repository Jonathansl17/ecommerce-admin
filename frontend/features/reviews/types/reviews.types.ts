export type ReviewStatus = 'pending' | 'approved' | 'rejected';

export type ReviewStatusFilter = ReviewStatus | 'all';

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

export interface ReviewModerationPanelProps {
  reviews: Review[];
  counts: ReviewStats;
  statusFilter: ReviewStatusFilter;
  onFilterChange: (filter: ReviewStatusFilter) => void;
  onApprove: (id: string) => void;
  onReject: (id: string, reason: ModerationReason, notes?: string) => void;
  onRespond: (id: string, responseText: string) => void;
  onDelete: (id: string, reason: ModerationReason, detail?: string) => void;
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
  loadingId: string | null;
  errorId: string | null;
}

export interface RejectReviewModalProps {
  reviewId: string;
  onConfirm: (reason: ModerationReason, notes?: string) => void;
  onClose: () => void;
  isLoading: boolean;
}

export interface RespondReviewModalProps {
  onConfirm: (responseText: string) => void;
  onClose: () => void;
  isLoading: boolean;
}

export interface DeleteReviewModalProps {
  review: Review;
  onConfirm: (reason: ModerationReason, detail?: string) => void;
  onClose: () => void;
  isLoading: boolean;
}

export interface StarRatingProps {
  rating: number;
}

export interface ReviewStatusBadgeProps {
  status: ReviewStatus;
}

export type ActiveReviewModal = 'reject' | 'respond' | 'delete' | null;

export interface ReviewCardHeaderProps {
  review: Review;
}

export interface ReviewModerationActionsProps {
  review: Review;
  isLoading: boolean;
  onApprove: (id: string) => void;
  onOpenReject: () => void;
  onOpenRespond: () => void;
  onOpenDelete: () => void;
}

export interface ReviewModerationModalsProps {
  review: Review;
  active: ActiveReviewModal;
  isLoading: boolean;
  onClose: () => void;
  onReject: (id: string, reason: ModerationReason, notes?: string) => void;
  onRespond: (id: string, responseText: string) => void;
  onDelete: (id: string, reason: ModerationReason, detail?: string) => void;
}

export interface ReviewSummaryProps {
  review: Review;
  label?: string;
}

export interface ModerationReasonSelectProps {
  id: string;
  label: string;
  value: ModerationReason | '';
  onChange: (reason: ModerationReason) => void;
  disabled?: boolean;
  placeholder?: string;
}

export interface GetReviewsParams {
  status?: ReviewStatus;
  page?: number;
  pageSize?: number;
}

export interface UseReviewsReturn {
  reviews: Review[];
  stats: ReviewStats;
  total: number;
  page: number;
  pageSize: number;
  setPage: (page: number) => void;
  isLoading: boolean;
  error: string | null;
  statusFilter: ReviewStatusFilter;
  setStatusFilter: (filter: ReviewStatusFilter) => void;
  refetch: () => void;
}

export interface UseReviewActionsReturn {
  approve: (id: string, onSuccess: (updated: Review) => void) => Promise<void>;
  reject: (
    id: string,
    reason: ModerationReason,
    notes: string | undefined,
    onSuccess: (updated: Review) => void
  ) => Promise<void>;
  respond: (
    id: string,
    responseText: string,
    onSuccess: (updated: Review) => void
  ) => Promise<void>;
  remove: (
    id: string,
    reason: ModerationReason,
    detail: string | undefined,
    onSuccess: () => void
  ) => Promise<void>;
  loadingId: string | null;
  actionError: string | null;
  clearError: () => void;
}
