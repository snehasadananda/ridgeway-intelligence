// Mock Agent Engine - No API calls, simulates realistic AI behavior
// Perfect for demos and assessments - 100% FREE!

interface ToolCall {
  id: string;
  tool: string;
  timestamp: string;
  input: unknown;
  status: 'pending' | 'success' | 'error';
  output?: any;
  error?: string;
}

type Recommendation = 'escalate' | 'follow_up' | 'dismiss' | 'monitor';

export class MockAgentEngine {
  
  async investigate(investigationId: string, events: any[], investigations: Map<string, any>) {
    const investigation = investigations.get(investigationId);
    if (!investigation) return;

    try {
      // Simulate thinking time
      investigation.status = 'analyzing';
      this.broadcast(investigationId, {
        type: 'status',
        data: { status: 'analyzing' },
        timestamp: new Date().toISOString()
      });

      await this.sleep(1000);

      // Thought 1: Initial analysis
      const thought1 = {
        id: `thought_${Date.now()}_1`,
        timestamp: new Date().toISOString(),
        content: "Analyzing overnight events... I see 6 events between 1:23 AM and 3:45 AM. Let me investigate each one systematically.",
        type: 'reasoning'
      };
      investigation.thoughts.push(thought1);
      this.broadcast(investigationId, { type: 'thought', data: thought1, timestamp: new Date().toISOString() });

      await this.sleep(1500);

      // Thought 2: Badge pattern noticed
      const thought2 = {
        id: `thought_${Date.now()}_2`,
        timestamp: new Date().toISOString(),
        content: "I notice multiple badge access failures at Gate 3. Let me check the badge logs to see if this is the same person attempting access repeatedly.",
        type: 'observation'
      };
      investigation.thoughts.push(thought2);
      this.broadcast(investigationId, { type: 'thought', data: thought2, timestamp: new Date().toISOString() });

      await this.sleep(1000);

      // Tool Call 1: Check badge logs
      investigation.status = 'gathering_evidence';
      const toolCall1 = await this.executeToolCall(
        investigationId,
        investigation,
        'query_badge_logs',
        {
          access_point: 'Gate-3-Main',
          start_time: '2024-01-16T00:00:00Z',
          end_time: '2024-01-16T06:00:00Z'
        }
      );

      await this.sleep(2000);

      // Thought 3: Badge analysis
      const thought3 = {
        id: `thought_${Date.now()}_3`,
        timestamp: new Date().toISOString(),
        content: "The badge logs show that badge #BC-2847 (John Martinez, BuildRight Contractors) was denied access 3 times. The reason is 'expired credentials'. This correlates with the access failure events.",
        type: 'reasoning'
      };
      investigation.thoughts.push(thought3);
      this.broadcast(investigationId, { type: 'thought', data: thought3, timestamp: new Date().toISOString() });

      await this.sleep(1500);

      // Thought 4: Vehicle investigation
      const thought4 = {
        id: `thought_${Date.now()}_4`,
        timestamp: new Date().toISOString(),
        content: "I also see a vehicle movement event in Block C. Let me check if this vehicle is associated with the same contractor who had badge failures.",
        type: 'hypothesis'
      };
      investigation.thoughts.push(thought4);
      this.broadcast(investigationId, { type: 'thought', data: thought4, timestamp: new Date().toISOString() });

      await this.sleep(1000);

      // Tool Call 2: Check vehicle history
      const toolCall2 = await this.executeToolCall(
        investigationId,
        investigation,
        'get_vehicle_history',
        {
          zone: 'Block-C-Storage',
          start_time: '2024-01-16T00:00:00Z',
          end_time: '2024-01-16T06:00:00Z'
        }
      );

      await this.sleep(2000);

      // Thought 5: Correlation found
      const thought5 = {
        id: `thought_${Date.now()}_5`,
        timestamp: new Date().toISOString(),
        content: "Significant finding: Vehicle VEH-0342, registered to BuildRight Contractors, was in Block C (restricted zone) at the same time John Martinez was attempting badge access. This suggests he may have accessed the zone through an alternate route or was let in by someone else.",
        type: 'reasoning'
      };
      investigation.thoughts.push(thought5);
      this.broadcast(investigationId, { type: 'thought', data: thought5, timestamp: new Date().toISOString() });

      await this.sleep(1500);

      // Thought 6: Fence alert check
      const thought6 = {
        id: `thought_${Date.now()}_6`,
        timestamp: new Date().toISOString(),
        content: "There's also a fence alert at Gate 3. Let me verify if this was a genuine intrusion attempt or just environmental (wind, animals, etc.).",
        type: 'observation'
      };
      investigation.thoughts.push(thought6);
      this.broadcast(investigationId, { type: 'thought', data: thought6, timestamp: new Date().toISOString() });

      await this.sleep(1000);

      // Tool Call 3: Check fence sensors
      const toolCall3 = await this.executeToolCall(
        investigationId,
        investigation,
        'check_fence_sensors',
        {
          sensor_id: 'FENCE-G3-S7',
          start_time: '2024-01-16T01:00:00Z',
          end_time: '2024-01-16T02:00:00Z'
        }
      );

      await this.sleep(2000);

      // Thought 7: Fence assessment
      const thought7 = {
        id: `thought_${Date.now()}_7`,
        timestamp: new Date().toISOString(),
        content: "The fence sensor data shows moderate wind conditions (20-25 km/h) with a weak trigger strength (2.3/10). Combined with weather data, this appears to be environmental rather than a security threat.",
        type: 'reasoning'
      };
      investigation.thoughts.push(thought7);
      this.broadcast(investigationId, { type: 'thought', data: thought7, timestamp: new Date().toISOString() });

      await this.sleep(1500);

      // Thought 8: Recommend drone verification
      const thought8 = {
        id: `thought_${Date.now()}_8`,
        timestamp: new Date().toISOString(),
        content: "To verify the Block C situation, I recommend deploying a drone to check for any unauthorized access points or signs of intrusion in that area.",
        type: 'reasoning'
      };
      investigation.thoughts.push(thought8);
      this.broadcast(investigationId, { type: 'thought', data: thought8, timestamp: new Date().toISOString() });

      await this.sleep(1000);

      // Tool Call 4: Plan drone mission
      const toolCall4 = await this.executeToolCall(
        investigationId,
        investigation,
        'plan_drone_mission',
        {
          target_zone: 'Block-C-Storage',
          investigation_reason: 'Verify unauthorized vehicle access and check for entry points'
        }
      );

      await this.sleep(2000);

      // Correlating phase
      investigation.status = 'correlating';
      this.broadcast(investigationId, {
        type: 'status',
        data: { status: 'correlating' },
        timestamp: new Date().toISOString()
      });

      await this.sleep(1500);

      // Generate findings
      const findings = this.generateFindings(investigation);
      investigation.findings = findings;

      // Send each finding
      for (const finding of findings) {
        this.broadcast(investigationId, {
          type: 'finding',
          data: finding,
          timestamp: new Date().toISOString()
        });
        await this.sleep(800);
      }

      // Complete
      investigation.status = 'completed';
      investigation.endTime = new Date().toISOString();

      this.broadcast(investigationId, {
        type: 'complete',
        data: {
          findings: investigation.findings,
          status: 'completed'
        },
        timestamp: new Date().toISOString()
      });

    } catch (error: any) {
      investigation.status = 'error';
      investigation.error = error.message;

      this.broadcast(investigationId, {
        type: 'error',
        data: { error: error.message },
        timestamp: new Date().toISOString()
      });
    }
  }

