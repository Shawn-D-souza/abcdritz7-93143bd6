import { useEffect, useRef, useState } from 'react';
import { Loader2 } from 'lucide-react';

interface RazorpayButtonProps {
  buttonId: string;
  theme?: string;
}

const RazorpayButton = ({ buttonId, theme = 'brand-color' }: RazorpayButtonProps) => {
  const formRef = useRef<HTMLFormElement>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Skip injecting the script during react-snap pre-rendering
    if (typeof window !== 'undefined' && window.navigator.userAgent === 'ReactSnap') {
      return;
    }

    if (formRef.current) {
      // Clear any pre-rendered HTML to ensure a fresh client-side initialization
      formRef.current.innerHTML = '';

      const script = document.createElement('script');
      script.src = 'https://cdn.razorpay.com/static/widget/subscription-button.js';
      script.setAttribute('data-subscription_button_id', buttonId);
      script.setAttribute('data-button_theme', theme);
      script.async = true;

      script.onload = () => {
        // Razorpay widget might take a moment to render the iframe after the script loads
        setTimeout(() => setLoading(false), 800);
      };

      formRef.current.appendChild(script);

      // Fallback in case onload isn't triggered
      const fallbackTimer = setTimeout(() => setLoading(false), 3000);
      return () => clearTimeout(fallbackTimer);
    }
  }, [buttonId, theme]);

  return (
    <div className="flex flex-col items-center justify-center my-6 min-h-[50px] relative w-full overflow-visible">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}
      <form ref={formRef} className={`transition-opacity duration-500 w-full flex justify-center overflow-visible ${loading ? 'opacity-0' : 'opacity-100'}`} />
    </div>
  );
};

export default RazorpayButton;
