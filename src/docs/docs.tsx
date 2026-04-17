import { Book, Code, Terminal, Zap, Info, ShieldCheck, Layout } from 'lucide-react';

const DeveloperDocs = () => {
  return (
    <div className="docs-container" style={{ 
      maxWidth: '800px', 
      margin: '0 auto', 
      padding: '2rem 1rem', 
      color: '#334155',
      lineHeight: 1.6
    }}>
      <header style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '2rem', marginBottom: '3rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
          <Book className="text-emerald" style={{ color: '#10b981' }} size={32} />
          <h1 style={{ fontSize: '2.5rem', fontWeight: 700, color: '#0f172a', letterSpacing: '-0.03em' }}>
            Developer Documentation
          </h1>
        </div>
        <p style={{ fontSize: '1.25rem', color: '#64748b' }}>
          Learn how to integrate the <strong>Terra Oracle</strong> protocol into your agriculture and climate apps.
        </p>
      </header>

      {/* 1. Overview */}
      <section style={{ marginBottom: '4rem' }}>
        <h2 style={{ fontSize: '1.5rem', color: '#0f172a', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Zap size={20} style={{ color: '#10b981' }} /> 1. Operational Overview
        </h2>
        <p style={{ marginBottom: '1rem' }}>
          Terra Oracle is a <strong>stateless Data Layer</strong>. It handles the heavy lifting of geolocation and satellite data retrieval, returning a structured "Fact Sheet" that can be injected directly into a Large Language Model (like Gemini) to produce agronomic advice.
        </p>
        <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '1rem', border: '1px solid #e2e8f0' }}>
            <ul style={{ listStyle: 'none', padding: 0 }}>
                <li style={{ marginBottom: '0.5rem' }}>✅ <strong>Zero-Key Weather:</strong> Uses Open-Meteo ERA5 fusion (Free).</li>
                <li style={{ marginBottom: '0.5rem' }}>✅ <strong>Hybrid Location:</strong> Browser GPS with silent IP fallback.</li>
                <li style={{ marginBottom: '0.5rem' }}>✅ <strong>Stateless:</strong> No database or user storage required.</li>
                <li>✅ <strong>Secure:</strong> Never touches your AI API keys.</li>
            </ul>
        </div>
      </section>

      {/* 2. Installation */}
      <section style={{ marginBottom: '4rem' }}>
        <h2 style={{ fontSize: '1.5rem', color: '#0f172a', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Terminal size={20} style={{ color: '#10b981' }} /> 2. Installation
        </h2>
        <p style={{ marginBottom: '1rem' }}>The package is published under the <code>@terra-oracle</code> scope. You will need Node.js 18+ to use the built-in <code>fetch</code> support.</p>
        <div style={{ background: '#0f172a', padding: '1.25rem', borderRadius: '0.75rem', color: '#f8fafc', fontFamily: 'monospace', fontSize: '0.9rem' }}>
          npm install @terra-oracle/terra-oracle
        </div>
      </section>

      {/* 3. Integration */}
      <section style={{ marginBottom: '4rem' }}>
        <h2 style={{ fontSize: '1.5rem', color: '#0f172a', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Code size={20} style={{ color: '#10b981' }} /> 3. Implementation Steps
        </h2>
        
        <h3 style={{ fontSize: '1.1rem', marginBottom: '0.75rem' }}>A. Standard (Auto-Location)</h3>
        <p style={{ marginBottom: '1rem' }}>Ideal for web dashboards where you want the protocol to automatically handle the user's location layer.</p>
        <div style={{ background: '#f1f5f9', padding: '1.25rem', borderRadius: '0.75rem', marginBottom: '2rem', borderLeft: '4px solid #10b981' }}>
          <pre style={{ fontSize: '0.85rem', color: '#334155' }}>{`import { analyzeField } from '@terra-oracle/terra-oracle';

const factSheet = await analyzeField({ 
  crop: 'Cassava' 
});`}</pre>
        </div>

        <h3 style={{ fontSize: '1.1rem', marginBottom: '0.75rem' }}>B. Precision Mode (Manual Coords)</h3>
        <p style={{ marginBottom: '1rem' }}>If you are building a <strong>React Native</strong> app or have a specific GPS pin, you can bypass auto-detection for 100% precision.</p>
        <div style={{ background: '#f1f5f9', padding: '1.25rem', borderRadius: '0.75rem', borderLeft: '4px solid #0ea5e9' }}>
          <pre style={{ fontSize: '0.85rem', color: '#334155' }}>{`const factSheet = await analyzeField({ 
  crop: 'Cassava',
  manualCoords: { lat: 4.8156, lon: 7.0498 } 
});`}</pre>
        </div>
      </section>

      {/* 4. AI Interfacing */}
      <section style={{ marginBottom: '4rem' }}>
        <h2 style={{ fontSize: '1.5rem', color: '#0f172a', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Info size={20} style={{ color: '#10b981' }} /> 4. Passing to Gemini AI (Cognitive Layer)
        </h2>
        <p style={{ marginBottom: '1.5rem' }}>
          Terra Oracle is designed to be the "Briefing Note" for an AI. Do not try to write your own hardcoded logic—let the AI interpret the thermal data.
        </p>
        <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '1rem', border: '1px solid #e2e8f0' }}>
          <p style={{ fontWeight: 600, color: '#0f172a', marginBottom: '1rem' }}>Recommended Prompt Pattern:</p>
          <pre style={{ 
            fontSize: '0.85rem', 
            color: '#475569', 
            whiteSpace: 'pre-wrap',
            background: 'white',
            padding: '1rem',
            borderRadius: '0.5rem',
            border: '1px solid #e2e8f0'
          }}>{`"You are an expert agronomist. 
Analyze these field conditions provided by the Terra Oracle: 
$\{JSON.stringify(factSheet)}

Provide immediate 24-hour thermal stress mitigation steps for the farmer."`}</pre>
        </div>
      </section>

      {/* 5. Full Component Example */}
      <section style={{ marginBottom: '4rem' }}>
        <h2 style={{ fontSize: '1.5rem', color: '#0f172a', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Layout size={20} style={{ color: '#10b981' }} /> 5. Full Frontend Template
        </h2>
        <p style={{ marginBottom: '1.5rem' }}>
          Copy and paste this minimal component into your React app to get started instantly. This version focuses strictly on fetching and displaying the weather data.
        </p>
        <div style={{ background: '#f1f5f9', padding: '1.25rem', borderRadius: '0.75rem', border: '1px solid #e2e8f0' }}>
          <pre style={{ 
            fontSize: '0.75rem', 
            color: '#334155', 
            overflowX: 'auto',
            lineHeight: 1.5
          }}>{`import React, { useState } from 'react';
import { analyzeField } from '@terra-oracle/terra-oracle';

export const ClimateCard = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);

    const getSnapshot = async () => {
        setLoading(true);
        // Calls multi-tier geolocation & satellite fetch
        const factSheet = await analyzeField({ crop: 'Mango' });
        setData(factSheet);
        setLoading(false);
    };

    return (
        <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
            <button onClick={getSnapshot} disabled={loading}>
                {loading ? 'Consulting Satellite...' : 'Check Mango Field'}
            </button>

            {data && (
                <div style={{ marginTop: '20px' }}>
                    <h3>Status for {data.crop_name}</h3>
                    <p>📍 Location: {data.environmental_snapshot.location}</p>
                    <p>🌡️ Temperature: {data.environmental_snapshot.temp_c}°C</p>
                </div>
            )}
        </div>
    );
};`}</pre>
        </div>
      </section>

      {/* 6. Security & Trust */}
      <section style={{ marginBottom: '2rem', padding: '2rem', background: '#ecfdf5', borderRadius: '1.5rem', border: '1px solid #d1fae5' }}>
        <h2 style={{ fontSize: '1.25rem', color: '#065f46', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <ShieldCheck size={20} /> 6. Security Architecture
        </h2>
        <p style={{ color: '#065f46', fontSize: '1rem', opacity: 0.9 }}>
          The protocol follows a strictly <strong>Decentralized Key Strategy</strong>. The NPM package never asks for your Gemini API key. All AI interaction must happen on your own client or server, ensuring you maintain full control over your credentials and costs.
        </p>
      </section>

      <footer style={{ textAlign: 'center', marginTop: '4rem', color: '#94a3b8', fontSize: '0.875rem' }}>
        &copy; 2026 Terra Oracle Protocol &bull; josephakpansunday@gmail.com
      </footer>
    </div>
  );
};

export default DeveloperDocs;
