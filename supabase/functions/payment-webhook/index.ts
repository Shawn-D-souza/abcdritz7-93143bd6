import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

async function verifyRazorpaySignature(orderId: string, paymentId: string, signature: string, secret: string) {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const data = encoder.encode(orderId + "|" + paymentId);
  const signatureBuffer = await crypto.subtle.sign("HMAC", key, data);
  const hashArray = Array.from(new Uint8Array(signatureBuffer));
  const expectedSignature = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  
  return expectedSignature === signature;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { payment_id, order_id, signature, name, email, whatsapp, amount, workshop_name, date } = body;

    // Retrieve secrets
    const webhookUrl = Deno.env.get('N8N_WEBHOOK_URL');
    const rzpKeyId = Deno.env.get('RAZORPAY_KEY_ID');
    const rzpKeySecret = Deno.env.get('RAZORPAY_KEY_SECRET');
    
    if (!webhookUrl) {
      throw new Error("N8N_WEBHOOK_URL is not set in Edge Function secrets.");
    }

    if (order_id && signature && rzpKeySecret) {
      const isValid = await verifyRazorpaySignature(order_id, payment_id, signature, rzpKeySecret);
      if (!isValid) {
        throw new Error("Invalid payment signature");
      }
    } else {
      console.warn("Missing order_id or signature, proceeding with caution (not recommended for production)");
    }

    console.log(`Processing payment ${payment_id} for ${name}`);

    let paymentMethod = "Unknown";
    
    // Fetch payment details from Razorpay to get the payment method (UPI, Card, etc.)
    if (rzpKeyId && rzpKeySecret && payment_id) {
      try {
        const rzpResponse = await fetch(`https://api.razorpay.com/v1/payments/${payment_id}`, {
          method: 'GET',
          headers: {
            'Authorization': 'Basic ' + btoa(`${rzpKeyId}:${rzpKeySecret}`)
          }
        });
        
        if (rzpResponse.ok) {
          const rzpData = await rzpResponse.json();
          paymentMethod = rzpData.method || "Unknown"; // e.g., 'upi', 'card', 'netbanking'
          
          // Explicitly Capture Payment if it's only Authorized
          if (rzpData.status === 'authorized') {
            console.log(`Payment ${payment_id} is authorized, capturing now...`);
            const captureResponse = await fetch(`https://api.razorpay.com/v1/payments/${payment_id}/capture`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Basic ' + btoa(`${rzpKeyId}:${rzpKeySecret}`)
              },
              body: JSON.stringify({
                amount: rzpData.amount,
                currency: rzpData.currency
              })
            });
            
            if (!captureResponse.ok) {
              const captureError = await captureResponse.json();
              console.error("Failed to capture payment:", captureError);
            } else {
              console.log(`Successfully captured payment ${payment_id}`);
            }
          }
        }
      } catch (err) {
        console.error("Failed to fetch/capture Razorpay payment details:", err);
      }
    }

    // Call the N8N webhook securely from the server
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        payment_id,
        name,
        email,
        whatsapp,
        amount,
        workshop_name,
        date,
        payment_method: paymentMethod
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to trigger webhook: ${response.statusText}`);
    }

    // Update Supabase Database non-blockingly
    if (order_id) {
      const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
      const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
      if (supabaseUrl && supabaseKey) {
        const supabase = createClient(supabaseUrl, supabaseKey);
        await supabase.from('workshop_registrations').update({
          status: 'success',
          payment_id,
          payment_method: paymentMethod
        }).eq('order_id', order_id);
      }
    }

    return new Response(
      JSON.stringify({ success: true, message: "Webhook triggered successfully" }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error in payment-webhook:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      }
    );
  }
});
