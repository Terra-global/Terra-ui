import { useState } from 'react';
import { analyzeField, type FactSheet } from '@terra-oracle/terra-oracle';
import { Search, RefreshCcw, Braces, BookOpen, Layout, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import DeveloperDocs from './docs/docs';
import { getAgriAdvisory } from './lib/gemini';

function App() {
  const [view, setView] = useState<'dashboard' | 'docs'>('dashboard');
  const [crop, setCrop] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [factSheet, setFactSheet] = useState<FactSheet | null>(null);

  // AI States
  const [aiLoading, setAiLoading] = useState(false);
  const [aiAdvice, setAiAdvice] = useState<string | null>(null);

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!crop.trim()) return;

    setLoading(true);
    setError(null);
    setAiAdvice(null);
    try {
      const data = await analyzeField({ crop });
      setFactSheet(data);
      
      // Auto-trigger AI Advisory as soon as data arrives
      setAiLoading(true);
      try {
        const advice = await getAgriAdvisory(data);
        setAiAdvice(advice);
      } catch (aiErr: any) {
        console.error("Auto-AI failure:", aiErr);
      } finally {
        setAiLoading(false);
      }
      
    } catch (err: any) {
      setError(err.message || 'Failed to connect to Oracle network');
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="container" style={{ maxWidth: '800px', padding: '2rem 1rem' }}>
      <nav style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '3rem' }}>
        <button 
          onClick={() => setView('dashboard')}
          style={{ 
            background: view === 'dashboard' ? '#111827' : 'transparent', 
            color: view === 'dashboard' ? 'white' : '#64748b',
            border: view === 'dashboard' ? 'none' : '1px solid #e2e8f0',
            padding: '0.5rem 1rem',
            fontSize: '0.8rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <Layout size={14} /> Dashboard
        </button>
        <button 
          onClick={() => setView('docs')}
          style={{ 
            background: view === 'docs' ? '#111827' : 'transparent', 
            color: view === 'docs' ? 'white' : '#64748b',
            border: view === 'docs' ? 'none' : '1px solid #e2e8f0',
            padding: '0.5rem 1rem',
            fontSize: '0.8rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <BookOpen size={14} /> Documentation
        </button>
      </nav>

      {view === 'dashboard' ? (
        <div className="dashboard-view animate-fadeIn">
          <header style={{ marginBottom: '2rem', textAlign: 'center' }}>
            <h1 style={{ fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}>
               Terra Oracle v1.0.3
            </h1>
            <p className="subtitle" style={{ fontSize: '0.9rem' }}>Protocol Fact Sheet Generator</p>
          </header>

          <div className="input-section" style={{ padding: '0.75rem', borderRadius: '1rem', marginBottom: '1.5rem', maxWidth: '600px', margin: '0 auto 1.5rem' }}>
            <form onSubmit={handleLookup} className="input-wrapper" style={{ gap: '0.5rem' }}>
              <input
                type="text"
                placeholder="Enter crop name..."
                value={crop}
                onChange={(e) => setCrop(e.target.value)}
                disabled={loading}
                style={{ padding: '0.625rem 1rem', fontSize: '0.9rem' }}
              />
              <button type="submit" disabled={loading || !crop.trim()} style={{ padding: '0 1.25rem', fontSize: '0.9rem' }}>
                {loading ? <RefreshCcw className="animate-spin" size={16} /> : <Search size={16} />}
                {loading ? '...' : 'Generate'}
              </button>
            </form>
          </div>

          {error && <div className="error" style={{ marginBottom: '1rem' }}>{error}</div>}

          {factSheet && !loading && (
            <div className="results-section">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                  <Braces size={14} />
                  <span>RAW PROTOCOL OUTPUT</span>
                </div>
                {aiLoading && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#10b981', fontSize: '0.75rem' }}>
                    <RefreshCcw className="animate-spin" size={12} />
                    <span>Oracle is thinking...</span>
                  </div>
                )}
              </div>
              
              <div className="fact-card" style={{ padding: '1.25rem', borderRadius: '1rem', background: '#111827' }}>
                <pre style={{ 
                  color: '#10b981', 
                  fontSize: '0.8125rem', 
                  overflowX: 'auto', 
                  fontFamily: 'monospace',
                  lineHeight: 1.4
                }}>
                  {JSON.stringify(factSheet, null, 2)}
                </pre>
              </div>

              {aiAdvice && (
                <div style={{ 
                  marginTop: '1.5rem', 
                  padding: '1.5rem', 
                  background: '#f8fafc', 
                  borderRadius: '1rem', 
                  border: '1px solid #e2e8f0',
                  animation: 'fadeIn 0.5s ease-out'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#10b981', marginBottom: '1rem' }}>
                    <Sparkles size={16} />
                    <span style={{ fontWeight: 600, fontSize: '0.9rem', color: '#0f172a' }}>Expert Advisory</span>
                  </div>
                  <div className="markdown-content" style={{ color: '#334155', fontSize: '0.95rem', lineHeight: 1.7 }}>
                     <ReactMarkdown>{aiAdvice}</ReactMarkdown>
                  </div>
                </div>
              )}
            </div>
          )}

          {loading && (
            <div className="loading" style={{ padding: '2rem' }}>
              <RefreshCcw className="animate-spin" size={20} style={{ margin: '0 auto' }} />
            </div>
          )}
        </div>
      ) : (
        <div className="docs-view animate-fadeIn">
          <DeveloperDocs />
        </div>
      )}
    </div>
  );
}

export default App;
