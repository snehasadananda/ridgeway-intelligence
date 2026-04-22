import express from 'express';
const router = express.Router();

// Placeholder - will implement briefing generation with Claude API
router.post('/generate', async (req, res) => {
  res.json({
    success: true,
    data: { message: 'Briefing generation coming soon' },
    timestamp: new Date().toISOString()
  });
});

export default router;