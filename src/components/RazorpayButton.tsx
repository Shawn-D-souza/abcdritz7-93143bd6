import { useEffect, useRef } from 'react';

interface RazorpayButtonProps {
  buttonId: string;
  theme?: string;
}

const RazorpayButton = ({ buttonId, theme = 'brand-color' }: RazorpayButtonProps) => {
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    // Check if the script is already added to avoid duplicates in React strict mode
    if (formRef.current && formRef.current.children.length === 0) {
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
