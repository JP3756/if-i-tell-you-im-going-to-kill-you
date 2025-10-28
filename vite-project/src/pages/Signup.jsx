// Signup Page - Username creation (NO email, NO phone)
// The invitation IS the verification

import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { authAPI } from '../api';

function Signup({ onLogin }) {
  const { token } = useParams();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validate username format
    if (!username.trim()) {
      setError('Username is required');
      return;
    }

    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
    if (!usernameRegex.test(username)) {
      setError('Username must be 3-20 characters (letters, numbers, underscore only)');
      return;
    }

    setLoading(true);

    try {
      const response = await authAPI.signup(username, token);
      
      // Login successful
      onLogin(response.sessionToken, response.user);
      
      // Redirect to manifesto page
      navigate('/manifesto');
    } catch (err) {
      setError(err.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-clandestine-darkest flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-xs text-gray-600 mb-2 tracking-widest font-mono">IDENTITY SETUP</div>
          <h1 className="text-2xl font-bold text-gray-100 mb-1 font-mono">IF I TELL YOU</h1>
          <h2 className="text-2xl font-bold mb-3 font-mono">
            <span className="text-red-500">I'M GOING TO KILL YOU</span>
          </h2>
          <p className="text-gray-500 text-xs tracking-wider">ESTABLISH CALLSIGN</p>
        </div>

        {/* Signup form */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-200 mb-4 font-mono">
            CALLSIGN REGISTRATION
          </h2>
          
          <p className="text-gray-400 text-sm mb-6">
            Choose your operational identifier. This is your only identity in the network.
          </p>

          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label htmlFor="username" className="block text-gray-400 text-xs mb-2 font-mono tracking-wider">
                CALLSIGN
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="input-field w-full font-mono"
                placeholder="OPERATIVE_NAME"
                maxLength={20}
                autoFocus
                disabled={loading}
              />
              <p className="text-gray-600 text-xs mt-2 font-mono">
                FORMAT: 3-20 CHARS · ALPHANUMERIC + UNDERSCORE
              </p>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-900/20 border border-red-800 rounded text-red-400 text-xs font-mono">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded transition-colors duration-200 w-full font-mono text-sm"
              disabled={loading}
            >
              {loading ? 'ESTABLISHING CONNECTION...' : 'CONFIRM & ENTER NETWORK'}
            </button>
          </form>

          {/* Privacy reminder */}
          <div className="mt-6 pt-6 border-t border-gray-800">
            <div className="text-center text-gray-600 text-xs space-y-1 font-mono">
              <p>✓ NO EMAIL VERIFICATION</p>
              <p>✓ NO PHONE TRACE</p>
              <p>✓ NO PERSONAL DATA STORED</p>
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="mt-6 text-center text-gray-600 text-xs font-mono">
          <p>CREDENTIAL AUTHENTICATED · CLEARANCE LEVEL: OPERATOR</p>
        </div>
      </div>
    </div>
  );
}

export default Signup;
