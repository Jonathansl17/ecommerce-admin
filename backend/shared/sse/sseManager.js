import { SSE_CONFIG } from './sse.constants.js';

const clients = new Map();

function getTotalConnections() {
  let total = 0;
  for (const set of clients.values()) total += set.size;
  return total;
}

export function addClient(adminId, res) {
  if (getTotalConnections() >= SSE_CONFIG.MAX_TOTAL_CONNECTIONS) {
    res.status(503).end();
    return;
  }

  const key = String(adminId);
  if (!clients.has(key)) {
    clients.set(key, new Set());
  }
  const set = clients.get(key);

  if (set.size >= SSE_CONFIG.MAX_CONNECTIONS_PER_ADMIN) {
    const oldest = set.values().next().value;
    try { oldest.end(); } catch { /* already closed */ }
    set.delete(oldest);
  }

  set.add(res);
}

export function removeClient(adminId, res) {
  const key = String(adminId);
  const set = clients.get(key);
  if (!set) return;
  set.delete(res);
  if (set.size === 0) {
    clients.delete(key);
  }
}

export function broadcast(adminIds, event, data) {
  const payload = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
  for (const adminId of adminIds) {
    const key = String(adminId);
    const set = clients.get(key);
    if (!set) continue;
    for (const res of set) {
      try {
        res.write(payload);
      } catch (err) {
        console.error(`[SSE] Removing dead client for adminId ${adminId}:`, err.message);
        set.delete(res);
        if (set.size === 0) clients.delete(key);
      }
    }
  }
}

export function broadcastAll(event, data) {
  const adminIds = Array.from(clients.keys());
  broadcast(adminIds, event, data);
}
