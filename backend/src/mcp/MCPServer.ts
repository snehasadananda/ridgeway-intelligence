import { queryBadgeLogs } from './tools/badgeLog';
import { getVehicleHistory } from './tools/vehicleTracker';
import { checkFenceSensors } from './tools/fenceSensor';
import { planDroneMission } from './tools/dronePlanner';

// MCP Server - coordinates all security tools

export class MCPServer {
  async executeTool(toolName: string, input: any) {
    switch (toolName) {
      case 'query_badge_logs':
        return await queryBadgeLogs(input);
      case 'get_vehicle_history':
        return await getVehicleHistory(input);
      case 'check_fence_sensors':
        return await checkFenceSensors(input);
      case 'plan_drone_mission':
        return await planDroneMission(input);
      default:
        throw new Error(`Unknown tool: ${toolName}`);
    }
  }

  getAvailableTools() {
    return [
      'query_badge_logs',
      'get_vehicle_history',
      'check_fence_sensors',
      'plan_drone_mission'
    ];
  }
}

export const mcpServer = new MCPServer();