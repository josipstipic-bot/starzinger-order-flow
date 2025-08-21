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
    console.log('Function started successfully')
    
    const requestBody = await req.json()
    console.log('Request body parsed:', !!requestBody)
    
    const { orderData } = requestBody
    if (!orderData || !orderData.customerEmail) {
      return new Response(
        JSON.stringify({ error: 'Missing required data' }),
        { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      )
    }

    console.log('Order data valid, attempting to send emails')

    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
    if (!RESEND_API_KEY) {
      console.error('RESEND_API_KEY not found')
      return new Response(
        JSON.stringify({ error: 'API key not configured' }),
        { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      )
    }

    console.log('API key found, sending emails...')

    // Send email to customer
    const customerResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Production Orders <onboarding@resend.dev>',
        to: [orderData.customerEmail],
        subject: `Order Confirmation - ${orderData.orderNumber || 'SZ' + Date.now()}`,
        html: `<h1>Thank you!</h1><p>Your order for ${orderData.productDescription || 'your product'} has been received.</p>`,
      }),
    })

    const customerResult = await customerResponse.json()
    console.log('Customer email result:', customerResult)

    if (!customerResponse.ok) {
      console.error('Customer email failed:', customerResult)
      return new Response(
        JSON.stringify({ error: 'Failed to send customer email', details: customerResult }),
        { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      )
    }

    // Send email to Starzinger
    const companyResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Production Orders <onboarding@resend.dev>',
        to: ['pl@starzinger.com'],
        subject: `New Order - ${orderData.orderNumber || 'SZ' + Date.now()}`,
        html: `<h1>New Order Received</h1><p>From: ${orderData.customerFirstName} ${orderData.customerLastName}</p><p>Product: ${orderData.productDescription}</p>`,
      }),
    })

    const companyResult = await companyResponse.json()
    console.log('Company email result:', companyResult)

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Emails sent successfully',
        customerEmail: customerResult,
        companyEmail: companyResult
      }),
      { status: 200, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    )

  } catch (error) {
    console.error('Function error:', error)
    return new Response(
      JSON.stringify({ error: `Function error: ${error.message}` }),
      { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    )
  }
})