import type { Investigation } from '../../types';

interface InvestigationPanelProps {
  investigation: Investigation;
}

export function InvestigationPanel({ investigation }: InvestigationPanelProps) {
  const progress = investigation.status === 'completed' ? 100 :
                   investigation.status === 'correlating' ? 75 :
                   investigation.status === 'gathering_evidence' ? 50 :
                   investigation.status === 'analyzing' ? 25 : 0;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Investigation Progress
        </h3>
        <span className="text-sm text-gray-500">
          {investigation.status.replace(/_/g, ' ').toUpperCase()}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary-600 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-xs text-gray-500 mt-2">{progress}% Complete</p>
      </div>

      {/* Investigation Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center p-3 bg-blue-50 rounded-lg">
          <p className="text-2xl font-bold text-blue-600">
            {investigation.events.length}
          </p>
          <p className="text-xs text-gray-600">Events</p>
        </div>
        
        <div className="text-center p-3 bg-green-50 rounded-lg">
          <p className="text-2xl font-bold text-green-600">
            {investigation.toolCalls.filter(tc => tc.status === 'success').length}
          </p>
          <p className="text-xs text-gray-600">Tool Calls</p>
        </div>
        
        <div className="text-center p-3 bg-purple-50 rounded-lg">
          <p className="text-2xl font-bold text-purple-600">
            {investigation.findings.length}
          </p>
          <p className="text-xs text-gray-600">Findings</p>
        </div>
      </div>

      {/* Timeline */}
      {investigation.startTime && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            Started: {new Date(investigation.startTime).toLocaleTimeString()}
          </p>
          {investigation.endTime && (
            <p className="text-xs text-gray-500">
              Completed: {new Date(investigation.endTime).toLocaleTimeString()}
            </p>
          )}
        </div>
      )}
    </div>
  );
}