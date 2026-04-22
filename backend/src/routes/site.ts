import express from 'express';
import fs from 'fs/promises';
import path from 'path';

const router = express.Router();

// GET /api/site/layout - Get site layout and zones
router.get('/layout', async (req, res) => {
  try {
    const layoutData = await fs.readFile(
      path.join(__dirname, '../data/sitelayout.json'),
      'utf-8'
    );
    const layout = JSON.parse(layoutData);

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

export default router;
