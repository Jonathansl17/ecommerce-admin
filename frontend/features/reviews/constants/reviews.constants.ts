import type {
  ReviewStatus,
  ReviewStatusFilter,
  ModerationReason,
  ReviewStats,
} from '../types/reviews.types';

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

// Predefined moderation reasons, in display order, for the reason dropdowns.
export const MODERATION_REASON_OPTIONS = Object.keys(
  MODERATION_REASON_LABELS,
) as ModerationReason[];

// Character limits shared by the moderation forms.
export const REVIEW_FORM_LIMITS = {
  responseMin: 10,
  responseMax: 500,
  notesMax: 500,
  deleteDetailMax: 500,
} as const;

// Canonical review status values — use these instead of hardcoding the literals.
export const REVIEW_STATUS = {
  pending: 'pending',
  approved: 'approved',
  rejected: 'rejected',
} as const;

// Sentinel filter value meaning "all statuses".
export const REVIEW_STATUS_FILTER_ALL = 'all' as const;

// Moderation modals that can be open for a review card.
export const REVIEW_MODAL = {
  reject: 'reject',
  respond: 'respond',
  delete: 'delete',
} as const;

// Order of the status filter tabs in the moderation panel.
export const REVIEW_TAB_KEYS: ReviewStatusFilter[] = [
  REVIEW_STATUS.pending,
  REVIEW_STATUS.approved,
  REVIEW_STATUS.rejected,
  REVIEW_STATUS_FILTER_ALL,
];

// Reviews shown per page in the moderation panel.
export const REVIEWS_PAGE_SIZE = 5;

// Zero-valued stats used as the initial state before the first fetch resolves.
export const EMPTY_REVIEW_STATS: ReviewStats = {
  pending: 0,
  approved: 0,
  rejected: 0,
  total: 0,
};

export const REVIEWS_STRINGS = {
  page: {
    title: 'Moderación de reseñas',
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
    delete: 'Eliminar',
    priorityBadge: 'Prioritaria',
    responseSectionLabel: 'Respuesta del administrador',
    moderationSectionLabel: 'Motivo de rechazo',
    byAdmin: (name: string | null) => (name ? `Por ${name}` : 'Por administrador'),
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
    deleteTitle: 'Eliminar reseña',
    deleteDescription:
      'Esta acción elimina la reseña de forma permanente, junto con sus votos y la respuesta del administrador. No se puede deshacer.',
    deleteReasonLabel: 'Motivo de eliminación',
    deleteReasonPlaceholder: 'Selecciona un motivo',
    deleteDetailLabel: 'Descripción adicional (opcional)',
    deleteDetailPlaceholder: 'Agrega detalles sobre el motivo de eliminación...',
    deleteSummaryLabel: 'Reseña a eliminar',
    confirmReject: 'Rechazar reseña',
    confirmRespond: 'Publicar respuesta',
    confirmDelete: 'Eliminar reseña',
    cancel: 'Cancelar',
    submitting: 'Guardando...',
    deleting: 'Eliminando...',
    charsRemaining: (n: number) => `${n} caracteres restantes`,
  },
  empty: {
    all: 'No hay reseñas registradas.',
    pending: 'No hay reseñas pendientes de moderación.',
    approved: 'No hay reseñas aprobadas.',
    rejected: 'No hay reseñas rechazadas.',
  },
  filters: {
    productPlaceholder: 'Buscar por producto',
    personPlaceholder: 'Buscar por persona',
    search: 'Buscar',
    clear: 'Limpiar',
  },
  pagination: {
    previous: 'Anterior',
    next: 'Siguiente',
    pageInfo: (current: number, total: number) => `Página ${current} de ${total}`,
    totalItems: (n: number) => `${n} reseña${n === 1 ? '' : 's'} en total`,
  },
  errors: {
    fetchError: 'No se pudieron cargar las reseñas.',
    approveError: 'Error al aprobar la reseña.',
    rejectError: 'Error al rechazar la reseña.',
    respondError: 'Error al publicar la respuesta.',
    deleteError: 'Error al eliminar la reseña.',
  },
  time: {
    justNow: 'Justo ahora',
    minutesAgo: (n: number) => `hace ${n} minuto${n === 1 ? '' : 's'}`,
    hoursAgo: (n: number) => `hace ${n} hora${n === 1 ? '' : 's'}`,
    daysAgo: (n: number) => `hace ${n} día${n === 1 ? '' : 's'}`,
  },
  a11y: {
    cardLabel: (client: string, product: string) => `Reseña de ${client} sobre ${product}`,
    actionsGroup: 'Acciones de moderación',
    actionLabel: (action: string, client: string) => `${action} reseña de ${client}`,
    filterTabs: 'Filtrar reseñas por estado',
    list: 'Lista de reseñas',
    countLabel: (n: number) => `${n} reseñas`,
    pagination: 'Paginación de reseñas',
    loading: 'Cargando reseñas',
    starRating: (rating: number) => `${rating} de 5 estrellas`,
    productSearch: 'Buscar reseñas por producto',
    personSearch: 'Buscar reseñas por persona',
    searchForm: 'Filtros de búsqueda de reseñas',
  },
} as const;
