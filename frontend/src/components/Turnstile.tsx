import React, { useEffect } from 'react';
import { Turnstile as TurnstileWidget } from '@marsidev/react-turnstile';

interface TurnstileProps {
  onVerify: (token: string) => void;
  onError?: () => void;
}

const Turnstile = ({ onVerify, onError }: TurnstileProps) => {
  const [hasVerified, setHasVerified] = React.useState(false);
  const siteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY;
  const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

  // Timeout fallback: if Turnstile doesn't load in 10 seconds, allow submission
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!hasVerified) {
        console.warn('⚠️ Turnstile timeout - allowing form submission');
        setHasVerified(true);
        onVerify('timeout-fallback-token');
      }
    }, 10000);

    return () => clearTimeout(timeout);
  }, [onVerify, hasVerified]);

  // In development/localhost, auto-verify to bypass Cloudflare port restriction
  if (isLocalhost && import.meta.env.DEV) {
    console.log('🔓 Development mode: Turnstile bypassed for localhost');
    // Call onVerify immediately to enable form submission
    useEffect(() => {
      onVerify('dev-bypass-token');
    }, [onVerify]);

    return (
      <div className="flex justify-center my-4 p-4 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-800">
        ⚠️ Development Mode: Bot protection bypassed for localhost
      </div>
    );
  }

  if (!siteKey) {
    console.warn('⚠️ VITE_TURNSTILE_SITE_KEY not configured - Turnstile disabled');
    return null;
  }

  const handleSuccess = (token: string) => {
    setHasVerified(true);
    onVerify(token);
  };

  return (
    <div className="flex justify-center my-4">
      <TurnstileWidget
        siteKey={siteKey}
        onSuccess={handleSuccess}
        onError={(err) => {
          console.error('Turnstile error:', err);
          onError?.();
        }}
        onExpire={() => {
          console.warn('⚠️ Turnstile token expired');
          onError?.();
        }}
        options={{
          theme: 'light',
          size: 'normal',
        }}
      />
    </div>
  );
};

export default Turnstile;
