// Entry point (cPanel "Application startup file"). Logic lives in src/.
const app = require('./src/app');
const { PORT } = require('./src/config');

app.listen(PORT, () => console.log(`X-Wing sync server running on port ${PORT}`));
