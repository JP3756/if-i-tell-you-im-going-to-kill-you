// Manifesto Page - Privacy creed shown on first login
// Sets the tone for the app's privacy-first philosophy

import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

function Manifesto({ user }) {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Fade in effect
    setTimeout(() => setShow(true), 100);
  }, []);

  const handleContinue = () => {
    navigate('/feed');
  };

  return (
    <div className="min-h-screen bg-clandestine-darkest flex items-center justify-center p-4">
      <div className={`max-w-2xl w-full transition-opacity duration-1000 ${show ? 'opacity-100' : 'opacity-0'}`}>
        {/* Header */}
        <div className="text-center mb-12">
          <div className="text-xs text-gray-600 mb-3 tracking-widest font-mono">CLASSIFIED BRIEFING</div>
          <h1 className="text-3xl font-bold text-gray-100 mb-2 font-mono">IF I TELL YOU</h1>
          <h2 className="text-3xl font-bold mb-4 font-mono">
            <span className="text-red-500">I'M GOING TO KILL YOU</span>
          </h2>
          <p className="text-gray-500 text-xs tracking-wider font-mono">OPERATIONAL SECURITY PROTOCOL</p>
        </div>

        {/* Manifesto content */}
        <div className="card mb-8">
          <div className="space-y-6 text-gray-300">
            <div className="text-center mb-8">
              <h2 className="text-xl font-bold text-gray-100 mb-4 font-mono tracking-wide">
                OPERATIVE: {user?.username}
              </h2>
              <div className="text-6xl mb-4">⚠️</div>
              <div className="text-xs text-red-400 font-mono tracking-widest">CLEARANCE GRANTED</div>
            </div>

            <div className="border-l-4 border-red-500 pl-6 space-y-4">
              <p className="text-xl font-bold text-gray-100 mb-4 font-mono">
                IF I TELL YOU, <span className="text-red-500">I'M GOING TO KILL YOU.</span>
              </p>
              
              <p className="text-gray-400 text-sm">
                You are now operating on a <span className="text-red-400 font-semibold">zero-trace communications network</span>. 
                All transmissions auto-destruct in 24 hours. Your operational callsign is your only identifier. 
                <span className="text-red-400 font-semibold"> Nothing persists beyond mission parameters.</span>
              </p>

              <p className="text-gray-400 text-sm">
                <span className="text-red-400 font-semibold font-mono">PROTOCOL:</span> Information shared within this network 
                is mission-critical and time-sensitive. Once transmitted, data is eliminated from all systems within 24 hours. 
                <span className="text-white font-semibold"> No traces. No records. No compromise.</span>
              </p>

              <p className="text-gray-400 text-sm font-mono">
                <span className="text-red-400 font-semibold">SURVEILLANCE COUNTERMEASURES:</span>
              </p>
              
              <ul className="space-y-2 text-gray-400 text-xs">
                <li><span className="text-red-500 font-mono">✗</span> Email addresses</li>
                <li><span className="text-red-500 font-mono">✗</span> Phone numbers</li>
                <li><span className="text-red-500 font-mono">✗</span> Personal identifiers</li>
                <li><span className="text-red-500 font-mono">✗</span> IP address logging</li>
                <li><span className="text-red-500 font-mono">✗</span> Geolocation tracking</li>
                <li><span className="text-red-500 font-mono">✗</span> Browser fingerprinting</li>
                <li><span className="text-red-500 font-mono">✗</span> Third-party analytics</li>
              </ul>

              <p className="text-gray-400 text-sm font-mono mt-4">
                <span className="text-green-400 font-semibold">DATA RETENTION POLICY:</span>
              </p>
              
              <ul className="space-y-2 text-gray-400 text-xs">
                <li><span className="text-green-500 font-mono">✓</span> Operational callsign (operator-selected)</li>
                <li><span className="text-green-500 font-mono">✓</span> Communications (24hr auto-destruct)</li>
                <li><span className="text-red-500 font-mono">✗</span> Everything else is purged</li>
              </ul>
            </div>

            <div className="pt-6 border-t border-gray-800">
              <p className="text-gray-400 text-sm leading-relaxed font-mono">
                <span className="text-red-400 font-semibold tracking-wide">"IF I TELL YOU, I'M GOING TO KILL YOU."</span>
                <br /><br />
                This is operational doctrine. All communications transmitted through this network are subject to 
                mandatory elimination protocols. Data retention: 24 hours maximum. After expiration, 
                all traces are systematically destroyed. <span className="text-white font-semibold">Zero recovery. Zero footprint.</span>
              </p>
            </div>

            <div className="bg-red-900/10 border border-red-800/30 rounded p-4">
              <h3 className="text-red-400 font-semibold mb-2 font-mono text-sm">⏱️ T-MINUS 24 HOURS · AUTO-DESTRUCT ENGAGED</h3>
              <p className="text-gray-400 text-xs">
                All transmissions are encrypted and scheduled for automatic deletion at T+24:00:00. 
                Data persistence beyond this window is <span className="text-red-400 font-semibold">IMPOSSIBLE</span>. 
                Archives do not exist. Screenshots are meaningless without context—context that 
                <span className="text-white font-semibold"> self-destructs</span>. Communicate without consequence.
              </p>
            </div>
          </div>
        </div>

        {/* Continue button */}
        <div className="text-center">
          <button
            onClick={handleContinue}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-12 rounded transition-colors duration-200 text-sm font-mono tracking-wide"
          >
            ACKNOWLEDGE & PROCEED TO NETWORK
          </button>
          <p className="text-gray-600 text-xs mt-4 font-mono">
            <span className="text-red-400 tracking-wide">IF I TELL YOU, I'M GOING TO KILL YOU.</span>
            <br />
            PROTOCOL ACCEPTED · ZERO-PERSISTENCE ACKNOWLEDGED
          </p>
        </div>
      </div>
    </div>
  );
}

export default Manifesto;
