import { useState, useEffect } from 'react';
import { Mail, Lock, Eye, EyeOff, LogIn, Fingerprint, CheckCircle2, ShieldAlert, KeyRound, Copy, Check } from 'lucide-react';
import { CoffeeScriptDark } from '@nimr0d/react-skill-icons-vite';
import './LoginPage.css';

interface LoginPageProps {
  onLoginSuccess?: () => void;
}

const SEED_WORDS = ['espresso', 'roast', 'latte', 'bean', 'grind', 'crema', 'steam', 'aroma', 'mocha', 'brew', 'cup', 'filter'];

export default function LoginPage({ onLoginSuccess }: LoginPageProps) {
  const [viewState, setViewState] = useState<'login' | 'register' | 'recovery-phrase'>('login');
  
  // Login form states
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginEmailError, setLoginEmailError] = useState('');
  const [loginPasswordError, setLoginPasswordError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  // Register form states
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regEmailError, setRegEmailError] = useState('');
  const [regPasswordError, setRegPasswordError] = useState('');
  const [regConfirmError, setRegConfirmError] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [termsError, setTermsError] = useState(false);

  // Recovery phrase states
  const [copiedPhrase, setCopiedPhrase] = useState(false);
  const [confirmedBackup, setConfirmedBackup] = useState(false);
  const [backupError, setBackupError] = useState('');

  // Password visibility states
  const [showLoginPass, setShowLoginPass] = useState(false);
  const [showRegPass, setShowRegPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  // Loading sequence states
  const [loginState, setLoginState] = useState<'idle' | 'loading' | 'success'>('idle');
  const [loadingMsg, setLoadingMsg] = useState('');
  const [loadingProgress, setLoadingProgress] = useState(0);

  const validateLogin = () => {
    let isValid = true;
    if (!loginEmail.trim()) {
      setLoginEmailError('Email or username is required');
      isValid = false;
    } else {
      setLoginEmailError('');
    }

    if (!loginPassword) {
      setLoginPasswordError('Password is required');
      isValid = false;
    } else {
      setLoginPasswordError('');
    }

    return isValid;
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateLogin()) return;

    localStorage.setItem('coffeewallet_user_email', loginEmail);
    setLoginState('loading');
  };

  const validateRegister = () => {
    let isValid = true;
    
    if (!regEmail.trim()) {
      setRegEmailError('Email address is required');
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(regEmail)) {
      setRegEmailError('Please enter a valid email');
      isValid = false;
    } else {
      setRegEmailError('');
    }

    if (!regPassword) {
      setRegPasswordError('Password is required');
      isValid = false;
    } else if (regPassword.length < 8) {
      setRegPasswordError('Password must be at least 8 characters');
      isValid = false;
    } else {
      setRegPasswordError('');
    }

    if (regConfirmPassword !== regPassword) {
      setRegConfirmError('Passwords do not match');
      isValid = false;
    } else {
      setRegConfirmError('');
    }

    if (!acceptTerms) {
      setTermsError(true);
      isValid = false;
    } else {
      setTermsError(false);
    }

    return isValid;
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateRegister()) return;

    setViewState('recovery-phrase');
  };

  const handleCopyPhrase = () => {
    const textToCopy = SEED_WORDS.join(' ');
    navigator.clipboard.writeText(textToCopy);
    setCopiedPhrase(true);
    setTimeout(() => setCopiedPhrase(false), 2000);
  };

  const handleSetupComplete = () => {
    if (!confirmedBackup) {
      setBackupError('You must confirm you have backed up the phrase');
      return;
    }
    setBackupError('');
    localStorage.setItem('coffeewallet_user_email', regEmail);
    setLoginState('loading');
  };

  useEffect(() => {
    if (loginState !== 'loading') return;

    const messages = [
      viewState === 'recovery-phrase' ? 'Generating secure cryptographic keys...' : 'Verifying credentials...',
      'Securing enclave connection...',
      viewState === 'recovery-phrase' ? 'Backing up encrypted wallet data...' : 'Decrypting wallet keys...',
      'Syncing block balances...',
      'Finishing setup...'
    ];

    let currentMsgIdx = 0;
    setLoadingMsg(messages[0]);
    setLoadingProgress(5);

    const msgInterval = setInterval(() => {
      currentMsgIdx++;
      if (currentMsgIdx < messages.length) {
        setLoadingMsg(messages[currentMsgIdx]);
        setLoadingProgress((prev) => Math.min(prev + 20, 90));
      }
    }, 900);

    const progressInterval = setInterval(() => {
      setLoadingProgress((prev) => {
        if (prev >= 95) return 95;
        return prev + Math.floor(Math.random() * 8) + 2;
      });
    }, 250);

    const finishTimeout = setTimeout(() => {
      clearInterval(msgInterval);
      clearInterval(progressInterval);
      setLoadingProgress(100);
      setLoginState('success');
    }, 4500);

    return () => {
      clearInterval(msgInterval);
      clearInterval(progressInterval);
      clearTimeout(finishTimeout);
    };
  }, [loginState, viewState]);

  useEffect(() => {
    if (loginState === 'success') {
      const successTimeout = setTimeout(() => {
        if (onLoginSuccess) {
          onLoginSuccess();
        }
      }, 1500);
      return () => clearTimeout(successTimeout);
    }
  }, [loginState, onLoginSuccess]);

  if (loginState === 'loading') {
    return (
      <div className="login-page-container animate-fade-in">
        <div className="glass-login-card loading-card">
          <div className="loader-ring">
            <div className="spinner-border"></div>
            <Fingerprint className="pulse-fingerprint" size={32} />
          </div>
          <h2 className="loading-status-title">
            {viewState === 'recovery-phrase' ? 'creating wallet' : 'unlocking wallet'}
          </h2>
          <div className="progress-bar-container">
            <div className="progress-bar-fill" style={{ width: `${loadingProgress}%` }}></div>
          </div>
          <p className="loading-msg-text">{loadingMsg}</p>
          <span className="loading-progress-percentage">{loadingProgress}%</span>
        </div>
      </div>
    );
  }

  if (loginState === 'success') {
    return (
      <div className="login-page-container animate-fade-in">
        <div className="glass-login-card success-card">
          <CheckCircle2 className="success-checkmark" size={64} />
          <h2 className="success-status-title">
            {viewState === 'recovery-phrase' ? 'wallet created!' : 'wallet unlocked!'}
          </h2>
          <p className="success-msg-text">
            {viewState === 'recovery-phrase' ? 'Setting up secure dashboard...' : 'Redirecting to account dashboard...'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="login-page-container animate-fade-in">
      <div className="login-header">
        <CoffeeScriptDark className="login-logo" />
        <h1 className="login-brand-title">CoffeeWallet</h1>
      </div>

      {/* LOGIN CARD */}
      {viewState === 'login' && (
        <div className="glass-login-card">
          <div className="card-top">
            <h2>welcome back</h2>
            <p>unsecure your wallet to access your coffee beans</p>
          </div>

          <form onSubmit={handleLoginSubmit} className="login-form" noValidate>
            <div className="form-group">
              <label className="form-label">username or email</label>
              <div className={`input-wrapper ${loginEmailError ? 'input-error' : ''}`}>
                <Mail className="input-icon" size={18} />
                <input
                  type="text"
                  placeholder="coffeelover@domain.com"
                  value={loginEmail}
                  onChange={(e) => {
                    setLoginEmail(e.target.value);
                    if (loginEmailError) setLoginEmailError('');
                  }}
                  className="form-input"
                />
              </div>
              {loginEmailError && (
                <span className="error-message">
                  <ShieldAlert size={12} className="err-icon" />
                  {loginEmailError}
                </span>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">password</label>
              <div className={`input-wrapper ${loginPasswordError ? 'input-error' : ''}`}>
                <Lock className="input-icon" size={18} />
                <input
                  type={showLoginPass ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={loginPassword}
                  onChange={(e) => {
                    setLoginPassword(e.target.value);
                    if (loginPasswordError) setLoginPasswordError('');
                  }}
                  className="form-input"
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowLoginPass(!showLoginPass)}
                  tabIndex={-1}
                >
                  {showLoginPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {loginPasswordError && (
                <span className="error-message">
                  <ShieldAlert size={12} className="err-icon" />
                  {loginPasswordError}
                </span>
              )}
            </div>

            <div className="form-actions">
              <label className="checkbox-container">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span className="checkmark"></span>
                remember me
              </label>
              <a href="#forgot" className="forgot-link">forgot password?</a>
            </div>

            <button type="submit" className="login-submit-btn">
              unlock wallet
              <LogIn size={18} className="btn-icon" />
            </button>
          </form>

          <div className="card-footer">
            <p>
              Don't have a wallet? <a href="#create" className="register-link" onClick={(e) => { e.preventDefault(); setViewState('register'); }}>Create Wallet</a>
            </p>
          </div>
        </div>
      )}

      {/* REGISTER / CREATE WALLET CARD */}
      {viewState === 'register' && (
        <div className="glass-login-card">
          <div className="card-top">
            <h2>create password</h2>
            <p>secure your new coffee wallet with a strong password</p>
          </div>

          <form onSubmit={handleRegisterSubmit} className="login-form" noValidate>
            <div className="form-group">
              <label className="form-label">email address</label>
              <div className={`input-wrapper ${regEmailError ? 'input-error' : ''}`}>
                <Mail className="input-icon" size={18} />
                <input
                  type="email"
                  placeholder="coffeelover@domain.com"
                  value={regEmail}
                  onChange={(e) => {
                    setRegEmail(e.target.value);
                    if (regEmailError) setRegEmailError('');
                  }}
                  className="form-input"
                />
              </div>
              {regEmailError && (
                <span className="error-message">
                  <ShieldAlert size={12} className="err-icon" />
                  {regEmailError}
                </span>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">new password</label>
              <div className={`input-wrapper ${regPasswordError ? 'input-error' : ''}`}>
                <Lock className="input-icon" size={18} />
                <input
                  type={showRegPass ? 'text' : 'password'}
                  placeholder="At least 8 characters"
                  value={regPassword}
                  onChange={(e) => {
                    setRegPassword(e.target.value);
                    if (regPasswordError) setRegPasswordError('');
                  }}
                  className="form-input"
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowRegPass(!showRegPass)}
                  tabIndex={-1}
                >
                  {showRegPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {regPasswordError && (
                <span className="error-message">
                  <ShieldAlert size={12} className="err-icon" />
                  {regPasswordError}
                </span>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">confirm password</label>
              <div className={`input-wrapper ${regConfirmError ? 'input-error' : ''}`}>
                <Lock className="input-icon" size={18} />
                <input
                  type={showConfirmPass ? 'text' : 'password'}
                  placeholder="Confirm password"
                  value={regConfirmPassword}
                  onChange={(e) => {
                    setRegConfirmPassword(e.target.value);
                    if (regConfirmError) setRegConfirmError('');
                  }}
                  className="form-input"
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowConfirmPass(!showConfirmPass)}
                  tabIndex={-1}
                >
                  {showConfirmPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {regConfirmError && (
                <span className="error-message">
                  <ShieldAlert size={12} className="err-icon" />
                  {regConfirmError}
                </span>
              )}
            </div>

            <div className="form-actions">
              <label className={`checkbox-container ${termsError ? 'checkbox-err' : ''}`}>
                <input
                  type="checkbox"
                  checked={acceptTerms}
                  onChange={(e) => {
                    setAcceptTerms(e.target.checked);
                    if (termsError) setTermsError(false);
                  }}
                />
                <span className="checkmark"></span>
                I accept terms & conditions
              </label>
            </div>
            {termsError && (
              <span className="error-message" style={{ marginTop: '-8px' }}>
                <ShieldAlert size={12} className="err-icon" />
                You must accept terms & conditions
              </span>
            )}

            <button type="submit" className="login-submit-btn">
              continue setup
              <KeyRound size={18} className="btn-icon" />
            </button>
          </form>

          <div className="card-footer">
            <p>
              Already have a wallet? <a href="#login" className="register-link" onClick={(e) => { e.preventDefault(); setViewState('login'); }}>Login</a>
            </p>
          </div>
        </div>
      )}

      {/* RECOVERY PHRASE CARD */}
      {viewState === 'recovery-phrase' && (
        <div className="glass-login-card recovery-card">
          <div className="card-top">
            <h2>wallet backup phrase</h2>
            <p>Write down or copy these 12 words in order. They are the only way to recover your wallet if you forget your password.</p>
          </div>

          <div className="seed-phrase-grid">
            {SEED_WORDS.map((word, idx) => (
              <div key={idx} className="seed-word-item">
                <span className="word-index">{idx + 1}</span>
                <span className="word-text">{word}</span>
              </div>
            ))}
          </div>

          <button type="button" className="copy-phrase-btn" onClick={handleCopyPhrase}>
            {copiedPhrase ? (
              <>
                <Check size={16} />
                <span>Copied recovery phrase</span>
              </>
            ) : (
              <>
                <Copy size={16} />
                <span>Copy recovery phrase</span>
              </>
            )}
          </button>

          <div className="backup-confirmation-box">
            <label className="checkbox-container">
              <input
                type="checkbox"
                checked={confirmedBackup}
                onChange={(e) => {
                  setConfirmedBackup(e.target.checked);
                  if (backupError) setBackupError('');
                }}
              />
              <span className="checkmark"></span>
              I have saved my backup phrase securely
            </label>
            {backupError && (
              <span className="error-message" style={{ marginTop: '8px' }}>
                <ShieldAlert size={12} className="err-icon" />
                {backupError}
              </span>
            )}
          </div>

          <button type="button" className="login-submit-btn" onClick={handleSetupComplete}>
            complete setup
            <CheckCircle2 size={18} />
          </button>
        </div>
      )}
    </div>
  );
}
