/**
 * Auth Callback Page
 * Handles the OAuth redirect from Google sign-in.
 * Supabase client auto-detects the session from the URL hash, 
 * so this just shows a loading state and redirects to home.
 */

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { SEOHead } from '../components/SEOHead';

export const AuthCallbackPage: React.FC = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // Supabase's detectSessionInUrl handles the token extraction.
        // Return to the page the user was on before login (e.g. the OAuth
        // authorize page for the Claude connector), stashed by LoginPage
        // before the full-page Google redirect. Default to home.
        const timer = setTimeout(() => {
            const returnTo = sessionStorage.getItem('auth_return_to') || '/';
            sessionStorage.removeItem('auth_return_to');
            navigate(returnTo, { replace: true });
        }, 1500);

        return () => clearTimeout(timer);
    }, [navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center">
            <SEOHead
                title="Signing In"
                description="Authenticating your account with Astro Marriage."
                path="/auth/callback"
            />
            <div className="text-center">
                <Loader2 className="w-10 h-10 text-indigo-600 dark:text-indigo-400 animate-spin mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400 text-lg">
                    Signing you in...
                </p>
            </div>
        </div>
    );
};

export default AuthCallbackPage;
