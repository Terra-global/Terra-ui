import { ShieldCheck } from 'lucide-react';

const DeveloperDocs = () => {
  return (
    <div className="docs-layout" style={{ background: '#f8fafc', color: '#334155', lineHeight: 1.6, textAlign: 'left', padding: '1rem 0' }}>
      {/* Main Content */}
      <main style={{ padding: '3rem', maxWidth: '800px', margin: '0 auto', background: 'white', borderRadius: '1.5rem', boxShadow: '0 10px 40px -10px rgba(0,0,0,0.08)' }}>
        <header style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '2rem', marginBottom: '3rem' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.03em', marginBottom: '1rem' }}>
            Integration Guide
          </h1>
          <p style={{ fontSize: '1.2rem', color: '#64748b', lineHeight: 1.6 }}>
            Learn how to deploy the <strong>Terra Oracle</strong> protocol to secure agriculture and climate apps with hyper-local, real-time satellite intelligence.
          </p>
        </header>

        {/* 1. Installation */}
        <section id="installation" style={{ marginBottom: '4rem' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#0f172a', marginBottom: '1rem' }}>
            1. Installation
          </h2>
          <p style={{ marginBottom: '1rem' }}>
            Install the stateless Oracle SDK via NPM. It comes with full TypeScript definitions and zero mandatory API keys.
          </p>
          <div style={{ background: '#0f172a', padding: '1.25rem', borderRadius: '0.5rem', color: '#f8fafc', fontFamily: 'monospace', fontSize: '0.9rem' }}>
            npm install @terra-oracle/terra-oracle
          </div>
        </section>

        {/* 2. Hyper-Local Alerts (NEW) */}
        <section id="hyperlocal" style={{ marginBottom: '4rem' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#0f172a', marginBottom: '1rem' }}>
            2. The Hyper-Local Alert Engine
          </h2>
          <p style={{ marginBottom: '1rem' }}>
            Unlike traditional weather apps that broadcast general warnings, Terra Oracle is <strong>Hyper-Local</strong>. When you use the SDK, it automatically resolves the user's exact coordinates using browser GPS or IP triangulation.
          </p>
          <div style={{ padding: '1.5rem', background: '#f8fafc', borderLeft: '4px solid #3b82f6', borderRadius: '0 0.5rem 0.5rem 0', marginBottom: '1rem' }}>
            <h4 style={{ fontWeight: 600, color: '#1e40af', marginBottom: '0.5rem' }}>How it works in production:</h4>
            <ul style={{ paddingLeft: '1.5rem', color: '#334155' }}>
              <li style={{ marginBottom: '0.5rem' }}><strong>Farmer A is in Kano (Heat Wave):</strong> The satellite detects 41°C. Their app instantly triggers the Extreme Heat Warning.</li>
              <li><strong>Farmer B is in Jos (Normal):</strong> The satellite detects 28°C. Their app remains completely silent.</li>
            </ul>
          </div>
          <p>
            This ensures that <strong>only users currently experiencing the danger</strong> receive the alert, eliminating notification fatigue.
          </p>
        </section>

        {/* 3. Weather Forecast SDK */}
        <section id="forecast" style={{ marginBottom: '4rem' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#0f172a', marginBottom: '1rem' }}>
            3. Pure JSON Weather Forecast SDK
          </h2>
          <p style={{ marginBottom: '1rem' }}>
            The Oracle includes a stateless, design-free Weather Forecast module powered by Open-Meteo. It provides a 7-day outlook and automatically flags incoming severe rain and thunderstorms.
          </p>
          <div style={{ background: '#f1f5f9', padding: '1.25rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0' }}>
            <pre style={{ fontSize: '0.8rem', color: '#334155', overflowX: 'auto', lineHeight: 1.5 }}>{`import { getWeatherForecast, resolveLocation } from '@terra-oracle/terra-oracle';

const fetchLocalForecast = async () => {
  // Grab the exact coordinates of the farmer
  const loc = await resolveLocation(); 

  // Pull the hyper-local forecast
  const data = await getWeatherForecast({
    latitude: loc.latitude,
    longitude: loc.longitude
  });

  // Automatically check if a thunderstorm is approaching!
  if (data.alerts.storm.active) {
    console.warn("Storm incoming:", data.alerts.storm.items[0].message);
  }

  // Access the 7-day forecast data
  data.week.forEach(day => {
    console.log(\`\${day.label}: Max \${day.temperature.max.value}°C\`);
  });
};`}</pre>
          </div>
        </section>

        {/* 3. Background Safety Sentinel */}
        <section id="sentinel" style={{ marginBottom: '4rem' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#0f172a', marginBottom: '1rem' }}>
            3. Background Safety Sentinel
          </h2>
          <p style={{ marginBottom: '1rem' }}>
            The SDK includes a lightweight <code>checkAlerts</code> function designed for background monitoring. It automatically enforces the <strong>40°C Extreme Heat Wave Standard</strong> without running heavy AI or Fact Sheet logic.
          </p>
          <div style={{ background: '#fffbeb', padding: '1.25rem', borderRadius: '0.5rem', border: '1px solid #fde68a' }}>
            <pre style={{ fontSize: '0.85rem', color: '#92400e', overflowX: 'auto' }}>{`import { checkAlerts } from '@terra-oracle/terra-oracle';

const monitorEnvironment = async () => {
  // Checks weather against the hardcoded 40°C limit
  const alerts = await checkAlerts({}); 
  
  if (alerts.length > 0) {
    // e.g. "ORACLE WARNING: Extreme Heat Wave detected..."
    showNotification(alerts[0].message);
  }
};

setInterval(monitorEnvironment, 1000 * 60 * 5);`}</pre>
          </div>
        </section>

        {/* 4. AI Interfacing */}
        <section id="ai" style={{ marginBottom: '4rem' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#0f172a', marginBottom: '1rem' }}>
            4. Cognitive Layer (AI)
          </h2>
          <p style={{ marginBottom: '1.5rem' }}>
            Terra Oracle outputs a structured <strong>Fact Sheet</strong>. The AI layer handles the professional interpretation.
          </p>
          <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0' }}>
            <p style={{ fontWeight: 600, color: '#0f172a', marginBottom: '1rem' }}>Example Prompt Context:</p>
            <pre style={{ 
              fontSize: '0.85rem', 
              color: '#475569', 
              whiteSpace: 'pre-wrap',
              background: 'white',
              padding: '1rem',
              borderRadius: '0.5rem',
              border: '1px solid #e2e8f0'
            }}>{`"Analyze these thermal conditions: 
\${JSON.stringify(factSheet)}

Only warn if data is an anomaly compared to local historical norms."`}</pre>
          </div>
        </section>

        {/* 5. Full Component Template */}
        <section id="template" style={{ marginBottom: '4rem' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#0f172a', marginBottom: '1rem' }}>
            5. Full React Sentinel Template
          </h2>
          <div style={{ background: '#f1f5f9', padding: '1.25rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0' }}>
            <pre style={{ 
              fontSize: '0.8rem', 
              color: '#334155', 
              overflowX: 'auto',
              lineHeight: 1.5
            }}>{`import React, { useState, useEffect } from 'react';
import { analyzeField, checkAlerts } from '@terra-oracle/terra-oracle';

export const FarmerDashboard = () => {
    const [data, setData] = useState(null);

    useEffect(() => {
        const sentinel = setInterval(async () => {
            const alerts = await checkAlerts({});
            if (alerts.length > 0) alert(alerts[0].message);
        }, 300000);
        return () => clearInterval(sentinel);
    }, []);

    const getAnalysis = async () => {
        const factSheet = await analyzeField({ subject: 'Poultry', category: 'ANIMAL' });
        setData(factSheet);
    };

    return (
        <div>
            <button onClick={getAnalysis}>Generate Deep Analysis</button>
            {data?.alerts.map(a => <div className="toast">🚨 {a.message}</div>)}
        </div>
    );
};`}</pre>
          </div>
        </section>

        <section style={{ marginBottom: '2rem', padding: '2rem', background: '#ecfdf5', borderRadius: '1rem', border: '1px solid #d1fae5' }}>
          <h2 style={{ fontSize: '1.25rem', color: '#065f46', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ShieldCheck size={20} /> 6. Zero-Key Architecture
          </h2>
          <p style={{ color: '#065f46', fontSize: '1rem', opacity: 0.9 }}>
            The NPM package never asks for your Gemini API key. All AI interaction happens on your own client, ensuring full control over your credentials and costs.
          </p>
        </section>

        <footer style={{ marginTop: '4rem', paddingBottom: '2rem', color: '#94a3b8', fontSize: '0.875rem' }}>
          &copy; 2026 Terra Oracle Protocol &bull; josephakpansunday@gmail.com
        </footer>
      </main>
    </div>
  );
};

export default DeveloperDocs;
