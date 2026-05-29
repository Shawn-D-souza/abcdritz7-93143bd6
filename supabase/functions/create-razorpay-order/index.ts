import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { amount, currency = "INR", receipt, name, email, whatsapp, workshop_name } = body;

    let orderId = `free_${new Date().getTime()}`;
    let responseAmount = 0;
    let responseCurrency = currency;
    let finalStatus = amount === 0 ? 'success' : 'initiated';

    if (amount > 0) {
      const rzpKeyId = Deno.env.get('RAZORPAY_KEY_ID');
      const rzpKeySecret = Deno.env.get('RAZORPAY_KEY_SECRET');

      if (!rzpKeyId || !rzpKeySecret) {
        throw new Error("Razorpay credentials are not set.");
      }

      // Call Razorpay API to create an order
      const rzpResponse = await fetch('https://api.razorpay.com/v1/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Basic ' + btoa(`${rzpKeyId}:${rzpKeySecret}`)
        },
        body: JSON.stringify({
          amount: amount * 100, // Razorpay expects amount in paise
          currency,
          receipt,
        })
      });

      const rzpData = await rzpResponse.json();

      if (!rzpResponse.ok) {
        throw new Error(rzpData.error?.description || "Failed to create Razorpay order");
      }
      
      orderId = rzpData.id;
      responseAmount = rzpData.amount; // in paise
      responseCurrency = rzpData.currency;
    }

    // Insert into Supabase in a non-blocking manner (fire-and-forget) to keep performance fast
    if (name && email && whatsapp && workshop_name) {
      // Using setTimeout or just not awaiting the promise to avoid delaying the response
      const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
      const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
      
      if (supabaseUrl && supabaseKey) {
        const supabase = createClient(supabaseUrl, supabaseKey);
        // We don't await this so the frontend gets the response immediately
        supabase.from('workshop_registrations').insert({
          name,
          email,
          whatsapp,
          workshop_name,
          amount,
          status: finalStatus,
          order_id: orderId
        }).then(({ error }) => {
          if (error) console.error("Error inserting registration:", error);
        });
      } else {
        console.warn("Supabase URL or Key missing, skipping registration insert.");
      }
    }

    return new Response(
      JSON.stringify({ orderId: orderId, amount: responseAmount ? responseAmount / 100 : amount, currency: responseCurrency }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      }
    );
  }
});
