// Supabase Edge Function: verify-payment
// 1. Receives razorpay_payment_id, batch_id, and user_email from the frontend
// 2. Fetches and verifies the payment using the SECRET key (server-side only)
// 3. Confirms the payment was actually successful before granting course access
//
// RAZORPAY_KEY_SECRET is stored as a Supabase Secret — never hardcoded here.

// deno-lint-ignore-file no-explicit-any

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const RAZORPAY_KEY_SECRET = Deno.env.get("RAZORPAY_KEY_SECRET");

    if (!RAZORPAY_KEY_SECRET) {
      return new Response(
        JSON.stringify({ error: "RAZORPAY_KEY_SECRET is not configured." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Missing Authorization header" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
    const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY") ?? "";

    // Import official Supabase client
    const { createClient } = await import("https://esm.sh/@supabase/supabase-js@2.39.3");
    
    // Create client using the standard edge function pattern
    const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    // Extract just the token part from "Bearer <token>"
    const token = authHeader.replace("Bearer ", "").trim();

    // Pass the token explicitly to getUser to verify the session
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token);

    if (authError || !user) {
      return new Response(
        JSON.stringify({ 
          error: "Unauthorized: Invalid user session", 
          details: authError?.message || "User not found"
        }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const verified_email = user.email;

    const body = await req.json();
    const { razorpay_payment_id, batch_id, course_name } = body;

    if (!razorpay_payment_id || !batch_id) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: razorpay_payment_id, batch_id" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Step 1: Verify the payment with Razorpay API using the secret key
    const RAZORPAY_KEY_ID = Deno.env.get("RAZORPAY_KEY_ID");
    if (!RAZORPAY_KEY_ID) {
      return new Response(
        JSON.stringify({ error: "RAZORPAY_KEY_ID is not configured." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    const credentials = btoa(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`);
    const verifyRes = await fetch(`https://api.razorpay.com/v1/payments/${razorpay_payment_id}`, {
      method: "GET",
      headers: {
        "Authorization": `Basic ${credentials}`,
        "Content-Type": "application/json",
      },
    });

    if (!verifyRes.ok) {
      return new Response(
        JSON.stringify({ error: "Failed to verify payment with Razorpay." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    let payment = await verifyRes.json();

    // Step 2: If authorized, we must capture it to actually claim the funds
    if (payment.status === "authorized") {
      const captureRes = await fetch(`https://api.razorpay.com/v1/payments/${razorpay_payment_id}/capture`, {
        method: "POST",
        headers: {
          "Authorization": `Basic ${credentials}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: payment.amount,
          currency: payment.currency,
        }),
      });

      if (!captureRes.ok) {
        const captureError = await captureRes.json();
        return new Response(
          JSON.stringify({ error: "Failed to capture authorized payment.", details: captureError }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      payment = await captureRes.json(); // Update payment object with captured status
    }

    // Step 3: Confirm final status is captured
    if (payment.status !== "captured") {
      return new Response(
        JSON.stringify({ error: `Payment failed. Status is: ${payment.status}` }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Step 3: Payment is verified ✅
    // Call the N8N payment webhook securely
    const N8N_PAYMENT_WEBHOOK_URL = Deno.env.get("N8N_PAYMENT_WEBHOOK_URL");
    if (N8N_PAYMENT_WEBHOOK_URL) {
      try {
        await fetch(N8N_PAYMENT_WEBHOOK_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            event: "payment_success",
            user_email: verified_email,
            user_name: user.user_metadata?.full_name,
            phone_number: user.user_metadata?.phone_number,
            payment_id: razorpay_payment_id,
            course_id: batch_id, // Currently batch_id represents the course/batch
            course_name: course_name || "Unknown Course",
            amount: payment.amount / 100, // Convert from paise
            currency: payment.currency
          })
        });
      } catch (err) {
        console.error("Failed to trigger payment webhook:", err);
      }
    }
    
    // TODO: Here you can call the edrona API to create the enrollment
    // e.g. POST to /api/ritz7ai/enrollments with { batch_id, user_email }
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Payment verified successfully.",
        payment_id: razorpay_payment_id,
        batch_id,
        user_email: verified_email,
        amount: payment.amount / 100, // Razorpay returns amount in paise
        currency: payment.currency,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (err) {
    const error = err as Error;
    return new Response(
      JSON.stringify({ error: "Internal server error", message: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
