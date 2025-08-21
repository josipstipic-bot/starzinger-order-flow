import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405, headers: corsHeaders })
  }

  try {
    // Just parse the request and return success without sending emails
    const body = await req.json()
    const { orderData } = body
    
    // Simulate a delay like email sending would have
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Order processed successfully (emails disabled for testing)',
        orderNumber: orderData?.orderNumber || 'TEST',
        timestamp: new Date().toISOString()
      }),
      { status: 200, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ 
        error: 'Function error',
        message: error.message
      }),
      { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    )
  }
})