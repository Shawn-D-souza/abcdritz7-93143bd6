import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ShieldCheck, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { format } from "date-fns";
import { capture } from "@/lib/analytics";

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    fbq?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}

interface WorkshopPaymentModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  variant?: 'free' | '9' | '99' | '99_lead';
}

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export const WorkshopPaymentModal = ({ isOpen, onOpenChange, variant = '99' }: WorkshopPaymentModalProps) => {
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", whatsapp: "", countryCode: "+91" });
  const [isProcessing, setIsProcessing] = useState(false);
  
  const amountToCharge = variant === '9' ? 9 : variant === 'free' ? 0 : 99;
  const [step, setStep] = useState<1 | 2>(1);
  const [orderData, setOrderData] = useState<any>(null);

  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => setStep(1), 300);
    }
  }, [isOpen]);

  const handleContinue = async (e: React.FormEvent) => {
    e.preventDefault();
    // Frontend Validation
    if (!formData.countryCode.startsWith('+') || formData.countryCode.length < 2) {
      toast.error("Country code must start with '+' and contain numbers (e.g., +91)");
      return;
    }
    if (formData.whatsapp.length < 7 || formData.whatsapp.length > 15) {
      toast.error("Please enter a valid WhatsApp number (between 7 and 15 digits).");
      return;
    }

    setIsProcessing(true);

    try {
      // Pre-load razorpay script concurrently
      const loadScriptPromise = loadRazorpayScript();
      
      // 1. Create order on the server and capture the lead!
      const { data: newOrderData, error: orderError } = await supabase.functions.invoke('create-razorpay-order', {
        body: {
          amount: amountToCharge,
          currency: "INR",
          receipt: `rcpt_${new Date().getTime()}`,
          name: formData.name,
          email: formData.email,
          whatsapp: formData.countryCode + formData.whatsapp,
          workshop_name: "Beginner's guide on n8n"
        }
      });

      if (orderError || !newOrderData?.orderId) {
        throw new Error(orderError?.message || "Failed to create order");
      }

      await loadScriptPromise; // Ensure script is loaded
      
      // Track form submission with variant — queued if PostHog isn't ready yet
      capture('workshop_form_submitted', { variant });
      
      if (typeof window.gtag === 'function') {
        window.gtag('event', 'workshop_form_submitted', { variant });
      }
      if (window.dataLayer) {
        window.dataLayer.push({
          event: 'workshop_form_submitted',
          variant,
          gtag_override: true
        });
      }
      if (typeof window.fbq === 'function') {
        window.fbq('track', 'InitiateCheckout');
      }

      setOrderData(newOrderData);
      setStep(2);
    } catch (err: any) {
      toast.error("Could not secure your spot. Please try again.");
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePaymentSubmit = async () => {
    if (!orderData) return;
    
    setIsProcessing(true);

    // Fire analytics — wrapped in try-catch so a failure here NEVER blocks the payment
    try {
      capture('workshop_pay_button_clicked', { variant, amount: amountToCharge });
      if (typeof window.gtag === 'function') {
        window.gtag('event', 'workshop_pay_button_clicked', { variant, value: amountToCharge });
      }
    } catch (_e) {
      console.warn('Analytics error (non-critical):', _e);
    }

    try {
      if (orderData.amount === 0) {
        const { error: confirmError } = await supabase.functions.invoke('confirm-free-registration', {
          body: {
            order_id: orderData.orderId,
            name: formData.name,
            email: formData.email,
            whatsapp: formData.countryCode + formData.whatsapp,
            workshop_name: "Beginner's guide on n8n"
          }
        });

        if (confirmError) {
          throw new Error(confirmError.message || "Failed to confirm registration");
        }

        setIsProcessing(false);
        setIsSuccessModalOpen(true);
        
        // Fire Analytics Events — also non-blocking
        try {
          capture('workshop_purchase', { variant, value: 0, currency: 'INR' });
          if (typeof window.gtag === 'function') {
            window.gtag('event', 'workshop_purchase', { value: 0, currency: 'INR' });
          }
          if (window.dataLayer) {
            window.dataLayer.push({ event: 'workshop_purchase', value: 0, currency: 'INR', gtag_override: true });
          }
          if (typeof window.fbq === 'function') {
            window.fbq('track', 'Purchase', { value: 0, currency: 'INR' });
          }
        } catch (_e) {
          console.warn('Analytics error (non-critical):', _e);
        }
        return;
      }
      let isPaymentSuccessful = false;
      let lastPaymentError = "";

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY, // Uses the key from .env
        amount: orderData.amount, // from server
        currency: orderData.currency,
        name: "n8n Workshop",
        description: "Beginner Friendly Automation Workshop",
        order_id: orderData.orderId, // Link payment to the server order
        handler: function (response: any) {
          isPaymentSuccessful = true;
          // 1. Immediately show success so the user doesn't wait!
          setIsProcessing(false);
          setIsSuccessModalOpen(true);

          // Fire analytics events — non-blocking, never crashes the handler
          try {
            capture('workshop_purchase', { variant, value: amountToCharge, currency: 'INR' });
            if (typeof window.gtag === 'function') {
              window.gtag('event', 'workshop_purchase', { value: amountToCharge, currency: 'INR' });
            }
            if (window.dataLayer) {
              window.dataLayer.push({ event: 'workshop_purchase', value: amountToCharge, currency: 'INR', gtag_override: true });
            }
            if (typeof window.fbq === 'function') {
              window.fbq('track', 'Purchase', { value: amountToCharge, currency: 'INR' });
            }
          } catch (_e) {
            console.warn('Analytics error (non-critical):', _e);
          }

          // 2. Process the webhook securely in the background (fire-and-forget)
          supabase.functions.invoke('payment-webhook', {
            body: {
              payment_id: response.razorpay_payment_id,
              order_id: response.razorpay_order_id,
              signature: response.razorpay_signature,
              name: formData.name,
              email: formData.email,
              whatsapp: formData.countryCode + formData.whatsapp,
              amount: amountToCharge,
              workshop_name: "Beginner's guide on n8n",
              date: format(new Date(), "dd MMM, yyyy")
            }
          }).catch((error) => {
            console.error("Webhook trigger error in background:", error);
          });
        },
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.countryCode + formData.whatsapp,
        },
        readonly: {
          name: true,
          email: true,
          contact: true,
        },
        theme: {
          color: "#6d28d9", // Purple matching the theme
        },
        modal: {
          ondismiss: function () {
            setIsProcessing(false);
            if (!isPaymentSuccessful && lastPaymentError) {
              toast.error("Payment failed: " + lastPaymentError);
            }
          }
        }
      };

      const paymentObject = new (window as any).Razorpay(options);
      paymentObject.on("payment.failed", function (response: any) {
        lastPaymentError = response.error.description;
        
        // Log failure securely without blocking
        supabase.functions.invoke('payment-failed', {
          body: {
            order_id: response.error.metadata?.order_id || orderData.orderId,
            error_details: response.error
          }
        }).catch(err => console.error("Failed to log payment failure:", err));
      });
      
      // Close the custom Radix UI Dialog so it releases the focus trap and body pointer-events
      onOpenChange(false);
      
      // Slight delay ensures Radix clears its overlay styles before Razorpay injects its iframe
      setTimeout(() => {
        paymentObject.open();
      }, 150);
    } catch (err: any) {
      toast.error("Could not initialize payment. Please try again.");
      console.error(err);
      setIsProcessing(false);
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[425px] bg-card border-border shadow-2xl rounded-2xl w-[95vw] top-[5%] translate-y-[0] sm:top-[50%] sm:translate-y-[-50%] max-h-[85vh] sm:max-h-none overflow-y-auto sm:overflow-visible">
          {step === 1 ? (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold">Secure Your Spot</DialogTitle>
                <DialogDescription className="text-base text-muted-foreground pt-1">
                  Enter your details below to register for the workshop.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleContinue} className="space-y-5 pt-2">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-semibold">Full Name</Label>
                  <Input 
                    id="name" 
                    required 
                    placeholder="John Doe" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="bg-background/50 h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-semibold">Email Address</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    required 
                    placeholder="john@example.com" 
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="bg-background/50 h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="whatsapp" className="text-sm font-semibold">WhatsApp Number</Label>
                  <div className="flex gap-2">
                    <Input 
                      value={formData.countryCode} 
                      onChange={(e) => setFormData({...formData, countryCode: e.target.value.replace(/[^\+0-9]/g, '')})}
                      className="w-[80px] bg-background/50 h-11 shrink-0 font-medium text-center px-1"
                      placeholder="+91"
                      minLength={2}
                      maxLength={5}
                      required
                    />
                    <Input 
                      id="whatsapp" 
                      type="tel" 
                      required 
                      placeholder="9876543210" 
                      value={formData.whatsapp}
                      onChange={(e) => setFormData({...formData, whatsapp: e.target.value.replace(/[^0-9]/g, '')})}
                      className="bg-background/50 h-11 flex-1"
                      minLength={7}
                      maxLength={15}
                    />
                  </div>
                </div>
                <div className="pt-2">
                  <Button 
                    type="submit" 
                    className="w-full h-12 text-lg font-bold shine-effect transition-transform hover:scale-[1.02]" 
                    disabled={isProcessing}
                  >
                    {isProcessing ? "Processing..." : "Continue"}
                  </Button>
                </div>
              </form>
            </>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold">Order Summary</DialogTitle>
                <DialogDescription className="text-base text-muted-foreground pt-1">
                  Please review your details before payment.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-5 pt-4">
                <div className="bg-muted/30 border border-border rounded-xl p-4 space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Workshop:</span>
                    <span className="font-semibold text-foreground text-right">n8n Beginner Workshop</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Billed to:</span>
                    <span className="font-semibold text-foreground text-right">{formData.name}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Email:</span>
                    <span className="font-semibold text-foreground text-right">{formData.email}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">WhatsApp:</span>
                    <span className="font-semibold text-foreground text-right">{formData.countryCode} {formData.whatsapp}</span>
                  </div>
                </div>
                <div className="pt-2 flex gap-3">
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="w-1/3 h-12 font-bold hover:bg-muted" 
                    onClick={() => setStep(1)} 
                    disabled={isProcessing}
                  >
                    Back
                  </Button>
                  <Button 
                    type="button" 
                    onClick={handlePaymentSubmit} 
                    className="flex-1 h-12 text-lg font-bold shine-effect transition-transform hover:scale-[1.02]" 
                    disabled={isProcessing}
                  >
                    {isProcessing ? "Processing..." : amountToCharge === 0 ? "Confirm Registration" : `Pay ₹${amountToCharge} to confirm`}
                  </Button>
                </div>
                {amountToCharge > 0 && (
                  <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground font-medium pt-1">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    100% Secure Checkout by Razorpay
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={isSuccessModalOpen} onOpenChange={setIsSuccessModalOpen}>
        <DialogContent className="sm:max-w-[425px] bg-card border-border shadow-2xl rounded-2xl text-center">
          <DialogHeader className="flex flex-col items-center">
            <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 className="w-8 h-8 text-green-500" />
            </div>
            <DialogTitle className="text-2xl font-bold">
              {variant === 'free' ? 'Registration Successful!' : 'Payment Successful!'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4 text-muted-foreground">
            <p className="text-base">
              Your spot is secured! We will email your confirmation {variant !== 'free' && 'and receipt '}shortly. The actual workshop links and details will be sent to you about a week before the event.
            </p>
            <div className="bg-primary/5 p-4 rounded-xl border border-primary/10 text-left">
              <p className="font-semibold text-foreground flex items-center gap-2">
                <span className="text-xl">⚠️</span> Important Note:
              </p>
              <p className="text-sm mt-2 leading-relaxed">
                Please check your <strong>Spam or Promotions</strong> folder just in case. If you find our email there, please mark it as <strong>"Not Spam"</strong> so you don't miss the workshop links!
              </p>
            </div>
          </div>
          <div className="pt-4">
            <Button onClick={() => setIsSuccessModalOpen(false)} className="w-full h-12 text-lg font-bold">
              Got it, Thanks!
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default WorkshopPaymentModal;
