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
} as const;
