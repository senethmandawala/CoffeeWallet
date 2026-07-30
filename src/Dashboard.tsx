import { useState } from 'react';
import { 
  Lock, Copy, Check, Send, ArrowDownLeft, ArrowUpRight, 
  TrendingUp, Activity, Coffee, User, X
} from 'lucide-react';
import './Dashboard.css';

interface DashboardProps {
  onLogout: () => void;
}

interface Transaction {
  id: string;
  type: 'send' | 'receive' | 'stake';
  title: string;
  date: string;
  amount: number;
  status: 'completed' | 'pending';
}

export default function Dashboard({ onLogout }: DashboardProps) {
  const userEmail = localStorage.getItem('coffeewallet_user_email') || 'user@coffeewallet.io';
  const displayEmail = userEmail.split('@')[0];
  const walletAddress = '0x7bC0FFEE55d882a11b981d882a116693e936693e';
  
  const [copied, setCopied] = useState(false);
  const [balance, setBalance] = useState(1280);
  const [showSendModal, setShowSendModal] = useState(false);
  const [showReceiveModal, setShowReceiveModal] = useState(false);
  
  // Form states for Sending
  const [sendAddress, setSendAddress] = useState('');
  const [sendAmount, setSendAmount] = useState('');
  const [sendError, setSendError] = useState('');
  const [sendSuccess, setSendSuccess] = useState(false);
  
  const [transactions, setTransactions] = useState<Transaction[]>([
    { id: '1', type: 'receive', title: 'Reward Claimed', date: 'Today, 2:14 PM', amount: 50, status: 'completed' },
    { id: '2', type: 'send', title: 'Bought Espresso', date: 'Yesterday, 8:40 AM', amount: 15, status: 'completed' },
    { id: '3', type: 'stake', title: 'Staked Dark Roast', date: 'July 28, 6:15 PM', amount: 200, status: 'completed' },
    { id: '4', type: 'receive', title: 'Received from 0x3d...2a', date: 'July 25, 11:30 AM', amount: 120, status: 'completed' }
  ]);

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(walletAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sendAddress.trim()) {
      setSendError('Recipient address is required');
      return;
    }
    if (!sendAddress.startsWith('0x') || sendAddress.length < 15) {
      setSendError('Invalid wallet address format');
      return;
    }
    const amt = parseFloat(sendAmount);
    if (isNaN(amt) || amt <= 0) {
      setSendError('Enter a valid amount');
      return;
    }
    if (amt > balance) {
      setSendError('Insufficient balance');
      return;
    }

    setSendError('');
    // Deduct from balance
    setBalance(prev => prev - amt);
    
    // Add transaction
    const newTx: Transaction = {
      id: Date.now().toString(),
      type: 'send',
      title: `Sent to ${sendAddress.substring(0, 6)}...${sendAddress.substring(sendAddress.length - 4)}`,
      date: 'Just now',
      amount: amt,
      status: 'completed'
    };
    setTransactions([newTx, ...transactions]);
    setSendSuccess(true);
    
    setTimeout(() => {
      setSendSuccess(false);
      setShowSendModal(false);
      setSendAddress('');
      setSendAmount('');
    }, 2000);
  };

  return (
    <div className="dashboard-container animate-fade-in">
      {/* Top Navbar */}
      <header className="dashboard-header">
        <div className="profile-section">
          <div className="avatar">
            <User size={18} />
          </div>
          <span className="profile-name">hi, {displayEmail}</span>
        </div>
        <button className="lock-wallet-btn" onClick={onLogout}>
          <Lock size={16} />
          <span>Lock</span>
        </button>
      </header>

      {/* Balance Card */}
      <div className="glass-balance-card">
        <div className="balance-top">
          <div className="balance-label">
            <Coffee className="coffee-icon" size={16} />
            <span>Total Bean Balance</span>
          </div>
          <div className="trend-tag">
            <TrendingUp size={12} />
            <span>+4.2%</span>
          </div>
        </div>
        <div className="balance-value">
          <span className="coin-amount">{balance.toLocaleString()}</span>
          <span className="coin-symbol"> COFFEE</span>
        </div>
        <div className="balance-fiat">
          ≈ ${(balance * 3.12).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD
        </div>

        {/* Address Display */}
        <div className="address-bar" onClick={handleCopyAddress}>
          <span className="address-text">
            {walletAddress.substring(0, 10)}...{walletAddress.substring(walletAddress.length - 10)}
          </span>
          <button className="copy-btn">
            {copied ? <Check size={14} className="copied-check" /> : <Copy size={14} />}
          </button>
        </div>
      </div>

      {/* Main Actions */}
      <div className="action-grid">
        <button className="action-btn send" onClick={() => setShowSendModal(true)}>
          <div className="action-icon-circle">
            <Send size={20} />
          </div>
          <span>Send</span>
        </button>

        <button className="action-btn receive" onClick={() => setShowReceiveModal(true)}>
          <div className="action-icon-circle">
            <ArrowDownLeft size={20} />
          </div>
          <span>Receive</span>
        </button>

        <button className="action-btn stake">
          <div className="action-icon-circle">
            <Activity size={20} />
          </div>
          <span>Stake</span>
        </button>
      </div>

      {/* Transactions Section */}
      <div className="transactions-section">
        <div className="section-header">
          <h3>Recent Transactions</h3>
          <a href="#all" className="view-all-link">See all</a>
        </div>

        <div className="tx-list">
          {transactions.map((tx) => (
            <div key={tx.id} className="tx-item">
              <div className={`tx-icon ${tx.type}`}>
                {tx.type === 'receive' ? <ArrowDownLeft size={16} /> : <ArrowUpRight size={16} />}
              </div>
              <div className="tx-info">
                <span className="tx-title">{tx.title}</span>
                <span className="tx-date">{tx.date}</span>
              </div>
              <div className="tx-amount-section">
                <span className={`tx-amount ${tx.type}`}>
                  {tx.type === 'receive' ? '+' : '-'}{tx.amount}
                </span>
                <span className="tx-symbol">BEANS</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SEND MODAL */}
      {showSendModal && (
        <div className="modal-overlay">
          <div className="glass-modal animate-scale-up">
            <div className="modal-header">
              <h3>Send Beans</h3>
              <button className="modal-close" onClick={() => setShowSendModal(false)}>
                <X size={18} />
              </button>
            </div>
            
            {sendSuccess ? (
              <div className="modal-success-view">
                <Check className="success-icon" size={48} />
                <h4>Transfer Successful!</h4>
                <p>Beans have been dispatched securely.</p>
              </div>
            ) : (
              <form onSubmit={handleSendSubmit} className="modal-form">
                <div className="modal-form-group">
                  <label>Recipient Wallet Address</label>
                  <input
                    type="text"
                    placeholder="0x..."
                    value={sendAddress}
                    onChange={(e) => setSendAddress(e.target.value)}
                    className="modal-input"
                  />
                </div>
                <div className="modal-form-group">
                  <label>Amount (COFFEE)</label>
                  <input
                    type="number"
                    placeholder="0.00"
                    value={sendAmount}
                    onChange={(e) => setSendAmount(e.target.value)}
                    className="modal-input"
                  />
                </div>
                {sendError && <span className="modal-error">{sendError}</span>}
                <button type="submit" className="modal-submit-btn">
                  Confirm Send
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* RECEIVE MODAL */}
      {showReceiveModal && (
        <div className="modal-overlay">
          <div className="glass-modal receive-modal animate-scale-up">
            <div className="modal-header">
              <h3>Receive Beans</h3>
              <button className="modal-close" onClick={() => setShowReceiveModal(false)}>
                <X size={18} />
              </button>
            </div>
            <div className="qr-box">
              <img 
                src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&color=065f46&data=${walletAddress}`} 
                alt="Receive QR" 
                className="modal-qr-image"
              />
            </div>
            <p className="qr-desc">Scan this QR code to transfer coffee beans into this wallet.</p>
            <div className="modal-address-box" onClick={handleCopyAddress}>
              <code>{walletAddress.substring(0, 16)}...{walletAddress.substring(walletAddress.length - 8)}</code>
              <Copy size={14} className="copy-sub-icon" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
