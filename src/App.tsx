import { useState, useEffect } from 'react';
import { checkAlerts, getWeatherForecast } from '@terra-oracle/terra-oracle';
import { BookOpen, X, AlertTriangle, CloudSun, Leaf, PawPrint, Cloud, ThermometerSun } from 'lucide-react';
import DeveloperDocs from './docs/docs';
import CropPage from './pages/CropPage';
import AnimalPage from './pages/AnimalPage';
import WeatherPage from './pages/WeatherPage';
import ThermalPage from './pages/ThermalPage';

function App() {
  const [view, setView] = useState<'crop' | 'animal' | 'weather' | 'thermal' | 'docs'>('crop');
  const [forecast, setForecast] = useState<any>(null);
  
  // Alert State
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [activeAlert, setActiveAlert] = useState<string | null>(null);

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

    // Fetch Weather Forecast Widget Data
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (pos) => {
        try {
          const data = await getWeatherForecast({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude
          });
          setForecast(data);

          // Check for severe storms/rain
          if (data.alerts.storm.active && !sessionStorage.getItem('oracle_alert_dismissed')) {
            setActiveAlert(data.alerts.storm.items[0].message);
            setShowAlertModal(true);
          }
        } catch (e) {
          console.error("Forecast failed:", e);
        }
      });
    }

    return () => clearInterval(sentinel);
  }, []);

  const dismissAlert = () => {
    setShowAlertModal(false);
    sessionStorage.setItem('oracle_alert_dismissed', 'true');
  };

  return (
    <div className="container" style={{ maxWidth: '800px', padding: '2rem 1rem', margin: '0 auto' }}>
      {/* Protocol Alert Toast */}
      {showAlertModal && activeAlert && (
        <div style={{
          position: 'fixed', top: '1.5rem', right: '1.5rem', zIndex: 1000, animation: 'fadeIn 0.3s ease-out'
        }}>
          <div style={{
            background: 'white', borderRadius: '1rem', padding: '1.5rem', width: '320px',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)', borderLeft: '4px solid #ef4444', position: 'relative'
          }}>
            <button onClick={dismissAlert} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'transparent', border: 'none', cursor: 'pointer', color: '#94a3b8' }}>
              <X size={16} />
            </button>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
              <AlertTriangle size={24} color="#ef4444" style={{ flexShrink: 0 }} />
              <div>
                <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.25rem' }}>Oracle Warning</h2>
                <p style={{ color: '#475569', fontSize: '0.85rem', marginBottom: '1rem', lineHeight: 1.4 }}>{activeAlert}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header and Forecast Widget */}
      <header style={{ marginBottom: '2rem', textAlign: 'center', display: 'flex', justifyContent: 'center', gap: '2rem', alignItems: 'center', flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}>
            Terra Oracle v1.1.17
          </h1>
          <p className="subtitle" style={{ fontSize: '0.9rem' }}>Multimodal Climate Adaptation Protocol</p>
        </div>
        
        {forecast && (
          <div style={{ flex: '0 0 140px', padding: '1rem', borderRadius: '1.25rem', background: '#1e293b', color: 'white', display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#94a3b8', fontSize: '0.6rem', fontWeight: 600, letterSpacing: '0.05em', marginBottom: '0.5rem', justifyContent: 'center' }}>
              <CloudSun size={10} /> LIVE
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{forecast.current.temperature.value}°C</div>
            <div style={{ fontSize: '0.7rem', color: '#cbd5e1' }}>{forecast.current.weather.label}</div>
          </div>
        )}
      </header>

      {/* Navigation */}
      <nav style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginBottom: '3rem', flexWrap: 'wrap' }}>
        <button onClick={() => setView('crop')} style={{ background: view === 'crop' ? '#166534' : 'transparent', color: view === 'crop' ? 'white' : '#64748b', border: view === 'crop' ? 'none' : '1px solid #e2e8f0', padding: '0.5rem 1rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem', borderRadius: '0.5rem' }}>
          <Leaf size={14} /> Crop
        </button>
        <button onClick={() => setView('animal')} style={{ background: view === 'animal' ? '#b91c1c' : 'transparent', color: view === 'animal' ? 'white' : '#64748b', border: view === 'animal' ? 'none' : '1px solid #e2e8f0', padding: '0.5rem 1rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem', borderRadius: '0.5rem' }}>
          <PawPrint size={14} /> Animal
        </button>
        <button onClick={() => setView('weather')} style={{ background: view === 'weather' ? '#0ea5e9' : 'transparent', color: view === 'weather' ? 'white' : '#64748b', border: view === 'weather' ? 'none' : '1px solid #e2e8f0', padding: '0.5rem 1rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem', borderRadius: '0.5rem' }}>
          <Cloud size={14} /> Weather
        </button>
        <button onClick={() => setView('thermal')} style={{ background: view === 'thermal' ? '#ea580c' : 'transparent', color: view === 'thermal' ? 'white' : '#64748b', border: view === 'thermal' ? 'none' : '1px solid #e2e8f0', padding: '0.5rem 1rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem', borderRadius: '0.5rem' }}>
          <ThermometerSun size={14} /> Thermal
        </button>
        <button onClick={() => setView('docs')} style={{ background: view === 'docs' ? '#111827' : 'transparent', color: view === 'docs' ? 'white' : '#64748b', border: view === 'docs' ? 'none' : '1px solid #e2e8f0', padding: '0.5rem 1rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem', borderRadius: '0.5rem' }}>
          <BookOpen size={14} /> Docs
        </button>
      </nav>

      {/* Routing Views */}
      <main>
        {view === 'crop' && <CropPage />}
        {view === 'animal' && <AnimalPage />}
        {view === 'weather' && <WeatherPage />}
        {view === 'thermal' && <ThermalPage />}
        {view === 'docs' && <DeveloperDocs />}
      </main>
    </div>
  );
}

export default App;
