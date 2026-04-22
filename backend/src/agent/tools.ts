import type { Tool } from '@anthropic-ai/sdk/resources/messages';

// Agent tool definitions - these are passed to Claude API

export const AGENT_TOOLS: Tool[] = [
  {
    name: 'query_badge_logs',
    description: 'Query badge access logs for a specific access point and time range. Returns all badge swipe attempts including granted and denied access.',
    input_schema: {
      type: 'object',
      properties: {
        access_point: {
          type: 'string',
          description: 'Access point ID (e.g., "Gate-3-Main", "Block-C-Storage")'
        },
        start_time: {
          type: 'string',
          description: 'Start time in ISO format (e.g., "2024-01-16T00:00:00Z")'
        },
        end_time: {
          type: 'string',
          description: 'End time in ISO format (e.g., "2024-01-16T06:00:00Z")'
        }
      },
      required: ['access_point', 'start_time', 'end_time']
    }
  },
  {
    name: 'get_vehicle_history',
    description: 'Retrieve vehicle movement history for a specific zone and time range. Shows vehicle paths, speeds, and authorization status.',
    input_schema: {
      type: 'object',
      properties: {
        zone: {
          type: 'string',
          description: 'Zone name (e.g., "Block-C-Storage", "Gate-3-Entrance")'
        },
        start_time: {
          type: 'string',
          description: 'Start time in ISO format'
        },
        end_time: {
          type: 'string',
          description: 'End time in ISO format'
        }
      },
      required: ['zone', 'start_time', 'end_time']
    }
  },
  {
    name: 'check_fence_sensors',
    description: 'Check fence sensor data for alerts and environmental conditions. Returns sensor readings, trigger strength, and weather data.',
    input_schema: {
      type: 'object',
      properties: {
        sensor_id: {
          type: 'string',
          description: 'Fence sensor ID (e.g., "FENCE-G3-S7")'
        },
        start_time: {
          type: 'string',
          description: 'Start time in ISO format'
        },
        end_time: {
          type: 'string',
          description: 'End time in ISO format'
        }
      },
      required: ['sensor_id', 'start_time', 'end_time']
    }
  },
  {
    name: 'plan_drone_mission',
    description: 'Plan and simulate a drone patrol mission to investigate a specific zone. Returns planned route, estimated duration, and simulated findings.',
    input_schema: {
      type: 'object',
      properties: {
        target_zone: {
          type: 'string',
          description: 'Zone to patrol (e.g., "Block-C-Storage", "Perimeter-East")'
        },
        investigation_reason: {
          type: 'string',
          description: 'Reason for the patrol (e.g., "Verify vehicle activity", "Check fence alert")'
        }
      },
      required: ['target_zone', 'investigation_reason']
    }
  }
];
