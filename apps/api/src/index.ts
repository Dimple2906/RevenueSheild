import { createServer } from './server.js';
import dotenv from 'dotenv';

dotenv.config();

const PORT = Number(process.env.PORT) || 4000;
const app = createServer();

app.listen(PORT, () => {
  console.log(`
🛡️  ============================================================
🛡️   RevenueShield AI OS — Backend API Server
🛡️   Listening on: http://localhost:${PORT}
🛡️   API Base:     http://localhost:${PORT}/api
🛡️   Health check: http://localhost:${PORT}/api/health
🛡️  ============================================================
  `);
});
