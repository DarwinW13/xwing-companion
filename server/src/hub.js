// Server-sent-events clients, grouped by session code
const clients = new Map();   // code -> Set<res>

function subscribe(code, req, res, initialState) {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();
  res.write(`data: ${JSON.stringify(initialState)}\n\n`);   // sync joiner immediately
  if (!clients.has(code)) clients.set(code, new Set());
  clients.get(code).add(res);
  req.on('close', () => {
    const set = clients.get(code);
    if (!set) return;
    set.delete(res);
    if (set.size === 0) clients.delete(code);
  });
}

function broadcast(code, state) {
  const data = `data: ${JSON.stringify(state)}\n\n`;
  (clients.get(code) || []).forEach(res => res.write(data));
}

// Comment line every so often so proxies don't drop idle connections
function startKeepAlive(ms = 25000) {
  setInterval(() => clients.forEach(set => set.forEach(res => res.write(': ping\n\n'))), ms).unref();
}

module.exports = { subscribe, broadcast, startKeepAlive };
