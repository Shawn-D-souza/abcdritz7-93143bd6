import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { payment_id, name, email, whatsapp, amount, workshop_name, date } = body;

    // Retrieve secrets
    const webhookUrl = Deno.env.get('N8N_WEBHOOK_URL');
    const rzpKeyId = Deno.env.get('RAZORPAY_KEY_ID');
    const rzpKeySecret = Deno.env.get('RAZORPAY_KEY_SECRET');
    
    if (!webhookUrl) {
      throw new Error("N8N_WEBHOOK_URL is not set in Edge Function secrets.");
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
        }
      } catch (err) {
        console.error("Failed to fetch Razorpay payment details:", err);
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
