import express from 'express';
import { mcpServer } from '../mcp/MCPServer';

const router = express.Router();

// POST /api/drone/plan-mission - Plan a drone mission
router.post('/plan-mission', async (req, res) => {
  try {
    const { targetZone, investigationReason } = req.body;

    const mission = await mcpServer.executeTool('plan_drone_mission', {
      target_zone: targetZone,
      investigation_reason: investigationReason || 'Routine patrol'
    });

    res.json({
      success: true,
      data: mission,
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
