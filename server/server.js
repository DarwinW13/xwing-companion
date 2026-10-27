// Entry point (cPanel "Application startup file"). Logic lives in src/.
const app = require('./src/app');
const { PORT } = require('./src/config');
const { cleanupExpired } = require('./src/store');
const { startKeepAlive } = require('./src/hub');

cleanupExpired();
setInterval(cleanupExpired, 60 * 60 * 1000).unref();   // hourly
startKeepAlive();

app.listen(PORT, () => console.log(`X-Wing sync server running on port ${PORT}`));
