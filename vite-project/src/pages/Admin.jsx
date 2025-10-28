// Admin Page - Generate QR invitation codes
// Requires master token for access

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { inviteAPI } from '../api';

function Admin() {
  const navigate = useNavigate();
  const [masterToken, setMasterToken] = useState('');
  const [qrData, setQrData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async (e) => {
    e.preventDefault();
    setError('');
    setQrData(null);

    if (!masterToken.trim()) {
      setError('Master token is required');
      return;
    }

    setLoading(true);

    try {
      const response = await inviteAPI.generateQR(masterToken);
      setQrData(response);
    } catch (err) {
      setError(err.message || 'Failed to generate invitation. Check your master token.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadQR = () => {
    if (!qrData) return;

    const link = document.createElement('a');
    link.href = qrData.qrCode;
    link.download = `clandestine-invite-${Date.now()}.png`;
    link.click();
  };

  const handleCopyURL = () => {
    if (!qrData) return;
    navigator.clipboard.writeText(qrData.inviteUrl);
    alert('Invitation URL copied to clipboard!');
  };

  return (
    <div className="min-h-screen bg-clandestine-darkest p-4">
      {/* Header */}
      <div className="max-w-3xl mx-auto pt-8 pb-6">
        <div className="flex justify-between items-center mb-2">
          <div>
            <div className="text-xs text-gray-600 mb-2 tracking-widest font-mono">ADMIN CONTROL</div>
            <h1 className="text-2xl font-bold text-gray-100 mb-1 font-mono">IF I TELL YOU</h1>
            <h2 className="text-2xl font-bold font-mono">
              <span className="text-red-500">I'M GOING TO KILL YOU</span>
            </h2>
          </div>
          <button
            onClick={() => navigate('/')}
            className="text-gray-400 hover:text-gray-200 text-xs transition-colors font-mono"
          >
            ← RETURN
          </button>
        </div>
        <p className="text-gray-500 mt-3 text-xs font-mono tracking-wider">CREDENTIAL GENERATION TERMINAL</p>
      </div>

      <div className="max-w-3xl mx-auto">
        {/* Admin info banner */}
        <div className="bg-clandestine-blue/10 border border-clandestine-blue/30 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <span className="text-2xl">🔑</span>
            <div>
              <h3 className="text-gray-200 font-semibold mb-1">You Are the Only Admin</h3>
              <p className="text-gray-400 text-sm">
                Only you have the master token. Each QR code you generate is <strong>reusable</strong> 
                and can be shared with multiple people to invite them.
              </p>
            </div>
          </div>
        </div>

        {/* Master token input */}
        <div className="card mb-6">
          <h2 className="text-xl font-semibold text-gray-200 mb-4">
            Generate New Invitation
          </h2>
          
          <form onSubmit={handleGenerate}>
            <div className="mb-4">
              <label htmlFor="masterToken" className="block text-gray-400 text-sm mb-2">
                Admin Master Token
              </label>
              <input
                type="password"
                id="masterToken"
                value={masterToken}
                onChange={(e) => setMasterToken(e.target.value)}
                className="input-field w-full"
                placeholder="Enter your master token"
                disabled={loading}
              />
              <p className="text-gray-600 text-xs mt-2">
                🔒 Only you have this token (found in backend/.env)
              </p>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-900/20 border border-red-800 rounded text-red-400 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="btn-primary w-full"
              disabled={loading}
            >
              {loading ? 'Generating...' : 'Generate Reusable QR Code'}
            </button>
          </form>
        </div>

        {/* QR Code display */}
        {qrData && (
          <div className="card">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold text-green-400 mb-2 font-mono">
                ✓ CREDENTIAL GENERATED
              </h3>
              <p className="text-gray-400 text-xs font-mono">
                REUSABLE AUTHENTICATION TOKEN · DISTRIBUTE TO <strong className="text-gray-300">MULTIPLE OPERATIVES</strong>
              </p>
            </div>

            {/* QR Code image */}
            <div className="bg-white p-8 rounded-lg mb-6 mx-auto max-w-md">
              <img
                src={qrData.qrCode}
                alt="Invitation QR Code"
                className="w-full h-auto"
              />
            </div>

            {/* Invitation details */}
            <div className="bg-clandestine-medium border border-gray-700 rounded p-4 mb-4">
              <h4 className="text-gray-300 font-semibold mb-2 text-sm">Invitation URL:</h4>
              <div className="bg-clandestine-dark p-3 rounded border border-gray-800 break-all text-gray-400 text-sm font-mono">
                {qrData.inviteUrl}
              </div>
            </div>

            <div className="bg-clandestine-medium border border-gray-700 rounded p-4 mb-6">
              <h4 className="text-gray-300 font-semibold mb-2 text-sm">Token:</h4>
              <div className="bg-clandestine-dark p-3 rounded border border-gray-800 break-all text-gray-400 text-sm font-mono">
                {qrData.inviteToken}
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleDownloadQR}
                className="btn-primary flex-1"
              >
                Download QR Code
              </button>
              <button
                onClick={handleCopyURL}
                className="btn-secondary flex-1"
              >
                Copy URL
              </button>
            </div>

            {/* Instructions */}
            <div className="mt-6 pt-6 border-t border-gray-800 text-xs text-gray-500 font-mono">
              <p className="mb-2 font-semibold text-gray-400">DISTRIBUTION PROTOCOL:</p>
              <ol className="space-y-1 list-decimal list-inside">
                <li>Download QR credential or copy secure URL</li>
                <li>Transmit to <strong className="text-gray-400">ONE VERIFIED DBTC OPERATIVE</strong> via secure channel</li>
                <li>Operative scans/opens credential for network access</li>
                <li>Token expires after single use—generate new credential for next operative</li>
              </ol>
              <p className="mt-3 text-gray-600">
                💡 <strong>OPSEC:</strong> One credential per operative. This maintains network integrity 
                and prevents unauthorized distribution beyond your control.
              </p>
            </div>
          </div>
        )}

        {/* Info section */}
        <div className="mt-6 card bg-clandestine-medium border-gray-700">
          <h3 className="text-gray-300 font-semibold mb-3 font-mono text-sm">ADMIN CONTROL SYSTEM</h3>
          <ul className="text-gray-400 text-xs space-y-2 font-mono">
            <li>🔑 <strong className="text-gray-300">EXCLUSIVE ADMIN ACCESS</strong> — Only you can generate credentials</li>
            <li>🎟️ <strong className="text-gray-300">SINGLE-USE TOKENS</strong> — Each QR expires after one authentication</li>
            <li>🔒 <strong className="text-gray-300">ZERO-TRACE PROTOCOL</strong> — No email/phone verification required</li>
            <li>📊 <strong className="text-gray-300">FULL AUTHORIZATION</strong> — You control all network access</li>
            <li>♻️ <strong className="text-gray-300">UNLIMITED GENERATION</strong> — Create credentials as needed</li>
          </ul>
          <div className="mt-4 pt-4 border-t border-gray-700">
            <p className="text-gray-500 text-xs font-mono">
              CLASSIFIED: Keep master token (<code className="bg-clandestine-dark px-2 py-1 rounded">MASTER_INVITE_TOKEN</code>) 
              secure. Token holder has full credential generation authority.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Admin;
