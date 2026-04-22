import { useState } from 'react';
import type { Finding } from '../../types';

interface FindingsPanelProps {
  findings: Finding[];
  expandedFinding: string | null;
  onToggleFinding: (id: string | null) => void;
}

const severityColors = {
  low: 'bg-gray-100 text-gray-800 border-gray-300',
  medium: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  high: 'bg-orange-100 text-orange-800 border-orange-300',
  critical: 'bg-red-100 text-red-800 border-red-300',
};

const recommendationLabels = {
  escalate: '🚨 Escalate',
  monitor: '👁️ Monitor',
  dismiss: '✓ Dismiss',
  follow_up: '📋 Follow Up',
};

export function FindingsPanel({ findings, expandedFinding, onToggleFinding }: FindingsPanelProps) {
  const [localFindings, setLocalFindings] = useState(findings);

  const handleUpdateFinding = async (findingId: string, updates: Partial<Finding>) => {
    try {
      setLocalFindings(prev =>
        prev.map(f => f.id === findingId ? { ...f, ...updates } : f)
      );
    } catch (error) {
      console.error('Failed to update finding:', error);
    }
  };

  const currentFindings = localFindings.length > 0 ? localFindings : findings;

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        🎯 Findings ({currentFindings.length})
      </h3>

      {currentFindings.length === 0 && (
        <div className="text-center py-8 text-gray-400">
          <p>No findings yet. Agent is still analyzing...</p>
        </div>
      )}

      <div className="space-y-3 max-h-[600px] overflow-y-auto">
        {currentFindings.map((finding) => (
          <div
            key={finding.id}
            className="border border-gray-200 rounded-lg overflow-hidden"
          >
            <div
              className="p-3 cursor-pointer hover:bg-gray-50"
              onClick={() => onToggleFinding(
                expandedFinding === finding.id ? null : finding.id
              )}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className={`px-2 py-0.5 text-xs font-medium rounded ${
                      severityColors[finding.severity]
                    }`}>
                      {finding.severity}
                    </span>
                    <span className="text-xs text-gray-500">
                      {finding.confidence}% confidence
                    </span>
                  </div>
                  
                  <h4 className="text-sm font-semibold text-gray-900">
                    {finding.title}
                  </h4>
                  
                  <p className="text-xs text-gray-600 mt-1">
                    {finding.description}
                  </p>
                </div>
                
                <button className="text-gray-400 hover:text-gray-600">
                  {expandedFinding === finding.id ? '▼' : '▶'}
                </button>
              </div>

              <div className="mt-2 flex items-center space-x-2">
                <span className="text-xs font-medium text-gray-700">
                  {recommendationLabels[finding.recommendation as keyof typeof recommendationLabels] ?? finding.recommendation}
                </span>
                
                {finding.userStatus && (
                  <span className={`px-2 py-0.5 text-xs rounded ${
                    finding.userStatus === 'confirmed' 
                      ? 'bg-green-100 text-green-800'
                      : finding.userStatus === 'rejected'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {finding.userStatus}
                  </span>
                )}
              </div>
            </div>

            {expandedFinding === finding.id && (
              <div className="border-t border-gray-200 p-3 bg-gray-50 animate-slide-in-right">
                <div className="space-y-3">
                  {/* Evidence */}
                  <div>
                    <h5 className="text-xs font-semibold text-gray-700 mb-1">
                      Evidence Summary
                    </h5>
                    <p className="text-xs text-gray-600">
                      {finding.evidence.summary}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Based on {finding.evidence.toolCalls.length} tool call(s)
                    </p>
                  </div>

                  {/* Related Events */}
                  <div>
                    <h5 className="text-xs font-semibold text-gray-700 mb-1">
                      Related Events
                    </h5>
                    <div className="flex flex-wrap gap-1">
                      {finding.relatedEvents.map(eventId => (
                        <span
                          key={eventId}
                          className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded"
                        >
                          {eventId}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Human Review Actions */}
                  <div className="pt-2 border-t border-gray-300">
                    <h5 className="text-xs font-semibold text-gray-700 mb-2">
                      Your Review
                    </h5>
                    
                    <div className="grid grid-cols-3 gap-2 mb-2">
                      <button
                        onClick={() => handleUpdateFinding(finding.id, { 
                          userStatus: 'confirmed' 
                        })}
                        className={`px-2 py-1 text-xs rounded ${
                          finding.userStatus === 'confirmed'
                            ? 'bg-green-600 text-white'
                            : 'bg-green-100 text-green-800 hover:bg-green-200'
                        }`}
                      >
                        ✓ Confirm
                      </button>
                      
                      <button
                        onClick={() => handleUpdateFinding(finding.id, { 
                          userStatus: 'modified' 
                        })}
                        className={`px-2 py-1 text-xs rounded ${
                          finding.userStatus === 'modified'
                            ? 'bg-blue-600 text-white'
                            : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                        }`}
                      >
                        ✎ Modify
                      </button>
                      
                      <button
                        onClick={() => handleUpdateFinding(finding.id, { 
                          userStatus: 'rejected' 
                        })}
                        className={`px-2 py-1 text-xs rounded ${
                          finding.userStatus === 'rejected'
                            ? 'bg-red-600 text-white'
                            : 'bg-red-100 text-red-800 hover:bg-red-200'
                        }`}
                      >
                        ✗ Reject
                      </button>
                    </div>

                    <textarea
                      placeholder="Add your notes..."
                      className="w-full px-2 py-1 text-xs border border-gray-300 rounded resize-none focus:outline-none focus:ring-2 focus:ring-primary-500"
                      rows={2}
                      value={finding.userNotes || ''}
                      onChange={(e) => handleUpdateFinding(finding.id, {
                        userNotes: e.target.value
                      })}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
