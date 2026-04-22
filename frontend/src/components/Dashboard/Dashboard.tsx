import { useState } from 'react';
import type { Investigation } from '../../types';
import { EventTimeline } from './EventTimeline';
import { AgentActivity } from './AgentActivity';
import { FindingsPanel } from './FindingsPanel';

interface DashboardProps {
  investigation: Investigation;
}

export function Dashboard({ investigation }: DashboardProps) {
  const [expandedFinding, setExpandedFinding] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      {/* Status Banner */}
      <div className={`rounded-lg p-4 ${
        investigation.status === 'completed' 
          ? 'bg-green-50 border border-green-200' 
          : 'bg-blue-50 border border-blue-200'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {investigation.status === 'analyzing' && (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                <p className="text-blue-900 font-medium">AI is investigating overnight events...</p>
              </>
            )}
            {investigation.status === 'gathering_evidence' && (
              <>
                <div className="animate-pulse h-5 w-5 bg-blue-600 rounded-full"></div>
                <p className="text-blue-900 font-medium">Gathering evidence from security systems...</p>
              </>
            )}
            {investigation.status === 'correlating' && (
              <>
                <div className="animate-thinking h-5 w-5 bg-blue-600 rounded-full"></div>
                <p className="text-blue-900 font-medium">Correlating events and analyzing patterns...</p>
              </>
            )}
            {investigation.status === 'completed' && (
              <>
                <div className="h-5 w-5 text-green-600">✓</div>
                <p className="text-green-900 font-medium">Investigation complete - Ready for review</p>
              </>
            )}
          </div>
          
          <div className="text-sm text-gray-600">
            {investigation.thoughts.length} thoughts • {investigation.toolCalls.length} tool calls • {investigation.findings.length} findings
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Event Timeline */}
        <div className="lg:col-span-1">
          <EventTimeline events={investigation.events} />
        </div>

        {/* Middle: Agent Activity */}
        <div className="lg:col-span-1">
          <AgentActivity 
            thoughts={investigation.thoughts} 
            toolCalls={investigation.toolCalls}
            status={investigation.status}
          />
        </div>

        {/* Right: Findings */}
        <div className="lg:col-span-1">
          <FindingsPanel 
            findings={investigation.findings}
            expandedFinding={expandedFinding}
            onToggleFinding={setExpandedFinding}
          />
        </div>
      </div>
    </div>
  );
}