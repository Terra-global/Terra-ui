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

        {/* 3. Alert Sentinel */}
        <section id="sentinel" style={{ marginBottom: '4rem' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#0f172a', marginBottom: '1rem' }}>
            3. Hyper-Local Alert Sentinel
          </h2>
          <p style={{ marginBottom: '1rem' }}>
            Enforce the <strong>Terra Oracle Safety Standards</strong> (40°C Heat Limit & Rain Detection) across any platform.
          </p>
          <div style={{ padding: '1.5rem', background: '#fffbeb', borderLeft: '4px solid #f59e0b', borderRadius: '0 0.5rem 0.5rem 0' }}>
            <h4 style={{ fontWeight: 600, color: '#92400e', marginBottom: '0.5rem' }}>Tiered Alert Logic:</h4>
            <ul style={{ paddingLeft: '1.5rem', color: '#92400e', fontSize: '0.9rem' }}>
              <li><strong>SEVERE:</strong> Thunderstorms, Heavy Rain, Heat &gt; 40°C.</li>
              <li><strong>MODERATE:</strong> Steady Rain, Heat 35°C - 40°C.</li>
              <li><strong>MINOR:</strong> Drizzle, Slight Rain.</li>
            </ul>
          </div>
        </section>

        <section style={{ marginBottom: '2rem', padding: '2rem', background: '#ecfdf5', borderRadius: '1rem', border: '1px solid #d1fae5' }}>
          <h2 style={{ fontSize: '1.25rem', color: '#065f46', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ShieldCheck size={20} /> 4. Cross-Platform Assurance
          </h2>
          <p style={{ color: '#065f46', fontSize: '1rem', opacity: 0.9 }}>
            Whether it's a web dashboard or a field agent's mobile app, the <strong>@terra-oracle/terra-oracle</strong> protocol ensures consistent, high-accuracy climate monitoring with zero server-side maintenance.
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
