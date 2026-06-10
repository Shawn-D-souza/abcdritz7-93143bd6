import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

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
    const { order_id, name, email, whatsapp, workshop_name } = body;

    if (!order_id || !name || !email) {
      throw new Error("Missing required fields");
    }

    const webhookUrl = Deno.env.get('N8N_WEBHOOK_URL');
    if (!webhookUrl) {
      throw new Error("N8N_WEBHOOK_URL is not set in Edge Function secrets.");
    }

    const d = new Date();
    const dateStr = d.getDate().toString().padStart(2, '0') + ' ' + d.toLocaleString('en-US', { month: 'short' }) + ', ' + d.getFullYear();

    // Call the N8N webhook securely from the server
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        payment_id: "free_registration",
        name,
        email,
        whatsapp,
        amount: 0,
        workshop_name,
        date: dateStr,
        payment_method: "Free"
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to trigger webhook: ${response.statusText}`);
    }

    // Update Supabase Database non-blockingly
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    
    if (supabaseUrl && supabaseKey) {
      const supabase = createClient(supabaseUrl, supabaseKey);
      await supabase.from('workshop_registrations').update({
        status: 'success',
        payment_id: "free_registration",
        payment_method: "Free"
      }).eq('order_id', order_id);
    }

    return new Response(
      JSON.stringify({ success: true, message: "Free registration confirmed successfully" }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error in confirm-free-registration:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      }
    );
  }
});
