import { Tool } from "@anthropic-ai/sdk/resources/messages";
export { mcpServer } from './MCPServer';
export { queryBadgeLogs } from './tools/badgeLog';
export { getVehicleHistory } from './tools/vehicleTracker';
export { checkFenceSensors } from './tools/fenceSensor';
export { planDroneMission } from './tools/dronePlanner';

// Tool definitions for AI
export const AGENT_TOOLS: Tool[] = [
  {
    name: "query_badge_logs",
    description: "Check badge access records for a given access point and time range",
    input_schema: {
      type: "object",
      properties: {
        access_point: {
          type: "string",
          description: "Access point ID"
        },
        start_time: {
          type: "string",
          description: "Start time (ISO format)"
        },
        end_time: {
          type: "string",
          description: "End time (ISO format)"
        }
      },
      required: ["access_point"]
    }
  },
  {
    name: "get_vehicle_history",
    description: "Track vehicle movement history in a zone",
    input_schema: {
      type: "object",
      properties: {
        zone: {
          type: "string",
          description: "Zone name (e.g., Block C)"
        }
      },
      required: ["zone"]
    }
  },
  {
    name: "check_fence_sensors",
    description: "Analyze fence sensor alerts",
    input_schema: {
      type: "object",
      properties: {
        sensor_id: {
          type: "string",
          description: "Fence sensor ID"
        }
      },
      required: ["sensor_id"]
    }
  },
  {
    name: "plan_drone_mission",
    description: "Plan a drone patrol mission for investigation",
    input_schema: {
      type: "object",
      properties: {
        target_zone: {
          type: "string",
          description: "Zone to investigate"
        },
        investigation_reason: {
          type: "string",
          description: "Reason for drone mission"
        }
      },
      required: ["target_zone"]
    }
  }
];