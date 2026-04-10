import React, { useEffect } from 'react';
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';

/**
 * QueryParamHandler
 * Listens for ?share=, ?invite=, and ?ref= params to enable viral + affiliate features.
 * ?ref= stores the affiliate code in localStorage so it persists through signup/payment.
 */
export const QueryParamHandler: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { setChartA, generateReport, isLoading } = useAppStore();

  useEffect(() => {
    const shareData = searchParams.get('share');
    const inviteData = searchParams.get('invite');
    const refCode = searchParams.get('ref');

    // Capture affiliate ref code — store for up to 30 days + track the click
    if (refCode) {
      localStorage.setItem('aff_ref', refCode);
      localStorage.setItem('aff_ref_ts', String(Date.now()));

      // Track this link click server-side (once per session — debounced via sessionStorage)
      const clickKey = `aff_click_${refCode}`;
      if (!sessionStorage.getItem(clickKey)) {
        sessionStorage.setItem(clickKey, '1');
        fetch('/api/affiliate-track', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'click', code: refCode }),
        }).catch(() => { /* non-critical */ });
      }
    }

    if (shareData) {
      handleShare(shareData);
    } else if (inviteData) {
      handleInvite(inviteData);
    }
  }, [searchParams]);

  const handleShare = async (base64: string) => {
    try {
      // Decode base64url safety
      const normalized = base64.replace(/-/g, '+').replace(/_/g, '/');
      const json = atob(normalized);
      const data = JSON.parse(json);

      if (data.a && data.b) {
        // Reconstruct birth data inputs
        const birthA = {
          name: data.a.n,
          gender: data.a.g,
          dateOfBirth: data.a.d,
          timeOfBirth: data.a.t,
          location: data.a.l,
          latitude: data.a.lat,
          longitude: data.a.lng,
          timezone: data.a.tz
        };
        const birthB = {
          name: data.b.n,
          gender: data.b.g,
          dateOfBirth: data.b.d,
          timeOfBirth: data.b.t,
          location: data.b.l,
          latitude: data.b.lat,
          longitude: data.b.lng,
          timezone: data.b.tz
        };

        // Trigger report generation
        // Note: generateReport in useAppStore handles navigation typically or we manage it here
        await generateReport(birthA, birthB);
        navigate('/report', { replace: true });
      }
    } catch (err) {
      console.error('Failed to parse share data', err);
    }
  };

  const handleInvite = (base64: string) => {
    try {
      const normalized = base64.replace(/-/g, '+').replace(/_/g, '/');
      const json = atob(normalized);
      const data = JSON.parse(json);

      if (data.n) {
        // Pre-set Chart A as the inviter
        const inviterChart = {
          id: 'inviter',
          name: data.n,
          gender: data.g,
          dateOfBirth: new Date(data.d),
          timeOfBirth: data.t,
          location: data.l,
          latitude: data.lat,
          longitude: data.lng,
          timezone: data.tz,
          type: 'natal' as const
        };
        
        setChartA(inviterChart as any);
        
        // If we aren't on add-partner, go there
        if (location.pathname !== '/add-partner') {
          navigate(`/add-partner?invitedBy=${encodeURIComponent(data.n)}`, { replace: true });
        }
      }
    } catch (err) {
      console.error('Failed to parse invite data', err);
    }
  };

  return null; // Side-effect only component
};
