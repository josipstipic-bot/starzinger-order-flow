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
    console.log('=== FUNCTION START ===')
    
    // Get the request data
    const body = await req.json()
    console.log('Request body keys:', Object.keys(body))
    
    const { orderData } = body
    if (!orderData) {
      console.log('ERROR: No orderData found')
      return new Response(
        JSON.stringify({ error: 'No orderData provided' }),
        { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      )
    }
    
    console.log('Order data received:', {
      orderNumber: orderData.orderNumber,
      customerEmail: orderData.customerEmail,
      productDescription: orderData.productDescription
    })

    // Check API key
    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
    console.log('API key exists:', !!RESEND_API_KEY)
    console.log('API key length:', RESEND_API_KEY ? RESEND_API_KEY.length : 0)
    
    if (!RESEND_API_KEY) {
      console.log('ERROR: RESEND_API_KEY not found')
      return new Response(
        JSON.stringify({ error: 'RESEND_API_KEY not configured' }),
        { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      )
    }

    // Test a very simple email
    console.log('=== SENDING TEST EMAIL ===')
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Test <onboarding@resend.dev>',
        to: [orderData.customerEmail || 'test@example.com'],
        subject: 'Test Email',
        html: '<p>This is a test email to verify the setup.</p>',
      }),
    })

    console.log('Resend API response status:', response.status)
    console.log('Resend API response ok:', response.ok)
    
    const result = await response.json()
    console.log('Resend API result:', JSON.stringify(result, null, 2))

    if (!response.ok) {
      console.log('ERROR: Resend API call failed')
      return new Response(
        JSON.stringify({ 
          error: 'Resend API failed',
          status: response.status,
          details: result
        }),
        { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      )
    }

    console.log('=== SUCCESS ===')
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Test email sent successfully',
        emailId: result.id
      }),
      { status: 200, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    )

  } catch (error) {
    console.log('=== FUNCTION ERROR ===')
    console.error('Error details:', error)
    console.error('Error message:', error.message)
    console.error('Error stack:', error.stack)
    
    return new Response(
      JSON.stringify({ 
        error: 'Function crashed',
        message: error.message,
        type: error.constructor.name
      }),
      { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    )
  }
})