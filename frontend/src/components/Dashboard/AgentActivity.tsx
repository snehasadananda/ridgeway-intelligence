import type { Thought, ToolCall, Investigation } from '../../types';

interface AgentActivityProps {
  thoughts: Thought[];
  toolCalls: ToolCall[];
  status: Investigation['status'];
}

const statusLabel: Record<AgentActivityProps['status'], string> = {
  idle: 'Idle',
  analyzing: 'Analyzing events',
  gathering_evidence: 'Gathering evidence',
  correlating: 'Correlating signals',
  completed: 'Completed',
  error: 'Error',
};

export function AgentActivity({ thoughts, toolCalls, status }: AgentActivityProps) {
  const recentThoughts = [...thoughts].slice(-4).reverse();
  const recentToolCalls = [...toolCalls].slice(-5).reverse();

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Agent Activity</h3>
        <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-50 text-blue-700">
          {statusLabel[status]}
        </span>
      </div>

      <div className="space-y-4">
        <section>
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-semibold text-gray-800">Recent Reasoning</h4>
            <span className="text-xs text-gray-500">{thoughts.length} total</span>
          </div>

          {recentThoughts.length > 0 ? (
            <div className="space-y-2">
              {recentThoughts.map((thought) => (
                <div key={thought.id} className="rounded-lg border border-gray-200 bg-gray-50 p-3">
                  <p className="text-xs text-gray-500 mb-1">
                    {new Date(thought.timestamp).toLocaleTimeString()}
                  </p>
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">
                    {thought.content}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">Reasoning steps will appear here as the agent works.</p>
          )}
        </section>

        <section>
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-semibold text-gray-800">Tool Calls</h4>
            <span className="text-xs text-gray-500">{toolCalls.length} total</span>
          </div>

          {recentToolCalls.length > 0 ? (
            <div className="space-y-2">
              {recentToolCalls.map((toolCall) => (
                <div key={toolCall.id} className="rounded-lg border border-gray-200 p-3">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{toolCall.tool}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(toolCall.timestamp).toLocaleTimeString()}
                      </p>
                    </div>

                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        toolCall.status === 'success'
                          ? 'bg-green-100 text-green-800'
                          : toolCall.status === 'error'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {toolCall.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No tool calls yet.</p>
          )}
        </section>
      </div>
    </div>
  );
}
