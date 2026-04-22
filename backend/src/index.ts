import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { WebSocketServer } from 'ws';
import http from 'http';

// Load environment variables
dotenv.config();

// Import routes
import investigationRoutes from './routes/investigation';
import briefingRoutes from './routes/briefing';
import siteRoutes from './routes/site';
import droneRoutes from './routes/drone';
import mapRoutes from './routes/map';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    service: 'Ridgeway Intelligence API'
  });
});

// API Routes
app.use('/api/investigation', investigationRoutes);
app.use('/api/briefing', briefingRoutes);
app.use('/api/site', siteRoutes);
app.use('/api/drone', droneRoutes);
app.use('/api/map', mapRoutes);

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    error: err.message || 'Internal server error',
    timestamp: new Date().toISOString()
  });
});

// Create HTTP server
const server = http.createServer(app);

// WebSocket server
const wss = new WebSocketServer({ server, path: '/ws' });

// Make wss globally accessible
(global as any).wss = wss;

wss.on('connection', (ws: any, req: any) => {
  console.log('WebSocket client connected');

  ws.on('message', (message: any) => {
    console.log('Received:', message.toString());
  });

  ws.on('close', () => {
    console.log('WebSocket client disconnected');
  });

  ws.on('error', (error: any) => {
    console.error('WebSocket error:', error);
  });

  // Send initial connection message
  ws.send(JSON.stringify({
    type: 'connected',
    timestamp: new Date().toISOString()
  }));
});

// Export WebSocket server
export { wss };

// Start server
server.listen(PORT, () => {
  console.log(`🚀 Ridgeway Intelligence API running on port ${PORT}`);
  console.log(`📡 WebSocket server ready at ws://localhost:${PORT}/ws`);
  console.log(`🏥 Health check: http://localhost:${PORT}/health`);
});

export default app;