/**
 * Auth Callback Page
 * Handles the OAuth redirect from Google sign-in.
 * Supabase client auto-detects the session from the URL hash, 
 * so this just shows a loading state and redirects to home.
 */

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

export const AuthCallbackPage: React.FC = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // Supabase's detectSessionInUrl handles the token extraction.
        // We just wait briefly and redirect to home.
        const timer = setTimeout(() => {
            navigate('/', { replace: true });
        }, 1500);

        return () => clearTimeout(timer);
    }, [navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center">
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
