import { Turnstile as TurnstileWidget } from '@marsidev/react-turnstile';

interface TurnstileProps {
  onVerify: (token: string) => void;
  onError?: () => void;
}

const Turnstile = ({ onVerify, onError }: TurnstileProps) => {
  const siteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY;

  if (!siteKey) {
    console.warn('⚠️ VITE_TURNSTILE_SITE_KEY not configured - Turnstile disabled');
    // Auto-verify in development if key not set
    if (import.meta.env.DEV) {
      onVerify('dev-bypass-token');
    }
    return null;
  }

  return (
    <div className="flex justify-center my-4">
      <TurnstileWidget
        siteKey={siteKey}
        onSuccess={onVerify}
        onError={onError}
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