  private async executeToolCall(
    investigationId: string,
    investigation: any,
    toolName: string,
    input: any
  ): Promise<ToolCall> {
    const toolCall: ToolCall = {
      id: `tc_${Date.now()}_${Math.random()}`,
      tool: toolName,
      timestamp: new Date().toISOString(),
      input: input,
      status: 'pending'
    };

    investigation.toolCalls.push(toolCall);

    this.broadcast(investigationId, {
      type: 'tool_call',
      data: toolCall,
      timestamp: new Date().toISOString()
    });

    await this.sleep(1000);

    // Simulate tool execution with realistic data
    const output = this.getMockToolOutput(toolName, input);
    toolCall.status = 'success';
    toolCall.output = output;

    return toolCall;
  }

  private getMockToolOutput(toolName: string, input: any): any {
    switch (toolName) {
      case 'query_badge_logs':
        return {
          access_point: input.access_point,
          time_range: { start: input.start_time, end: input.end_time },
          total_records: 3,
          records: [
            {
              timestamp: '2024-01-16T02:18:00Z',
              employeeId: 'EXT-1247',
              badgeId: 'BC-2847',
              accessPoint: 'Gate-3-Main',
              status: 'DENIED',
              reason: 'Expired credentials',
              employeeName: 'John Martinez',
              department: 'BuildRight Contractors'
            },
            {
              timestamp: '2024-01-16T02:45:00Z',
              employeeId: 'EXT-1247',
              badgeId: 'BC-2847',
              accessPoint: 'Block-C-Secondary',
              status: 'DENIED',
              reason: 'Expired credentials',
              employeeName: 'John Martinez',
              department: 'BuildRight Contractors'
            },
            {
              timestamp: '2024-01-16T03:12:00Z',
              employeeId: 'EXT-1247',
              badgeId: 'BC-2847',
              accessPoint: 'Gate-3-Main',
              status: 'DENIED',
              reason: 'Expired credentials',
              employeeName: 'John Martinez',
              department: 'BuildRight Contractors'
            }
          ]
        };

      case 'get_vehicle_history':
        return {
          zone: input.zone,
          time_range: { start: input.start_time, end: input.end_time },
          total_entries: 1,
          vehicles: 1,
          vehicle_paths: {
            'VEH-0342': [
              {
                vehicleId: 'VEH-0342',
                timestamp: '2024-01-16T02:30:00Z',
                location: { lat: 28.4598, lng: 77.0270 },
                zone: 'Block-C-Storage',
                speed: 15,
                metadata: {
                  registeredTo: 'BuildRight Contractors',
                  authorized: false,
                  zoneRestriction: 'Employees only'
                }
              }
            ]
          }
        };

      case 'check_fence_sensors':
        return {
          sensor_id: input.sensor_id,
          time_range: { start: input.start_time, end: input.end_time },
          total_alerts: 1,
          alerts: [
            {
              id: 'evt_fence_alert_1',
              timestamp: '2024-01-16T01:23:00Z',
              type: 'fence_alert',
              metadata: {
                sensorId: 'FENCE-G3-S7',
                triggerStrength: 2.3,
                weatherCondition: 'windy',
                windSpeed: '22 km/h'
              }
            }
          ],
          analysis: {
            likely_cause: 'Environmental (wind)',
            avg_trigger_strength: 2.3
          }
        };

      case 'plan_drone_mission':
        return {
          mission_id: `MISSION-${Date.now()}`,
          target_zone: input.target_zone,
          reason: input.investigation_reason,
          status: 'planned',
          route: [
            { lat: 28.4598, lng: 77.0270 },
            { lat: 28.4605, lng: 77.0275 },
            { lat: 28.4610, lng: 77.0270 },
            { lat: 28.4605, lng: 77.0265 },
            { lat: 28.4598, lng: 77.0270 }
          ],
          estimated_duration_minutes: 8,
          planned_altitude_meters: 50,
          simulated_findings: [
            'Vehicle observed parked near Block C Secondary Access',
            'No visible personnel in the area',
            'Building exterior shows no signs of forced entry',
            'Secondary access door appears closed and locked',
            'Recommend checking badge logs for this timeframe'
          ]
        };

      default:
        return { message: 'Tool executed successfully' };
    }
  }

