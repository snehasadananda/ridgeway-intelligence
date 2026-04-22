import { useState } from 'react';
import type { Briefing } from '../../types';

interface BriefingEditorProps {
  briefing: Briefing | null;
  onUpdate: (updates: Partial<Briefing>) => void;
}

export function BriefingEditor({ briefing, onUpdate }: BriefingEditorProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState({
    summary: briefing?.summary || '',
    recommendation: briefing?.recommendation || ''
  });

  const handleSave = () => {
    onUpdate(editedContent);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedContent({
      summary: briefing?.summary || '',
      recommendation: briefing?.recommendation || ''
    });
    setIsEditing(false);
  };

  if (!briefing) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-500 text-center">
          No briefing generated yet. Complete investigation first.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-gray-900">
              Morning Briefing
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              {new Date(briefing.timestamp).toLocaleString()}
            </p>
          </div>
          
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium"
            >
              ✏️ Edit
            </button>
          ) : (
            <div className="flex space-x-2">
              <button
                onClick={handleCancel}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
              >
                💾 Save
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Executive Summary */}
      <div className="p-6 border-b border-gray-200">
        <h4 className="font-semibold text-gray-900 mb-3">Executive Summary</h4>
        {isEditing ? (
          <textarea
            value={editedContent.summary}
            onChange={(e) => setEditedContent(prev => ({
              ...prev,
              summary: e.target.value
            }))}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            rows={6}
          />
        ) : (
          <p className="text-gray-700 whitespace-pre-wrap">
            {briefing.summary}
          </p>
        )}
      </div>

      {/* Key Findings */}
      <div className="p-6 border-b border-gray-200">
        <h4 className="font-semibold text-gray-900 mb-3">
          Key Findings ({briefing.keyFindings.length})
        </h4>
        <div className="space-y-3">
          {briefing.keyFindings.map((finding) => (
            <div key={finding.id} className="border-l-4 border-blue-500 pl-4 py-2">
              <p className="font-medium text-gray-900">{finding.title}</p>
              <p className="text-sm text-gray-600 mt-1">{finding.description}</p>
              <div className="flex items-center space-x-2 mt-2">
                <span className={`px-2 py-1 text-xs font-medium rounded ${
                  finding.severity === 'critical' || finding.severity === 'high'
                    ? 'bg-red-100 text-red-800'
                    : finding.severity === 'medium'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {finding.severity}
                </span>
                <span className="text-xs text-gray-500">
                  {finding.confidence}% confidence
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Items */}
      {briefing.actionItems && briefing.actionItems.length > 0 && (
        <div className="p-6 border-b border-gray-200">
          <h4 className="font-semibold text-gray-900 mb-3">Action Items</h4>
          <ul className="space-y-2">
            {briefing.actionItems.map((item, idx) => (
              <li key={idx} className="flex items-start space-x-2">
                <span className={`px-2 py-1 text-xs font-medium rounded ${
                  item.priority === 'high'
                    ? 'bg-red-100 text-red-800'
                    : item.priority === 'medium'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {item.priority}
                </span>
                <p className="text-sm text-gray-700 flex-1">{item.description}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Recommendations */}
      <div className="p-6">
        <h4 className="font-semibold text-gray-900 mb-3">Recommendations</h4>
        {isEditing ? (
          <textarea
            value={editedContent.recommendation}
            onChange={(e) => setEditedContent(prev => ({
              ...prev,
              recommendation: e.target.value
            }))}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            rows={4}
          />
        ) : (
          <p className="text-gray-700 whitespace-pre-wrap">
            {briefing.recommendation}
          </p>
        )}
      </div>
    </div>
  );
}