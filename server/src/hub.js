// Server-sent-events client registry
const clients = new Set();

function subscribe(req, res, initialState) {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();
  res.write(`data: ${JSON.stringify(initialState)}\n\n`);   // sync joiner immediately
  clients.add(res);
  req.on('close', () => clients.delete(res));
}

function broadcast(state) {
  const data = `data: ${JSON.stringify(state)}\n\n`;
  clients.forEach(res => res.write(data));
}

module.exports = { subscribe, broadcast };
