import { useState, useEffect } from 'react';
import { analyzeField, checkAlerts, type FactSheet } from '@terra-oracle/terra-oracle';
import { Search, RefreshCcw, Braces, BookOpen, Layout, Sparkles, X, AlertTriangle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import DeveloperDocs from './docs/docs';
import { getAgriAdvisory } from './lib/gemini';
import { CONFIG } from './lib/config';

function App() {
  const [view, setView] = useState<'dashboard' | 'docs'>('dashboard');
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState<'PLANT' | 'ANIMAL'>('PLANT');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [factSheet, setFactSheet] = useState<FactSheet | null>(null);

  // Config States
  const [includeSeasonal, setIncludeSeasonal] = useState(false);
  const [includeHistory, setIncludeHistory] = useState(false);
  
  // Alert State
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [activeAlert, setActiveAlert] = useState<string | null>(null);

  // AI States
  const [aiLoading, setAiLoading] = useState(false);
  const [aiAdvice, setAiAdvice] = useState<string | null>(null);

  // ─── Background Sentinel (Oracle Guardian) ──────────────────────────────────
  // Silently monitors weather based on the Heat Wave Limit (40°C)
  useEffect(() => {
    const sentinel = setInterval(async () => {
      try {
        const backgroundAlerts = await checkAlerts({}); // Protocol limit check
        if (backgroundAlerts.length > 0 && !sessionStorage.getItem('oracle_alert_dismissed')) {
          setActiveAlert(backgroundAlerts[0].message);
          setShowAlertModal(true);
        }
      } catch (e) {
        console.error("Sentinel failed to reach satellite:", e);
      }
    }, 1000 * 60 * 5); // 5-minute heartbeat

    // Run once on mount
    const initialCheck = async () => {
        if (sessionStorage.getItem('oracle_alert_dismissed')) return;
        const initialAlerts = await checkAlerts({});
        if (initialAlerts.length > 0) {
            setActiveAlert(initialAlerts[0].message);
            setShowAlertModal(true);
        }
    };
    initialCheck();

    return () => clearInterval(sentinel);
  }, []);

  const dismissAlert = () => {
    setShowAlertModal(false);
    sessionStorage.setItem('oracle_alert_dismissed', 'true');
  };

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim()) return;

    setLoading(true);
    setError(null);
    setAiAdvice(null);
    setFactSheet(null);
    
    try {
      const data = await analyzeField({ 
        subject, 
        category,
        config: {
          includeSeasonal,
          includeHistory,
          includeForecast: true 
        }
      });
      
      setFactSheet(data);
      
      // Trigger Toast if Protocol Safety Breach is detected
      if (data.alerts && data.alerts.length > 0 && !sessionStorage.getItem('oracle_alert_dismissed')) {
        setActiveAlert(data.alerts[0].message);
        setShowAlertModal(true);
      }

      // Auto-trigger AI Advisory
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
      {/* Protocol Alert Toast (Top Right) */}
      {showAlertModal && activeAlert && (
        <div style={{
          position: 'fixed',
          top: '1.5rem', right: '1.5rem',
          zIndex: 1000,
          animation: 'fadeIn 0.3s ease-out'
        }}>
          <div style={{
            background: 'white',
            borderRadius: '1rem',
            padding: '1.5rem',
            width: '320px',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
            borderLeft: '4px solid #ef4444',
            position: 'relative'
          }}>
            <button 
              onClick={dismissAlert}
              style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'transparent', border: 'none', cursor: 'pointer', color: '#94a3b8' }}
            >
              <X size={16} />
            </button>
            
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
              <AlertTriangle size={24} color="#ef4444" style={{ flexShrink: 0 }} />
              <div>
                <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.25rem' }}>Oracle Warning</h2>
                <p style={{ color: '#475569', fontSize: '0.85rem', marginBottom: '1rem', lineHeight: 1.4 }}>{activeAlert}</p>
                <button 
                  onClick={dismissAlert}
                  style={{
                    background: '#fef2f2',
                    color: '#ef4444',
                    padding: '0.4rem 0.75rem',
                    borderRadius: '0.5rem',
                    fontWeight: 600,
                    fontSize: '0.75rem',
                    border: '1px solid #fecaca',
                    cursor: 'pointer'
                  }}
                >
                  Acknowledge
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
            gap: '0.5rem',
            borderRadius: '0.5rem'
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
            gap: '0.5rem',
            borderRadius: '0.5rem'
          }}
        >
          <BookOpen size={14} /> Documentation
        </button>
      </nav>

      {view === 'dashboard' ? (
        <div className="dashboard-view animate-fadeIn">
          <header style={{ marginBottom: '2rem', textAlign: 'center' }}>
            <h1 style={{ fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}>
               Terra Oracle v1.1.10
            </h1>
            <p className="subtitle" style={{ fontSize: '0.9rem' }}>Multimodal Climate Adaptation Protocol</p>
          </header>

          <div style={{ maxWidth: '600px', margin: '0 auto 2rem' }}>
            {/* Main Input Section */}
            <div className="input-section" style={{ padding: '1.25rem', borderRadius: '1.25rem', background: 'white', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem' }}>
                <button 
                    onClick={() => setCategory('PLANT')}
                    style={{ 
                    flex: 1, padding: '0.5rem', fontSize: '0.75rem', borderRadius: '0.5rem',
                    background: category === 'PLANT' ? '#f0fdf4' : 'transparent',
                    color: category === 'PLANT' ? '#166534' : '#64748b',
                    border: category === 'PLANT' ? '1px solid #bbf7d0' : '1px solid transparent'
                    }}
                >
                    Plants & Crops
                </button>
                <button 
                    onClick={() => setCategory('ANIMAL')}
                    style={{ 
                    flex: 1, padding: '0.5rem', fontSize: '0.75rem', borderRadius: '0.5rem',
                    background: category === 'ANIMAL' ? '#f0fdf4' : 'transparent',
                    color: category === 'ANIMAL' ? '#166534' : '#64748b',
                    border: category === 'ANIMAL' ? '1px solid #bbf7d0' : '1px solid transparent'
                    }}
                >
                    Poultry & Livestock
                </button>
                </div>

                <form onSubmit={handleLookup} style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                <input
                    type="text"
                    placeholder={category === 'PLANT' ? "Enter crop name..." : "Enter animal type..."}
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    disabled={loading}
                    style={{ flex: 1, padding: '0.75rem 1rem', borderRadius: '0.75rem', border: '1px solid #e2e8f0', fontSize: '0.9rem' }}
                />
                <button type="submit" disabled={loading} style={{ background: '#111827', color: 'white', padding: '0 1.25rem', borderRadius: '0.75rem', border: 'none', cursor: 'pointer' }}>
                    {loading ? <RefreshCcw className="animate-spin" size={18} /> : 'Generate Analysis'}
                </button>
                </form>

                <div style={{ display: 'flex', gap: '1rem', fontSize: '0.7rem', color: '#64748b', justifyContent: 'center' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', cursor: 'pointer' }}>
                        <input type="checkbox" checked={includeSeasonal} onChange={(e) => setIncludeSeasonal(e.target.checked)} /> Seasonal Trends
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', cursor: 'pointer' }}>
                        <input type="checkbox" checked={includeHistory} onChange={(e) => setIncludeHistory(e.target.checked)} /> Historical Comparison
                    </label>
                </div>
            </div>
            
            <p style={{ textAlign: 'center', fontSize: '0.7rem', color: '#94a3b8', marginTop: '1rem' }}>
                Oracle monitoring active: Extreme Heat alerts triggered at 40°C.
            </p>
          </div>

          {error && <div className="error" style={{ marginBottom: '1rem', padding: '1rem', background: '#fef2f2', color: '#991b1b', borderRadius: '0.75rem', fontSize: '0.85rem' }}>{error}</div>}

          {factSheet && !loading && (
            <div className="results-section">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b', fontSize: '0.8rem' }}>
                  <Braces size={14} />
                  <span>FACT SHEET</span>
                </div>
                {aiLoading && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#10b981', fontSize: '0.75rem' }}>
                    <RefreshCcw className="animate-spin" size={12} />
                    <span>AI Reasoning...</span>
                  </div>
                )}
              </div>
              
              <div className="fact-card" style={{ padding: '1.25rem', borderRadius: '1rem', background: '#111827', marginBottom: '1.5rem' }}>
                <pre style={{ color: '#10b981', fontSize: '0.8rem', overflowX: 'auto', fontFamily: 'monospace', lineHeight: 1.4 }}>
                  {JSON.stringify(factSheet, null, 2)}
                </pre>
              </div>

              {aiAdvice && (
                <div style={{ padding: '1.5rem', background: 'white', borderRadius: '1.25rem', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#10b981', marginBottom: '1rem' }}>
                    <Sparkles size={16} />
                    <span style={{ fontWeight: 600, fontSize: '0.9rem', color: '#0f172a' }}>{category === 'PLANT' ? 'Agronomist Advisory' : 'Veterinary Advisory'}</span>
                  </div>
                  <div className="markdown-content" style={{ color: '#334155', fontSize: '0.95rem', lineHeight: 1.7 }}>
                     <ReactMarkdown>{aiAdvice}</ReactMarkdown>
                  </div>
                </div>
              )}
            </div>
          )}

          {loading && (
            <div className="loading" style={{ padding: '2rem', textAlign: 'center' }}>
              <RefreshCcw className="animate-spin" size={32} style={{ margin: '0 auto', color: '#10b981' }} />
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
