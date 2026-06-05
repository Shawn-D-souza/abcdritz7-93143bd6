import { useEffect, useRef } from 'react';

interface RazorpayButtonProps {
  buttonId: string;
  theme?: string;
}

const RazorpayButton = ({ buttonId, theme = 'brand-color' }: RazorpayButtonProps) => {
  const formRef = useRef<HTMLFormElement>(null);

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

      formRef.current.appendChild(script);
    }
  }, [buttonId, theme]);

  return (
    <div className="flex justify-center my-6">
      <form ref={formRef} />
    </div>
  );
};

export default RazorpayButton;
