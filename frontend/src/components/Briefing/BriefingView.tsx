import { useState } from 'react';
import type { Briefing, Investigation } from '../../types';
import { ExportOptions } from './ExportOptions';

interface BriefingViewProps {
  investigation: Investigation;
}

export function BriefingView({ investigation }: BriefingViewProps) {
  const [editableContent, setEditableContent] = useState({
    executiveSummary: '',
    keyPoints: [] as string[],
    recommendations: ''
  });

  const confirmedFindings = investigation.findings.filter(
    (f) => f.userStatus === 'confirmed' || f.userStatus === 'modified'
  );

  const escalations = confirmedFindings.filter(
    (f) => f.recommendation === 'escalate'
  );

  const followUps = confirmedFindings.filter(
    (f) => f.recommendation === 'follow_up'
  );

  const dismissed = investigation.findings.filter(
    (f) => f.userStatus === 'rejected' || f.recommendation === 'dismiss'
  );

  const generateBriefing = () => {
    const summary = `Overnight investigation reviewed ${investigation.events.length} events. AI analysis identified ${investigation.findings.length} findings, with ${confirmedFindings.length} confirmed by operations. ${escalations.length} items require immediate escalation, ${followUps.length} need follow-up.`;

    const points = [
      ...escalations.map((f) => `[Escalate] ${f.title}: ${f.description}`),
      ...followUps.map((f) => `[Follow Up] ${f.title}: ${f.description}`)
    ];

    setEditableContent({
      executiveSummary: summary,
      keyPoints: points,
      recommendations: escalations.length > 0
        ? 'Immediate escalation required for contractor access violations.'
        : 'Continue routine monitoring. No critical issues identified.'
    });
  };

  const briefing: Briefing | null = editableContent.executiveSummary
    ? {
        id: `briefing-${investigation.id}`,
        timestamp: new Date().toISOString(),
        summary: editableContent.executiveSummary,
        keyFindings: confirmedFindings.map((finding) => ({
          id: finding.id,
          title: finding.title,
          description: finding.description,
          severity: finding.severity,
          confidence: finding.confidence
        })),
        actionItems: [
          ...escalations.map((finding) => ({
            priority: 'high' as const,
            description: `Escalate: ${finding.title}`
          })),
          ...followUps.map((finding) => ({
            priority: 'medium' as const,
            description: `Follow up: ${finding.title}`
          }))
        ],
        recommendation: editableContent.recommendations
      }
    : null;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Morning Briefing - January 16, 2024
            </h2>
            <p className="text-gray-600 mt-1">
              Prepared at 6:10 AM for 8:00 AM Leadership Review
            </p>
          </div>

          <button
            onClick={generateBriefing}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium"
          >
            Generate Briefing
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Executive Summary
        </h3>

        {editableContent.executiveSummary ? (
          <textarea
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            rows={4}
            value={editableContent.executiveSummary}
            onChange={(e) => setEditableContent((prev) => ({
              ...prev,
              executiveSummary: e.target.value
            }))}
          />
        ) : (
          <p className="text-gray-500 italic">
            Click "Generate Briefing" to create executive summary
          </p>
        )}
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">Total Events</p>
          <p className="text-3xl font-bold text-gray-900">{investigation.events.length}</p>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">Findings</p>
          <p className="text-3xl font-bold text-blue-600">{investigation.findings.length}</p>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">Escalations</p>
          <p className="text-3xl font-bold text-red-600">{escalations.length}</p>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">Dismissed</p>
          <p className="text-3xl font-bold text-gray-400">{dismissed.length}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Event Timeline
        </h3>

        <div className="space-y-2">
          {investigation.events
            .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
            .map((event) => (
              <div key={event.id} className="flex items-center space-x-4 py-2 border-b border-gray-100">
                <span className="text-sm font-mono text-gray-500 w-20">
                  {new Date(event.timestamp).toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
                <span className="text-2xl">
                  {event.type === 'fence_alert'
                    ? 'F'
                    : event.type === 'badge_failure'
                    ? 'B'
                    : event.type === 'vehicle_movement'
                    ? 'V'
                    : event.type === 'drone_patrol'
                    ? 'D'
                    : 'E'}
                </span>
                <span className="text-sm text-gray-700 flex-1">
                  {event.description} - {event.location.name}
                </span>
                <span className={`px-2 py-1 text-xs font-medium rounded ${
                  event.severity === 'high' || event.severity === 'critical'
                    ? 'bg-red-100 text-red-800'
                    : event.severity === 'medium'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {event.severity}
                </span>
              </div>
            ))}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Key Findings & Recommendations
        </h3>

        {confirmedFindings.length > 0 ? (
          <div className="space-y-4">
            {confirmedFindings.map((finding) => (
              <div key={finding.id} className="border-l-4 border-blue-500 pl-4 py-2">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{finding.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">{finding.description}</p>
                    <p className="text-xs text-gray-500 mt-2">
                      {finding.evidence.summary}
                    </p>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded ml-4 ${
                    finding.recommendation === 'escalate'
                      ? 'bg-red-100 text-red-800'
                      : finding.recommendation === 'follow_up'
                      ? 'bg-orange-100 text-orange-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {finding.recommendation}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 italic">
            No confirmed findings. Review findings in the Investigation tab.
          </p>
        )}
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Recommendations
        </h3>

        {editableContent.recommendations ? (
          <textarea
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            rows={3}
            value={editableContent.recommendations}
            onChange={(e) => setEditableContent((prev) => ({
              ...prev,
              recommendations: e.target.value
            }))}
          />
        ) : (
          <p className="text-gray-500 italic">
            Click "Generate Briefing" to create recommendations
          </p>
        )}
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Export Briefing
        </h3>
        <ExportOptions briefing={briefing} />
      </div>
    </div>
  );
}
