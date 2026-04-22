import { useState, useEffect } from 'react';
import { Dashboard } from './components/Dashboard/Dashboard';
import { SiteMap } from './components/Map/SiteMap';
import { BriefingView } from './components/Briefing/BriefingView';
import { investigationApi, siteApi } from './services/api';
import { wsService } from './services/websocket';
import type { Investigation, SiteLayout, StreamMessage } from './types';

type View = 'dashboard' | 'map' | 'briefing';

function App() {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [investigation, setInvestigation] = useState<Investigation | null>(null);
  const [siteLayout, setSiteLayout] = useState<SiteLayout | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      setLoading(true);
      
      // Load site layout
      const layout = await siteApi.getLayout();
      setSiteLayout(layout);

      // Start investigation
      const newInvestigation = await investigationApi.start();
      setInvestigation(newInvestigation);

      // Connect to WebSocket for real-time updates
      wsService.connect(newInvestigation.id);
      
      // Listen for updates
      wsService.on('*', handleStreamMessage);

      setLoading(false);
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleStreamMessage = (message: StreamMessage) => {
    setInvestigation(prev => {
      if (!prev) return prev;

      const updated = { ...prev };

      switch (message.type) {
        case 'status':
          updated.status = message.data.status;
          break;
        case 'thought':
          updated.thoughts = [...updated.thoughts, message.data];
          break;
        case 'tool_call':
          updated.toolCalls = [...updated.toolCalls, message.data];
          break;
        case 'finding':
          updated.findings = [...updated.findings, message.data];
          break;
        case 'complete':
          updated.status = 'completed';
          updated.findings = message.data.findings || updated.findings;
          break;
        case 'error':
          updated.status = 'idle';
          setError(message.data.error);
          break;
      }

      return updated;
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 text-lg">Initializing Investigation...</p>
          <p className="mt-2 text-gray-500 text-sm">Loading overnight events and site data</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md">
          <div className="text-red-600 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-xl font-bold text-gray-900">
                  🔍 6:10 Assistant
                </h1>
                <p className="text-xs text-gray-500">Ridgeway Site Intelligence</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="text-right mr-4">
                <p className="text-sm font-medium text-gray-900">Maya's Morning Review</p>
                <p className="text-xs text-gray-500">
                  {investigation?.status === 'completed' ? '✓ Investigation Complete' : '⏳ Analyzing...'}
                </p>
              </div>
              
              <div className="text-right">
                <p className="text-lg font-bold text-gray-900">6:10 AM</p>
                <p className="text-xs text-gray-500">110 min until briefing</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 h-12">
            <button
              onClick={() => setCurrentView('dashboard')}
              className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                currentView === 'dashboard'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              📊 Investigation
            </button>
            <button
              onClick={() => setCurrentView('map')}
              className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                currentView === 'map'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              🗺️ Site Map
            </button>
            <button
              onClick={() => setCurrentView('briefing')}
              className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                currentView === 'briefing'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              📝 Briefing
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {currentView === 'dashboard' && investigation && (
          <Dashboard investigation={investigation} />
        )}
        {currentView === 'map' && investigation && siteLayout && (
          <SiteMap investigation={investigation} siteLayout={siteLayout} />
        )}
        {currentView === 'briefing' && investigation && (
          <BriefingView investigation={investigation} />
        )}
      </main>
    </div>
  );
}

export default App;