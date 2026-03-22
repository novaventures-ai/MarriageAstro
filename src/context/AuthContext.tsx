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

interface AuthContextType {
    user: User | null;
    session: Session | null;
    isLoading: boolean;
    signInWithGoogle: () => Promise<void>;
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

                // If user just signed in or session was restored, handle data sync
                if (newSession?.user && (event === 'SIGNED_IN' || event === 'INITIAL_SESSION')) {
                    const userProfileState = useUserProfileStore.getState();

                    // Load premium plan tier (admin check happens inside)
                    userProfileState.loadPlanFromCloud(
                        newSession.user.id,
                        newSession.user.email || ''
                    );

                    // If user has local self data, they likely just created it as guest.
                    // Save it to cloud to prevent wiping it. Otherwise, load cloud data.
                    if (userProfileState.selfBirthData) {
                        userProfileState.saveToCloud();
                    } else {
                        userProfileState.loadFromCloud();
                    }

                    // If user has a local Match Report, save it to cloud
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

    const signOut = async () => {
        // Clear local store first
        useUserProfileStore.getState().reset();

        const { error } = await supabase.auth.signOut();
        if (error) {
            console.error('Error signing out:', error.message);
            throw error;
        }
    };

    return (
        <AuthContext.Provider value={{ user, session, isLoading, signInWithGoogle, signOut }}>
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
