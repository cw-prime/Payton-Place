import { useEffect } from 'react';
import { Turnstile as TurnstileWidget } from '@marsidev/react-turnstile';

interface TurnstileProps {
  onVerify: (token: string) => void;
  onError?: () => void;
}

const Turnstile = ({ onVerify, onError }: TurnstileProps) => {
  const siteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY;
  const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

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

  return (
    <div className="flex justify-center my-4">
      <TurnstileWidget
        siteKey={siteKey}
        onSuccess={onVerify}
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
