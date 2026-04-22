export type Severity = 'low' | 'medium' | 'high' | 'critical';

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface LocationReference {
  name: string;
  coordinates: Coordinates;
}

export interface SiteEvent {
  id: string;
  type:
    | 'fence_alert'
    | 'badge_failure'
    | 'vehicle_movement'
    | 'drone_patrol'
    | 'camera_offline'
    | string;
  description: string;
  severity: Severity;
  timestamp: string;
  location: LocationReference;
  metadata?: Record<string, unknown>;
}

export interface Thought {
  id: string;
  timestamp: string;
  content: string;
  type?: string;
}

export interface ToolCall {
  id: string;
  tool: string;
  timestamp: string;
  input: unknown;
  status: 'pending' | 'success' | 'error';
  output?: any;
  error?: string;
}

export interface FindingEvidence {
  summary: string;
  toolCalls: string[];
  details?: unknown;
}

export interface Finding {
  id: string;
  title: string;
  description: string;
  severity: Severity;
  confidence: number;
  recommendation: 'escalate' | 'monitor' | 'dismiss' | 'follow_up';
  relatedEvents: string[];
  evidence: FindingEvidence;
  userStatus?: 'pending' | 'confirmed' | 'modified' | 'rejected';
  userNotes?: string;
}

export interface Investigation {
  id: string;
  status: 'idle' | 'analyzing' | 'gathering_evidence' | 'correlating' | 'completed' | 'error';
  startTime?: string;
  endTime?: string;
  error?: string;
  events: SiteEvent[];
  thoughts: Thought[];
  toolCalls: ToolCall[];
  findings: Finding[];
}

export interface BriefingFinding {
  id: string;
  title: string;
  description: string;
  severity: Severity;
  confidence: number;
}

export interface BriefingActionItem {
  description: string;
  priority: 'low' | 'medium' | 'high';
}

export interface Briefing {
  id: string;
  timestamp: string;
  summary: string;
  keyFindings: BriefingFinding[];
  actionItems?: BriefingActionItem[];
  recommendation: string;
}

export interface SiteZone {
  id: string;
  name: string;
  accessLevel: 'public' | 'restricted' | 'high_security' | string;
  polygon: Coordinates[];
}

export interface SiteAsset {
  id: string;
  name: string;
  type: 'access_point' | 'camera' | 'sensor' | 'building' | string;
  coordinates: Coordinates;
}

export interface SiteLayout {
  center: Coordinates;
  zones: SiteZone[];
  assets: SiteAsset[];
}

export interface DronePatrol {
  id: string;
  targetZone: string;
  route: Coordinates[];
  status: 'planned' | 'in_progress' | 'completed' | 'failed';
  findings?: string[];
}

export interface StreamMessage {
  investigationId?: string;
  type: 'status' | 'thought' | 'tool_call' | 'finding' | 'complete' | 'error';
  data: any;
  timestamp: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: string;
}
