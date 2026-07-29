import { useState, useEffect } from 'react';
import './App.css';
import logo from './assets/coffeewallet_logo.png';
import Iridescence from './Iridescence';

function App() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkViewport = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkViewport();
    window.addEventListener('resize', checkViewport);
    return () => window.removeEventListener('resize', checkViewport);
  }, []);

  return (
    <div className="app-container">
      <Iridescence
        color={[0.27, 0.37, 0.20]}
        mouseReact
        amplitude={0.15}
        speed={0.8}
      />

      {isMobile ? (
        <div className="mobile-view animate-fade-in">
          <div className="center-content">
            <img src={logo} className="logo-image" alt="CoffeeWallet Logo" />
            <h1 className="brand-title">CoffeeWallet</h1>
            <div className="glow-bar"></div>
          </div>
        </div>
      ) : (
        <div className="desktop-view animate-fade-in">
          <div className="glass-card">
            <span className="warning-icon">📱</span>
            <h2 className="error-title">only supported in mobile</h2>
            <p className="error-message">
              CoffeeWallet is designed as a native mobile experience. To explore the layout, please scan the QR code with your phone or adjust your browser viewport.
            </p>
            
            <div className="qr-container">
              <div className="qr-simulated">
                <div className="qr-eye eye-top-left"></div>
                <div className="qr-eye eye-top-right"></div>
                <div className="qr-eye eye-bottom-left"></div>
                <div className="qr-data-dots"></div>
              </div>
              <div className="qr-instructions">
                <h3>Scan to Open Mobile</h3>
                <p>Point your camera to scan and test on your mobile device.</p>
              </div>
            </div>
            
            <div className="dev-tip">
              <span>💡</span>
              <p>Press <kbd>F12</kbd> &gt; toggle device emulator &gt; reload to test.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
