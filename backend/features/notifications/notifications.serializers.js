export function serializeNotification(n) {
  return {
    id: n.id.toString(),
    adminId: n.adminId.toString(),
    type: n.type,
    title: n.title,
    content: n.content,
    entityType: n.entityType,
    entityId: n.entityId ? n.entityId.toString() : null,
    read: n.read,
    sentAt: n.sentAt ? n.sentAt.toISOString() : null,
    createdAt: n.createdAt.toISOString(),
  };
}

export function serializePreferences(p) {
  return {
    adminUserId: p.adminUserId.toString(),
    receiveOrderNotifications: p.receiveOrderNotifications,
    receiveReviewNotifications: p.receiveReviewNotifications,
    updatedAt: p.updatedAt.toISOString(),
  };
}