  private generateFindings(investigation: any): any[] {
    const allToolCallIds = investigation.toolCalls.map((tc: any) => tc.id);

    return [
      {
        id: `finding_contractor_${Date.now()}`,
        title: 'Contractor with Expired Credentials Attempted Multiple Access',
        description: 'John Martinez (BuildRight Contractors, Badge BC-2847) attempted access 3 times with expired credentials at Gate 3 and Block C. His company vehicle (VEH-0342) was detected in restricted Block C storage area during the same timeframe.',
        severity: 'high',
        confidence: 95,
        recommendation: 'escalate' as Recommendation,
        relatedEvents: ['evt_002', 'evt_003', 'evt_004', 'evt_005'],
        evidence: {
          summary: 'Badge logs and vehicle history link the same contractor to repeated failed access attempts and unauthorized presence in Block C.',
          toolCalls: allToolCallIds,
          details: {
            actions: [
              'Contact BuildRight Contractors to verify authorization',
              'Review Block C access logs to determine how the vehicle entered',
              'Renew or revoke badge credentials',
              'Review contractor access controls for alternate entry paths'
            ],
            toolOutputs: investigation.toolCalls.map((tc: any) => ({
              tool: tc.tool,
              output: tc.output
            }))
          }
        },
        userStatus: 'pending'
      },
      {
        id: `finding_fence_${Date.now()}`,
        title: 'Fence Alert - Environmental (Low Priority)',
        description: 'Fence sensor FENCE-G3-S7 triggered at 1:23 AM. Analysis shows low trigger strength (2.3/10) with moderate wind conditions (20-25 km/h), indicating environmental cause rather than security breach.',
        severity: 'low',
        confidence: 88,
        recommendation: 'dismiss' as Recommendation,
        relatedEvents: ['evt_001'],
        evidence: {
          summary: 'Fence sensor telemetry and weather conditions both point to wind as the likely trigger rather than a physical intrusion.',
          toolCalls: allToolCallIds.filter((id: string, index: number) => investigation.toolCalls[index]?.tool === 'check_fence_sensors'),
          details: {
            triggerStrength: 2.3,
            likelyCause: 'Environmental (wind)'
          }
        },
        userStatus: 'pending'
      },
      {
        id: `finding_drone_${Date.now()}`,
        title: 'Drone Verification Completed - No Physical Breach',
        description: 'Drone patrol of Block C area confirms vehicle presence but no signs of forced entry, personnel activity, or security compromise. All access points appear secure.',
        severity: 'medium',
        confidence: 82,
        recommendation: 'follow_up' as Recommendation,
        relatedEvents: ['evt_003', 'evt_006'],
        evidence: {
          summary: 'The drone mission found no active breach, but it confirmed the restricted-zone context and supports a follow-up review of access authorization.',
          toolCalls: allToolCallIds.filter((id: string, index: number) => investigation.toolCalls[index]?.tool === 'plan_drone_mission'),
          details: {
            nextSteps: [
              'Validate whether the vehicle had a temporary exception',
              'Cross-check contractor schedules against overnight activity',
              'Review any manual overrides on Block C entry points'
            ]
          }
        },
        userStatus: 'pending'
      }
    ];
  }

  private broadcast(investigationId: string, message: any) {
    try {
      const wss = (global as any).wss;
      if (!wss) return;

      wss.clients.forEach((client: any) => {
        if (client.readyState === 1) {
          client.send(JSON.stringify({
            investigationId,
            ...message
          }));
        }
      });
    } catch (error) {
      console.error('Broadcast error:', error);
    }
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
