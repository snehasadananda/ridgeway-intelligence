import express from 'express';
import { MockAgentEngine } from '../agent/MockAgentEngine';
import fs from 'fs/promises';
import path from 'path';

const router = express.Router();
const agentEngine = new MockAgentEngine();

// Store active investigations (in production, use a database)
const investigations = new Map<string, any>();

// POST /api/investigation/start - Start a new investigation
router.post('/start', async (req, res) => {
  try {
    // Load overnight events
    const eventsData = await fs.readFile(
      path.join(__dirname, '../data/events.json'),
      'utf-8'
    );
    const { events } = JSON.parse(eventsData);

    // Create investigation
    const investigation = {
      id: `inv_${Date.now()}`,
      status: 'analyzing',
      startTime: new Date().toISOString(),
      events,
      toolCalls: [],
      thoughts: [],
      findings: []
    };

    investigations.set(investigation.id, investigation);

    // Start agent analysis (async)
    agentEngine.investigate(investigation.id, events, investigations)
      .catch(error => {
        console.error('Investigation error:', error);
        const inv = investigations.get(investigation.id);
        if (inv) {
          inv.status = 'error';
          inv.error = error.message;
        }
      });

    res.json({
      success: true,
      data: investigation,
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

// GET /api/investigation/:id - Get investigation status
router.get('/:id', async (req, res) => {
  try {
    const investigation = investigations.get(req.params.id);
    
    if (!investigation) {
      return res.status(404).json({
        success: false,
        error: 'Investigation not found',
        timestamp: new Date().toISOString()
      });
    }

    res.json({
      success: true,
      data: investigation,
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

// PATCH /api/investigation/:id/findings/:findingId - Update a finding
router.patch('/:id/findings/:findingId', async (req, res) => {
  try {
    const investigation = investigations.get(req.params.id);
    
    if (!investigation) {
      return res.status(404).json({
        success: false,
        error: 'Investigation not found',
        timestamp: new Date().toISOString()
      });
    }

    const finding = investigation.findings.find((f: any) => f.id === req.params.findingId);
    
    if (!finding) {
      return res.status(404).json({
        success: false,
        error: 'Finding not found',
        timestamp: new Date().toISOString()
      });
    }

    // Update finding with user input
    Object.assign(finding, req.body);

    res.json({
      success: true,
      data: finding,
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
