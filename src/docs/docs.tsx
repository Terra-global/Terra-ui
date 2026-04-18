import { useState } from 'react';
import { ShieldCheck, Monitor, Smartphone, Layers } from 'lucide-react';

const DeveloperDocs = () => {
  const [platform, setPlatform] = useState<'web' | 'rn' | 'flutter'>('web');

  const PlatformButton = ({ id, label, icon: Icon }: { id: 'web' | 'rn' | 'flutter', label: string, icon: any }) => (
    <button 
      onClick={() => setPlatform(id)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        padding: '0.75rem 1.25rem',
        borderRadius: '0.75rem',
        border: '1px solid',
        borderColor: platform === id ? '#3b82f6' : '#e2e8f0',
        background: platform === id ? '#eff6ff' : 'white',
        color: platform === id ? '#1d4ed8' : '#64748b',
        fontWeight: 600,
        fontSize: '0.9rem',
        cursor: 'pointer',
        transition: 'all 0.2s ease'
      }}
    >
      <Icon size={18} />
      {label}
    </button>
  );

  return (
    <div className="docs-layout" style={{ background: '#f8fafc', color: '#334155', lineHeight: 1.6, textAlign: 'left', padding: '1rem 0' }}>
      {/* Main Content */}
      <main style={{ padding: '3rem', maxWidth: '850px', margin: '0 auto', background: 'white', borderRadius: '1.5rem', boxShadow: '0 10px 40px -10px rgba(0,0,0,0.08)' }}>
        <header style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '2rem', marginBottom: '3rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.03em', margin: 0 }}>
              Integration Guide
            </h1>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <PlatformButton id="web" label="Web / React" icon={Monitor} />
              <PlatformButton id="rn" label="React Native" icon={Smartphone} />
              <PlatformButton id="flutter" label="Flutter" icon={Layers} />
            </div>
          </div>
          <p style={{ fontSize: '1.1rem', color: '#64748b', lineHeight: 1.6, maxWidth: '600px' }}>
            Deploy the <strong>Terra Oracle</strong> protocol to secure agriculture apps with hyper-local, real-time satellite intelligence.
          </p>
        </header>

        {/* 1. Installation */}
        <section id="installation" style={{ marginBottom: '4rem' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#0f172a', marginBottom: '1rem' }}>
            1. Installation
          </h2>
          {platform !== 'flutter' ? (
            <>
              <p style={{ marginBottom: '1rem' }}>
                Install the stateless Oracle SDK via NPM. It works seamlessly in both <strong>Web</strong> and <strong>Mobile (RN)</strong> environments.
              </p>
              <div style={{ background: '#0f172a', padding: '1.25rem', borderRadius: '0.5rem', color: '#f8fafc', fontFamily: 'monospace', fontSize: '0.9rem' }}>
                npm install @terra-oracle/terra-oracle
              </div>
              {platform === 'rn' && (
                <p style={{ marginTop: '1rem', fontSize: '0.85rem', color: '#64748b' }}>
                  Note: For React Native, ensure you have <code>react-native-geolocation-service</code> or similar installed for GPS access.
                </p>
              )}
            </>
          ) : (
            <>
              <p style={{ marginBottom: '1rem' }}>
                For Flutter, we recommend using the <strong>REST API</strong> implementation to fetch hyper-local data directly into your Dart models.
              </p>
              <div style={{ background: '#0f172a', padding: '1.25rem', borderRadius: '0.5rem', color: '#f8fafc', fontFamily: 'monospace', fontSize: '0.9rem' }}>
                # No package needed - uses standard http client
              </div>
            </>
          )}
        </section>

        {/* 2. Implementation Logic */}
        <section id="implementation" style={{ marginBottom: '4rem' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#0f172a', marginBottom: '1rem' }}>
            2. Core Implementation
          </h2>
          <div style={{ background: '#f1f5f9', padding: '1.25rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0' }}>
            <pre style={{ fontSize: '0.8rem', color: '#334155', overflowX: 'auto', lineHeight: 1.5 }}>
              {platform === 'web' && `import { getWeatherForecast, resolveLocation } from '@terra-oracle/terra-oracle';

const initOracle = async () => {
  const loc = await resolveLocation(); // Browser GPS
  const data = await getWeatherForecast({
    latitude: loc.latitude,
    longitude: loc.longitude
  });
  console.log("Local Temp:", data.current.temperature.value);
};`}
              {platform === 'rn' && `import { getWeatherForecast } from '@terra-oracle/terra-oracle';
import Geolocation from 'react-native-geolocation-service';

const initOracle = () => {
  Geolocation.getCurrentPosition(async (pos) => {
    const data = await getWeatherForecast({
      latitude: pos.coords.latitude,
      longitude: pos.coords.longitude
    });
    console.log("Mobile Temp:", data.current.temperature.value);
  });
};`}
              {platform === 'flutter' && `import 'package:http/http.dart' as http;
import 'dart:convert';

Future<void> initOracle(double lat, double lon) async {
  final url = "https://api.open-meteo.com/v1/forecast?latitude=$lat&longitude=$lon&current=temperature_2m&models=best_match";
  final response = await http.get(Uri.parse(url));
  
  if (response.statusCode == 200) {
    final data = json.decode(response.body);
    print("Flutter Temp: \${data['current']['temperature_2m']}");
  }
}`}
            </pre>
          </div>
        </section>

        {/* 3. Weather Forecast SDK */}
        <section id="forecast" style={{ marginBottom: '4rem' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#0f172a', marginBottom: '1rem' }}>
            3. Pure JSON Weather Forecast SDK
          </h2>
          <p style={{ marginBottom: '1rem' }}>
            The Oracle includes a stateless, design-free Weather Forecast module. It provides a 7-day outlook and automatically flags incoming severe rain and thunderstorms.
          </p>
          <div style={{ background: '#f1f5f9', padding: '1.25rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0' }}>
            <pre style={{ fontSize: '0.8rem', color: '#334155', overflowX: 'auto', lineHeight: 1.5 }}>{platform === 'flutter' ? `// For Flutter, parse the 'hourly' and 'daily' arrays from the REST response
// to build your own weekly forecast loop.` : `import { getWeatherForecast, resolveLocation } from '@terra-oracle/terra-oracle';

const fetchLocalForecast = async () => {
  const loc = await resolveLocation(); 
  const data = await getWeatherForecast({
    latitude: loc.latitude,
    longitude: loc.longitude
  });

  // Automatically check if a storm is approaching!
  if (data.alerts.storm.active) {
    console.warn("ORACLE ALERT:", data.alerts.storm.items[0].message);
  }

  // Access the 7-day forecast data
  data.week.forEach(day => {
    console.log(\`\${day.label}: Max \${day.temperature.max.value}°C\`);
  });
};`}</pre>
          </div>
        </section>

        {/* 4. Background Safety Sentinel */}
        <section id="sentinel" style={{ marginBottom: '4rem' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#0f172a', marginBottom: '1rem' }}>
            4. Background Safety Sentinel
          </h2>
          <p style={{ marginBottom: '1.5rem' }}>
            The SDK includes a lightweight <code>checkAlerts</code> function designed for background monitoring. It automatically enforces the <strong>Tiered Protocol Standards</strong>.
          </p>
          
          <div style={{ padding: '1.5rem', background: '#fffbeb', borderLeft: '4px solid #f59e0b', borderRadius: '0 0.5rem 0.5rem 0', marginBottom: '2rem' }}>
            <h4 style={{ fontWeight: 600, color: '#92400e', marginBottom: '0.5rem' }}>Tiered Alert Logic:</h4>
            <ul style={{ paddingLeft: '1.5rem', color: '#92400e', fontSize: '0.9rem' }}>
              <li><strong>SEVERE:</strong> Thunderstorms, Heavy Rain, Heat &gt; 40°C.</li>
              <li><strong>MODERATE:</strong> Steady Rain, Heat 35°C - 40°C.</li>
              <li><strong>MINOR:</strong> Drizzle, Slight Rain.</li>
            </ul>
          </div>

          <div style={{ background: '#0f172a', padding: '1.25rem', borderRadius: '0.5rem', border: '1px solid #1e293b' }}>
            <pre style={{ fontSize: '0.85rem', color: '#94a3b8', overflowX: 'auto' }}>{`import { checkAlerts } from '@terra-oracle/terra-oracle';

const monitorEnvironment = async () => {
  // Checks weather against tiered limits (Heat, Rain, Drizzle)
  const alerts = await checkAlerts({}); 
  
  if (alerts.length > 0) {
    // e.g. "ORACLE SEVERE: Thunderstorm currently active..."
    showNotification(alerts[0].message);
  }
};

setInterval(monitorEnvironment, 1000 * 60 * 5);`}</pre>
          </div>
        </section>

        {/* 5. AI Interfacing */}
        <section id="ai" style={{ marginBottom: '4rem' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#0f172a', marginBottom: '1rem' }}>
            5. Cognitive Layer (AI Interpretation)
          </h2>
          <p style={{ marginBottom: '1.5rem' }}>
            Terra Oracle outputs a structured <strong>Fact Sheet</strong>. The AI layer handles the professional Interpretation.
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

        {/* 6. Full Template */}
        {platform !== 'flutter' && (
          <section id="template" style={{ marginBottom: '4rem' }}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#0f172a', marginBottom: '1rem' }}>
              6. Full React Sentinel Template
            </h2>
            <div style={{ background: '#f1f5f9', padding: '1.25rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0' }}>
              <pre style={{ fontSize: '0.8rem', color: '#334155', overflowX: 'auto', lineHeight: 1.5 }}>{`import { analyzeField, checkAlerts } from '@terra-oracle/terra-oracle';

export const FarmerDashboard = () => {
    useEffect(() => {
        const sentinel = setInterval(async () => {
            const alerts = await checkAlerts({});
            if (alerts.length > 0) alert(alerts[0].message);
        }, 300000);
        return () => clearInterval(sentinel);
    }, []);

    const getAnalysis = async () => {
        const factSheet = await analyzeField({ subject: 'Poultry', category: 'ANIMAL' });
        // Handle result...
    };

    return <button onClick={getAnalysis}>Generate Analysis</button>;
};`}</pre>
            </div>
          </section>
        )}

        <section style={{ marginBottom: '2rem', padding: '2rem', background: '#ecfdf5', borderRadius: '1rem', border: '1px solid #d1fae5' }}>
          <h2 style={{ fontSize: '1.25rem', color: '#065f46', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ShieldCheck size={20} /> {platform !== 'flutter' ? '7' : '6'}. Zero-Key Architecture
          </h2>
          <p style={{ color: '#065f46', fontSize: '1rem', opacity: 0.9 }}>
            The protocol never asks for your Gemini API key. All AI interaction happens on your own client, ensuring full control over your credentials and costs.
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
