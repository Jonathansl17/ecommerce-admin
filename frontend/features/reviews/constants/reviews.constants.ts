import type { ReviewStatus, ModerationReason } from '../types/reviews.types';

export const REVIEW_STATUS_LABELS: Record<ReviewStatus, string> = {
  pending: 'Pendiente',
  approved: 'Aprobada',
  rejected: 'Rechazada',
};

export const MODERATION_REASON_LABELS: Record<ModerationReason, string> = {
  offensive_content: 'Contenido ofensivo',
  spam: 'Spam',
  false_information: 'Información falsa',
  off_topic: 'Fuera de tema',
  other: 'Otro motivo',
};

export const REVIEWS_STRINGS = {
  page: {
    title: 'Moderación de reseñas',
    ariaLoading: 'Cargando reseñas',
  },
  tabs: {
    all: 'Todas',
    pending: 'Pendientes',
    approved: 'Aprobadas',
    rejected: 'Rechazadas',
  },
  card: {
    approve: 'Aprobar',
    reject: 'Rechazar',
    respond: 'Responder',
    editResponse: 'Editar respuesta',
    priorityBadge: 'Prioritaria',
    responseSectionLabel: 'Respuesta del administrador',
    moderationSectionLabel: 'Motivo de rechazo',
    byAdmin: (name: string | null) => (name ? `Por ${name}` : 'Por administrador'),
  },
  panel: {
    ariaTabList: 'Filtrar reseñas por estado',
    ariaList: 'Lista de reseñas',
    ariaCount: (n: number) => `${n} reseñas`,
  },
  modals: {
    rejectTitle: 'Rechazar reseña',
    rejectDescription: 'Selecciona el motivo del rechazo. Esta acción marcará la reseña como rechazada.',
    rejectReasonLabel: 'Motivo de rechazo',
    rejectReasonPlaceholder: 'Selecciona un motivo',
    rejectNotesLabel: 'Notas adicionales (opcional)',
    rejectNotesPlaceholder: 'Agrega notas internas sobre esta decisión...',
    respondTitle: 'Responder reseña',
    respondDescription: 'Escribe una respuesta pública que el cliente podrá ver.',
    respondTextLabel: 'Respuesta',
    respondTextPlaceholder: 'Escribe tu respuesta...',
    confirmReject: 'Rechazar reseña',
    confirmRespond: 'Publicar respuesta',
    cancel: 'Cancelar',
    submitting: 'Guardando...',
    charsRemaining: (n: number) => `${n} caracteres restantes`,
    minLengthError: (n: number) => `Mínimo ${n} caracteres`,
  },
  empty: {
    all: 'No hay reseñas registradas.',
    pending: 'No hay reseñas pendientes de moderación.',
    approved: 'No hay reseñas aprobadas.',
    rejected: 'No hay reseñas rechazadas.',
  },
  errors: {
    fetchError: 'No se pudieron cargar las reseñas.',
    approveError: 'Error al aprobar la reseña.',
    rejectError: 'Error al rechazar la reseña.',
    respondError: 'Error al publicar la respuesta.',
  },
  toasts: {
    approved: 'Reseña aprobada',
    rejected: 'Reseña rechazada',
    approveError: 'No se pudo aprobar la reseña',
    rejectError: 'No se pudo rechazar la reseña',
  },
  time: {
    justNow: 'Justo ahora',
    minutesAgo: (n: number) => `hace ${n} minuto${n === 1 ? '' : 's'}`,
    hoursAgo: (n: number) => `hace ${n} hora${n === 1 ? '' : 's'}`,
    daysAgo: (n: number) => `hace ${n} día${n === 1 ? '' : 's'}`,
  },
} as const;

export const REVIEWS_CARD_STRINGS = REVIEWS_STRINGS.card;
export const REVIEWS_MODAL_STRINGS = REVIEWS_STRINGS.modals;
export const REVIEWS_ERRORS_STRINGS = REVIEWS_STRINGS.errors;
export const REVIEWS_TIME_STRINGS = REVIEWS_STRINGS.time;
export const REVIEWS_TABS_STRINGS = REVIEWS_STRINGS.tabs;
export const REVIEWS_EMPTY_STRINGS = REVIEWS_STRINGS.empty;

export const MODERATION_REASONS = Object.keys(MODERATION_REASON_LABELS) as ModerationReason[];

export const RESPOND_MIN_LENGTH = 10;
export const REVIEW_TEXT_MAX_LENGTH = 500;
