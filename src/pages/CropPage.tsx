import { useState } from 'react';
import { analyzeCrop, type FactSheet } from '@terra-oracle/terra-oracle';
import { RefreshCcw, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { getAgriAdvisory } from '../lib/gemini';

export default function CropPage() {
  const [subject, setSubject] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [factSheet, setFactSheet] = useState<FactSheet | null>(null);
  const [aiAdvice, setAiAdvice] = useState<string | null>(null);

  const [useManualLoc, setUseManualLoc] = useState(false);
  const [lat, setLat] = useState('4.8156'); // Default Port Harcourt
  const [lon, setLon] = useState('7.0498');

  const [includeSeasonal, setIncludeSeasonal] = useState(false);
  const [includeHistory, setIncludeHistory] = useState(false);

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim()) return;

    setLoading(true);
    setError(null);
    setAiAdvice(null);
    setFactSheet(null);
    
    try {
      const manualCoords = useManualLoc ? { lat: parseFloat(lat), lon: parseFloat(lon) } : undefined;
      
      const data = await analyzeCrop(subject, manualCoords, {
        includeSeasonal,
        includeHistory,
        includeForecast: true 
      });
      setFactSheet(data);
      
      try {
        const advice = await getAgriAdvisory(data);
        setAiAdvice(advice);
      } catch (aiErr) {
        console.error(aiErr);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to connect');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fadeIn">
      <header style={{ marginBottom: '2rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '1.5rem', color: '#166534' }}>Crop Analysis</h1>
        <p style={{ fontSize: '0.9rem', color: '#64748b' }}>Plant & Crop specific thermal data</p>
      </header>

      <div style={{ maxWidth: '600px', margin: '0 auto 2rem' }}>
        <div style={{ padding: '1.25rem', borderRadius: '1.25rem', background: 'white', border: '1px solid #e2e8f0' }}>
          <form onSubmit={handleLookup} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                    type="text"
                    placeholder="Enter crop name (e.g., Maize)..."
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    disabled={loading}
                    style={{ flex: 1, padding: '0.75rem 1rem', borderRadius: '0.75rem', border: '1px solid #e2e8f0', fontSize: '0.9rem' }}
                />
                <button type="submit" disabled={loading} style={{ background: '#166534', color: 'white', padding: '0 1.25rem', borderRadius: '0.75rem', border: 'none', cursor: 'pointer' }}>
                    {loading ? <RefreshCcw className="animate-spin" size={18} /> : 'Analyze'}
                </button>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.8rem', color: '#64748b' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', cursor: 'pointer' }}>
                    <input type="checkbox" checked={useManualLoc} onChange={(e) => setUseManualLoc(e.target.checked)} /> 
                    Override Location (GPS/IP block)
                </label>
                {useManualLoc && (
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <input type="number" step="0.0001" placeholder="Lat" value={lat} onChange={e => setLat(e.target.value)} style={{ width: '80px', padding: '0.3rem', borderRadius: '0.25rem', border: '1px solid #cbd5e1' }} />
                        <input type="number" step="0.0001" placeholder="Lon" value={lon} onChange={e => setLon(e.target.value)} style={{ width: '80px', padding: '0.3rem', borderRadius: '0.25rem', border: '1px solid #cbd5e1' }} />
                    </div>
                )}
            </div>

            <div style={{ display: 'flex', gap: '1rem', fontSize: '0.7rem', color: '#64748b', justifyContent: 'center', marginTop: '0.5rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', cursor: 'pointer' }}>
                    <input type="checkbox" checked={includeSeasonal} onChange={(e) => setIncludeSeasonal(e.target.checked)} /> Seasonal Trends
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', cursor: 'pointer' }}>
                    <input type="checkbox" checked={includeHistory} onChange={(e) => setIncludeHistory(e.target.checked)} /> Historical Comparison
                </label>
            </div>
          </form>
        </div>
      </div>

      {error && <div style={{ color: '#991b1b', textAlign: 'center', padding: '1rem' }}>{error}</div>}

      {factSheet && !loading && (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div className="fact-card" style={{ padding: '1.25rem', borderRadius: '1rem', background: '#111827', marginBottom: '1.5rem' }}>
            <pre style={{ color: '#10b981', fontSize: '0.8rem', overflowX: 'auto', fontFamily: 'monospace' }}>
              {JSON.stringify(factSheet, null, 2)}
            </pre>
          </div>

          {aiAdvice && (
            <div style={{ padding: '1.5rem', background: 'white', borderRadius: '1.25rem', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#10b981', marginBottom: '1rem' }}>
                <Sparkles size={16} /> <span style={{ fontWeight: 600 }}>Agronomist Advisory</span>
              </div>
              <div style={{ color: '#334155', fontSize: '0.95rem', lineHeight: 1.7 }}>
                  <ReactMarkdown>{aiAdvice}</ReactMarkdown>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
