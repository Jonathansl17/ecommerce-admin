/**
 * In-process SSE client registry.
 * Tracks open Response streams per adminId so services can push
 * real-time events to connected browser clients without an external bus.
 *
 * Keys are adminId strings (BigInt serialised as string).
 * Values are Sets of Express Response objects.
 */

const clients = new Map();

/**
 * Register a new SSE response for a given admin.
 * @param {string} adminId
 * @param {import('express').Response} res
 */
export function addClient(adminId, res) {
  const key = String(adminId);
  if (!clients.has(key)) {
    clients.set(key, new Set());
  }
  clients.get(key).add(res);
}

/**
 * Remove a previously registered SSE response.
 * Cleans up the adminId entry when the set becomes empty.
 * @param {string} adminId
 * @param {import('express').Response} res
 */
export function removeClient(adminId, res) {
  const key = String(adminId);
  const set = clients.get(key);
  if (!set) return;
  set.delete(res);
  if (set.size === 0) {
    clients.delete(key);
  }
}

/**
 * Send an SSE event to specific admins.
 * @param {string[]} adminIds
 * @param {string} event
 * @param {unknown} data
 */
export function broadcast(adminIds, event, data) {
  const payload = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
  for (const adminId of adminIds) {
    const set = clients.get(String(adminId));
    if (!set) continue;
    for (const res of set) {
      try {
        res.write(payload);
      } catch (err) {
        console.error(`[SSE] Error writing to client for adminId ${adminId}:`, err.message);
      }
    }
  }
}

/**
 * Send an SSE event to ALL currently connected clients.
 * @param {string} event
 * @param {unknown} data
 */
export function broadcastAll(event, data) {
  const adminIds = Array.from(clients.keys());
  broadcast(adminIds, event, data);
}
