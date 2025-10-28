// Landing Page - Entry point for Clandestine
// Shows app intro or redirects to feed if authenticated

import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

function Landing({ isAuthenticated }) {
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/feed');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen bg-clandestine-darkest flex items-center justify-center p-4">
      <div className="max-w-2xl text-center">
        {/* Logo / Title */}
        <div className="mb-8">
          <div className="text-xs text-gray-600 mb-2 tracking-widest">CLASSIFIED ACCESS</div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-100 mb-3 tracking-tight font-mono">
            IF I TELL YOU
          </h1>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight font-mono">
            <span className="text-red-500">I'M GOING TO KILL YOU</span>
          </h2>
          <div className="text-sm text-gray-500 tracking-wider">
            DBTC SECURE NETWORK · CLEARANCE REQUIRED
          </div>
        </div>

        {/* Subtitle */}
        <div className="mb-12">
          <p className="text-gray-300 text-lg mb-3 font-semibold">
            INVITATION-ONLY ACCESS
          </p>
          <p className="text-gray-500 text-sm max-w-md mx-auto">
            Secure communications channel. Zero-trace architecture. All transmissions auto-destruct.
          </p>
        </div>

        {/* Privacy badges */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          <span className="px-4 py-2 bg-clandestine-dark border border-gray-800 rounded text-gray-400 text-xs font-mono">
            � QR AUTHENTICATION
          </span>
          <span className="px-4 py-2 bg-clandestine-dark border border-gray-800 rounded text-gray-400 text-xs font-mono">
            �️ ZERO-TRACE
          </span>
          <span className="px-4 py-2 bg-clandestine-dark border border-gray-800 rounded text-gray-400 text-xs font-mono">
            ⏱️ AUTO-DESTRUCT
          </span>
        </div>

        {/* Call to action */}
        <div className="card max-w-md mx-auto">
          <h2 className="text-xl font-semibold text-gray-200 mb-3 font-mono">
            ACCESS PROTOCOL
          </h2>
          <ol className="text-left text-gray-400 space-y-3 mb-6 text-sm">
            <li className="flex items-start">
              <span className="text-red-500 font-bold mr-3 font-mono">01.</span>
              <span>Receive encrypted QR credential from network admin</span>
            </li>
            <li className="flex items-start">
              <span className="text-red-500 font-bold mr-3 font-mono">02.</span>
              <span>Scan credential to authenticate identity token</span>
            </li>
            <li className="flex items-start">
              <span className="text-red-500 font-bold mr-3 font-mono">03.</span>
              <span>Establish callsign and gain immediate clearance</span>
            </li>
          </ol>
          <div className="bg-clandestine-medium border border-gray-800 rounded p-3 text-xs">
            <p className="text-gray-500">
              <span className="text-red-400 font-semibold">OPSEC PROTOCOL:</span> No email verification. 
              No phone trace. Credential-based authentication only.
            </p>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-800">
            <p className="text-gray-600 text-xs font-mono">
              SINGLE-USE TOKENS · ADMIN-CONTROLLED ACCESS
            </p>
          </div>
        </div>

        {/* Admin link */}
        <div className="mt-8">
          <button
            onClick={() => navigate('/admin')}
            className="text-gray-600 hover:text-gray-400 text-sm transition-colors"
          >
            Admin Access
          </button>
        </div>

        {/* Footer */}
        <div className="mt-16 text-gray-600 text-xs font-mono">
          <p className="text-gray-500">
            <span className="text-red-500">IF I TELL YOU, I'M GOING TO KILL YOU.</span>
          </p>
          <p className="mt-2 tracking-wider">MISSION-CRITICAL COMMUNICATIONS · ZERO FOOTPRINT</p>
        </div>
      </div>
    </div>
  );
}

export default Landing;
