import { useState, useEffect } from 'react';
import './App.css';
import { CoffeeScriptDark } from '@nimr0d/react-skill-icons-vite';
import Plasma from './Plasma';
import LoginPage from './LoginPage';
import Dashboard from './Dashboard';

function App() {
  const [isMobile, setIsMobile] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem('coffeewallet_is_logged_in') === 'true'
  );

  useEffect(() => {
    const checkViewport = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkViewport();
    window.addEventListener('resize', checkViewport);
    return () => window.removeEventListener('resize', checkViewport);
  }, []);

  // Splash screen transition timer
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2200);
    return () => clearTimeout(timer);
  }, []);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    localStorage.setItem('coffeewallet_is_logged_in', 'true');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('coffeewallet_is_logged_in');
    localStorage.removeItem('coffeewallet_user_email');
  };

  return (
    <div className="app-container">
      <Plasma 
        color="#065f46"
        speed={0.4}
        direction="forward"
        scale={1.2}
        opacity={0.85}
        mouseInteractive={true}
        renderScale={0.55}
        maxDpr={1.5}
        targetFps={60}
        iterations={60}
      />

      {isMobile ? (
        <div className="mobile-view animate-fade-in">
          {showSplash ? (
            <div className="center-content">
              <CoffeeScriptDark className="logo-image" />
              <h1 className="brand-title">CoffeeWallet</h1>
              <div className="glow-bar"></div>
            </div>
          ) : isLoggedIn ? (
            <Dashboard onLogout={handleLogout} />
          ) : (
            <LoginPage onLoginSuccess={handleLoginSuccess} />
          )}
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
              <div className="qr-simulated-wrapper">
                <img 
                  src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&color=065f46&data=https://senethmandawala.github.io/CoffeeWallet/" 
                  className="qr-image" 
                  alt="CoffeeWallet Deployed URL QR Code" 
                />
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
