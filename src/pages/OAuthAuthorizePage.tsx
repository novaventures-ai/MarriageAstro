import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { SEOHead } from '../components/SEOHead';
import { Logo } from '../components/ui/Logo';
import { Shield, Sparkles, User, Info, ArrowLeftRight, LogOut, CheckCircle, AlertTriangle } from 'lucide-react';

export const OAuthAuthorizePage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, session, isLoading: authLoading, signOut } = useAuth();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Extract query parameters
  const searchParams = new URLSearchParams(location.search);
  const clientId = searchParams.get('client_id') || 'claude-connector';
  const redirectUri = searchParams.get('redirect_uri');
  const state = searchParams.get('state') || '';
  const scope = searchParams.get('scope') || '';
  const codeChallenge = searchParams.get('code_challenge') || '';
  const codeChallengeMethod = searchParams.get('code_challenge_method') || 'S256';

  // Redirect to login if user is not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login', { state: { from: location } });
    }
  }, [user, authLoading, navigate, location]);

  const handleAuthorize = async () => {
    if (!redirectUri) {
      setError('Missing redirect_uri parameter');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/oauth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`
        },
        body: JSON.stringify({
          action: 'authorize',
          clientId,
          redirectUri,
          ...(codeChallenge ? { codeChallenge, codeChallengeMethod } : {}),
        })
      });

      const data = await response.json();

      if (!response.ok || !data.code) {
        throw new Error(data.error_description || data.error || 'Failed to generate authorization code');
      }

      // Build target redirect URL with code and original state
      const targetUrl = new URL(redirectUri);
      targetUrl.searchParams.set('code', data.code);
      if (state) {
        targetUrl.searchParams.set('state', state);
      }

      // Redirect user browser back to Claude.ai Callback URI
      window.location.href = targetUrl.toString();
    } catch (err: any) {
      setError(err.message || 'Authorization failed. Please try again.');
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (redirectUri) {
      const targetUrl = new URL(redirectUri);
      targetUrl.searchParams.set('error', 'access_denied');
      if (state) {
        targetUrl.searchParams.set('state', state);
      }
      window.location.href = targetUrl.toString();
    } else {
      navigate('/dashboard');
    }
  };

  const handleSwitchAccount = async () => {
    try {
      await signOut();
      navigate('/login', { state: { from: location } });
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-950">
        <div className="animate-pulse text-indigo-600 dark:text-indigo-400 text-lg font-medium">
          Securing session...
        </div>
      </div>
    );
  }

  if (!redirectUri) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-950 flex flex-col items-center justify-center p-4 sm:p-6 transition-colors duration-500">
        <div className="w-full max-w-md bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-6 sm:p-8 border border-red-200 dark:border-red-900/50">
          <div className="flex flex-col items-center text-center">
            <AlertTriangle className="w-12 h-12 text-red-500 mb-4" />
            <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100">Invalid OAuth Request</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              The authorization request is missing the required <code>redirect_uri</code> parameter. We cannot redirect back safely.
            </p>
            <button
              onClick={() => navigate('/dashboard')}
              className="mt-6 px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold transition"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-950 flex flex-col items-center justify-center p-4 sm:p-6 transition-colors duration-500">
      <SEOHead title="Authorize Application | MarriageAstro" description="Grant applications secure access to MarriageAstro features." path="/oauth/authorize" />

      <div className="w-full max-w-lg">
        {/* Logo Section */}
        <div className="flex justify-center mb-6">
          <Logo size="lg" />
        </div>

        {/* Core Consent Glassmorphic Card */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md shadow-2xl rounded-3xl p-6 sm:p-8 border border-white/20 dark:border-gray-700/50 transition-colors">
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100/50 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 text-xs font-semibold mb-3">
              <Shield className="w-3.5 h-3.5" />
              Secure Connection Request
            </div>
            <h1 className="text-2xl font-extrabold text-gray-800 dark:text-gray-100 leading-tight">
              Authorize Claude.ai
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              wants to connect to your MarriageAstro cosmic profile.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 rounded-xl flex items-start gap-3 text-red-700 dark:text-red-400 text-sm">
              <AlertTriangle className="w-5 h-5 flex-shrink-0" />
              <p className="font-medium">{error}</p>
            </div>
          )}

          {/* Connected App Visual Representation */}
          <div className="flex items-center justify-between bg-indigo-50/50 dark:bg-gray-900/50 rounded-2xl p-4 mb-6 border border-indigo-100/30 dark:border-gray-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-600 flex items-center justify-center text-white font-bold shadow-md shadow-purple-600/20">
                AI
              </div>
              <div className="text-left">
                <span className="block font-bold text-gray-800 dark:text-gray-200 text-sm sm:text-base">Claude.ai</span>
                <span className="block text-xs text-gray-400">Anthropic Custom Integration</span>
              </div>
            </div>
            <ArrowLeftRight className="w-5 h-5 text-gray-400" />
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold shadow-md shadow-indigo-600/20">
                MA
              </div>
              <div className="text-left">
                <span className="block font-bold text-gray-800 dark:text-gray-200 text-sm sm:text-base">MarriageAstro</span>
                <span className="block text-xs text-gray-400">Cosmic Platform</span>
              </div>
            </div>
          </div>

          {/* Requested Scopes/Permissions */}
          <div className="space-y-4 mb-6">
            <span className="block text-xs font-bold uppercase tracking-wider text-gray-400 text-left">
              This application will be able to:
            </span>
            <div className="space-y-2.5">
              <div className="flex items-start gap-3 bg-gray-50/50 dark:bg-gray-900/20 p-3 rounded-xl border border-gray-100 dark:border-gray-800/50">
                <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                <div className="text-left">
                  <span className="block font-semibold text-gray-800 dark:text-gray-200 text-sm">Vedic Calculations</span>
                  <span className="block text-xs text-gray-400">Execute Ashtakoot Milan, KP system, and Navamsa chart matches.</span>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-gray-50/50 dark:bg-gray-900/20 p-3 rounded-xl border border-gray-100 dark:border-gray-800/50">
                <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                <div className="text-left">
                  <span className="block font-semibold text-gray-800 dark:text-gray-200 text-sm">Advanced Predictions</span>
                  <span className="block text-xs text-gray-400">Check marriage timing, divorce risks, mental health flags, and remedies.</span>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-gray-50/50 dark:bg-gray-900/20 p-3 rounded-xl border border-gray-100 dark:border-gray-800/50">
                <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                <div className="text-left">
                  <span className="block font-semibold text-gray-800 dark:text-gray-200 text-sm">Synastry & Patterns</span>
                  <span className="block text-xs text-gray-400">Analyze planetary aspect alignments and mutual relationship stress zones.</span>
                </div>
              </div>
            </div>
          </div>

          {/* Active Identity Block */}
          <div className="border-t border-gray-200/50 dark:border-gray-700/50 pt-5 mb-6 text-left flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300">
                <User className="w-4 h-4" />
              </div>
              <div>
                <span className="block text-xs text-gray-400 font-medium">Authorizing as:</span>
                <span className="block text-sm font-bold text-gray-700 dark:text-gray-200 truncate max-w-[200px]">{user?.email}</span>
              </div>
            </div>
            <button
              onClick={handleSwitchAccount}
              className="inline-flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 font-semibold self-start sm:self-center transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              Switch Account
            </button>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={handleCancel}
              disabled={isLoading}
              className="w-full py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-bold rounded-xl active:scale-[0.98] transition-all disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleAuthorize}
              disabled={isLoading}
              className="w-full inline-flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl hover:from-indigo-700 hover:to-purple-700 shadow-md shadow-indigo-500/20 active:scale-[0.98] transition-all disabled:opacity-50"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4" />
              )}
              Authorize
            </button>
          </div>
        </div>

        {/* Footer Security Notice */}
        <p className="text-center mt-6 text-xs text-gray-400/80 px-4">
          By granting authorization, you permit this integration to make API requests on your behalf using a secure bearer token. You can revoke access at any time.
        </p>
      </div>
    </div>
  );
};
