// Invite Page - Validates invitation token from QR code
// First step after scanning QR

import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { inviteAPI } from '../api';

function Invite() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('validating'); // validating, valid, invalid
  const [error, setError] = useState('');

  useEffect(() => {
    const validateInvite = async () => {
      try {
        const response = await inviteAPI.validate(token);
        
        if (response.valid) {
          setStatus('valid');
          // Auto-redirect to signup after brief display
          setTimeout(() => {
            navigate(`/signup/${token}`);
          }, 1500);
        } else {
          setStatus('invalid');
          setError('This invitation is invalid or has already been used.');
        }
      } catch (err) {
        setStatus('invalid');
        setError(err.message || 'Failed to validate invitation.');
      }
    };

    validateInvite();
  }, [token, navigate]);

  return (
    <div className="min-h-screen bg-clandestine-darkest flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-100 mb-1">IF I TELL YOU</h1>
          <h2 className="text-2xl font-bold mb-2">
            <span className="text-red-500">I'M GOING TO KILL YOU</span>
          </h2>
          <p className="text-gray-500 text-sm">Invitation Verification</p>
        </div>

        {/* Status display */}
        <div className="card text-center">
          {status === 'validating' && (
            <>
              <div className="mb-4">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
              </div>
              <p className="text-gray-400 font-mono text-sm">VERIFYING CREDENTIAL...</p>
            </>
          )}

          {status === 'valid' && (
            <>
              <div className="mb-4 text-5xl">✓</div>
              <h2 className="text-xl font-semibold text-green-400 mb-2 font-mono">
                CREDENTIAL VERIFIED
              </h2>
              <p className="text-gray-400 mb-4 text-sm">
                Authentication successful. Establishing secure channel...
              </p>
              <div className="text-xs text-gray-600 font-mono">
                CLEARANCE GRANTED · PROCEEDING TO CALLSIGN SETUP
              </div>
            </>
          )}

          {status === 'invalid' && (
            <>
              <div className="mb-4 text-5xl">✗</div>
              <h2 className="text-xl font-semibold text-red-400 mb-2 font-mono">
                ACCESS DENIED
              </h2>
              <p className="text-gray-400 mb-6 text-sm">{error}</p>
              <button
                onClick={() => navigate('/')}
                className="btn-secondary text-sm"
              >
                RETURN TO BASE
              </button>
            </>
          )}
        </div>

        {/* Info */}
        <div className="mt-6 text-center text-gray-600 text-sm">
          <p>Invitation-only access ensures privacy and exclusivity.</p>
        </div>
      </div>
    </div>
  );
}

export default Invite;
