import express from 'express';
import { dataService } from '../services/dataService';

const router = express.Router();

// GET /api/map/layout - Get site layout and zones
router.get('/layout', async (req, res) => {
  try {
    const layout = await dataService.getSiteLayout();
    
    res.json({
      success: true,
      data: layout,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// GET /api/map/events - Get events with location data
router.get('/events', async (req, res) => {
  try {
    const events = await dataService.getEvents();
    
    res.json({
      success: true,
      data: events,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

export default router;