import { useState } from 'react';
import { analyzeWeather, type FactSheet } from '@terra-oracle/terra-oracle';
import { RefreshCcw } from 'lucide-react';

export default function WeatherPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [factSheet, setFactSheet] = useState<FactSheet | null>(null);
  
  const handleLookup = async () => {
    setLoading(true);
    setError(null);
    setFactSheet(null);
    
    try {
      const data = await analyzeWeather(undefined, {
        includeForecast: true 
      });
      setFactSheet(data);
    } catch (err: any) {
      setError(err.message || 'Failed to connect');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fadeIn">
      <header style={{ marginBottom: '2rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '1.5rem', color: '#0ea5e9' }}>Weather Station</h1>
        <p style={{ fontSize: '0.9rem', color: '#64748b' }}>General multi-day weather overview</p>
      </header>

      <div style={{ maxWidth: '600px', margin: '0 auto 2rem', textAlign: 'center' }}>
        <button onClick={handleLookup} disabled={loading} style={{ background: '#0ea5e9', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '0.75rem', border: 'none', cursor: 'pointer', fontSize: '1rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
            {loading ? <RefreshCcw className="animate-spin" size={18} /> : 'Fetch Weather Data'}
        </button>
      </div>

      {error && <div style={{ color: '#991b1b', textAlign: 'center', padding: '1rem' }}>{error}</div>}

      {factSheet && !loading && (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div className="fact-card" style={{ padding: '1.25rem', borderRadius: '1rem', background: '#111827', marginBottom: '1.5rem' }}>
            <pre style={{ color: '#10b981', fontSize: '0.8rem', overflowX: 'auto', fontFamily: 'monospace' }}>
              {JSON.stringify(factSheet, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
