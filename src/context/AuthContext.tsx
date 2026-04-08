/**
 * Authentication Context
 * Provides auth state (user, session) and actions (signIn, signOut) to the entire app.
 * Uses Supabase Auth with onAuthStateChange for session persistence.
 */

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { useUserProfileStore } from '../store/useUserProfileStore';
import { useAppStore } from '../store/useAppStore';
import { setSentryUser, clearSentryUser } from '../lib/errorMonitoring';
import { identifyUser, resetUser as resetAnalyticsUser, trackEvent } from '../lib/analytics';

interface AuthContextType {
    user: User | null;
    session: Session | null;
    isLoading: boolean;
    signInWithGoogle: () => Promise<void>;
    signInWithEmail: (email: string, password: string) => Promise<void>;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // 1. Get the initial session on mount
        const getInitialSession = async () => {
            try {
                const { data: { session: currentSession } } = await supabase.auth.getSession();
                setSession(currentSession);
                setUser(currentSession?.user ?? null);
            } catch (error) {
                console.error('Error getting initial session:', error instanceof Error ? error.message : 'Unknown error');
            } finally {
                setIsLoading(false);
            }
        };

        getInitialSession();

        // 2. Listen for auth state changes (login, logout, token refresh)
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (event, newSession) => {
                setSession(newSession);
                setUser(newSession?.user ?? null);
                setIsLoading(false);

                // Identify user in Sentry + PostHog
                if (newSession?.user) {
                    setSentryUser(newSession.user.id, newSession.user.email);
                    identifyUser(newSession.user.id, { email: newSession.user.email });
                    if (event === 'SIGNED_IN') trackEvent('user_signed_in');
                } else if (event === 'SIGNED_OUT') {
                    clearSentryUser();
                    resetAnalyticsUser();
                }

                // If user just signed in or session was restored, handle data sync
                if (newSession?.user && (event === 'SIGNED_IN' || event === 'INITIAL_SESSION')) {
                    const userProfileState = useUserProfileStore.getState();

                    // 1. Handle Demo mode transition
                    if (userProfileState.isDemoMode) {
                        // Clear demo data and reset all flags first
                        userProfileState.reset();
                    }

                    // 2. Load permissions (plan tier and admin status)
                    // This is critical to call AFTER reset if we were in demo mode
                    userProfileState.loadPlanFromCloud(
                        newSession.user.id,
                        newSession.user.email || ''
                    );

                    // 3. Load or sync core profile data
                    if (userProfileState.isDemoMode) {
                        // If we just reset demo, definitely load from cloud
                        userProfileState.loadFromCloud();
                    } else if (userProfileState.selfBirthData?.name) {
                        // User has local guest data, sync it up
                        userProfileState.saveToCloud();
                    } else {
                        // Fresh start or return, load from cloud
                        userProfileState.loadFromCloud();
                    }

                    // 4. Handle compatibility report sync
                    const appState = useAppStore.getState();
                    if (appState.currentReport) {
                        appState.syncToCloud();
                    }
                }
            }
        );

        // Cleanup subscription on unmount
        return () => {
            subscription.unsubscribe();
        };
    }, []);

    const signInWithGoogle = async () => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/auth/callback`,
            },
        });

        if (error) {
            console.error('Error signing in with Google:', error.message);
            throw error;
        }
    };

    const signInWithEmail = async (email: string, password: string) => {
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            console.error('Error signing in with Email:', error.message);
            throw error;
        }
    };

    const signOut = async () => {
        trackEvent('user_signed_out');
        // Clear local store first
        useUserProfileStore.getState().reset();

        const { error } = await supabase.auth.signOut();
        if (error) {
            console.error('Error signing out:', error.message);
            throw error;
        }
    };

    return (
        <AuthContext.Provider value={{ user, session, isLoading, signInWithGoogle, signInWithEmail, signOut }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
