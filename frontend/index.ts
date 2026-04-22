// Core data types for Ridgeway Intelligence Platform

export interface Coordinates {
  lat: number;
  lng: number;
}

export type EventType = 'fence_alert' | 'vehicle_movement' | 'badge_failure' | 'drone_patrol' | 'camera_offline';
export type EventSeverity = 'low' | 'medium' | 'high' | 'critical';
export type EventStatus = 'open' | 'investigating' | 'resolved' | 'dismissed' | 'escalated';

export interface SiteEvent {
  id: string;
  type: EventType;
  timestamp: string;
  location: {
    name: string;
    coordinates: Coordinates;
    zone: string;
  };
  severity: EventSeverity;
  status: EventStatus;
  description: string;
  metadata?: Record<string, any>;
}

export interface BadgeLog {
  timestamp: string;
  employeeId: string;
  badgeId: string;
  accessPoint: string;
  status: 'GRANTED' | 'DENIED';
  reason?: string;
  employeeName: string;
  department?: string;
}

export interface VehicleHistory {
  vehicleId: string;
  timestamp: string;
  location: Coordinates;
  zone: string;
  speed?: number;
  direction?: number;
}

export interface DronePatrol {
  id: string;
  timestamp: string;
  route: Coordinates[];
  targetZone: string;
  status: 'planned' | 'in_progress' | 'completed';
  findings?: string[];
  duration?: number;
}

export interface Zone {
  id: string;
  name: string;
  type: 'entrance' | 'storage' | 'work_area' | 'restricted' | 'perimeter';
  accessLevel?: 'public' | 'restricted' | 'high_security';
  polygon: Coordinates[];
}

export interface SiteAsset {
  id: string;
  type: 'access_point' | 'camera' | 'sensor' | 'building';
  name: string;
  coordinates: Coordinates;
  status?: 'online' | 'offline' | 'maintenance';
}

export interface SiteLayout {
  siteName: string;
  center: Coordinates;
  zones: Zone[];
  assets: SiteAsset[];
}

// Agent & AI types
export type ToolName = 'query_badge_logs' | 'get_vehicle_history' | 'check_fence_sensors' | 'plan_drone_mission';

export interface ToolCall {
  id: string;
  tool: ToolName;
  timestamp: string;
  input: Record<string, any>;
  output?: any;
  status: 'pending' | 'success' | 'error';
  error?: string;
}

export interface AgentThought {
  id: string;
  timestamp: string;
  content: string;
  type: 'reasoning' | 'observation' | 'hypothesis' | 'conclusion';
}

export interface Investigation {
  id: string;
  status: 'idle' | 'analyzing' | 'gathering_evidence' | 'correlating' | 'completed';
  startTime: string;
  endTime?: string;
  events: SiteEvent[];
  toolCalls: ToolCall[];
  thoughts: AgentThought[];
  findings: Finding[];
}

export interface Finding {
  id: string;
  title: string;
  description: string;
  severity: EventSeverity;
  confidence: number; // 0-100
  relatedEvents: string[]; // Event IDs
  recommendation: 'escalate' | 'monitor' | 'dismiss' | 'follow_up';
  evidence: {
    toolCalls: string[]; // ToolCall IDs
    summary: string;
  };
  userStatus?: 'pending' | 'confirmed' | 'rejected' | 'modified';
  userNotes?: string;
}

export interface Briefing {
  id: string;
  timestamp: string;
  summary: string;
  keyFindings: Finding[];
  timeline: {
    time: string;
    event: string;
  }[];
  actionItems: {
    priority: 'high' | 'medium' | 'low';
    description: string;
    assignee?: string;
  }[];
  recommendation: string;
}

// API response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: string;
}

export interface StreamMessage {
  type: 'thought' | 'tool_call' | 'finding' | 'status' | 'complete' | 'error';
  data: any;
  timestamp: string;
}