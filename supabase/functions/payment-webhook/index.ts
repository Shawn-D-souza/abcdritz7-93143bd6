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

    // Retrieve the secure n8n webhook URL from environment variables
    const webhookUrl = Deno.env.get('N8N_WEBHOOK_URL');
    
    if (!webhookUrl) {
      console.error("N8N_WEBHOOK_URL is not set in Edge Function secrets.");
      throw new Error("Webhook configuration error");
    }

    console.log(`Processing payment ${payment_id} for ${name}`);

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
        date
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
