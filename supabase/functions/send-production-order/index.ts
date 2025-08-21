
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface OrderData {
  orderNumber: string
  submittedAt: string
  customerNumber: string
  customerFirstName: string
  customerLastName: string
  customerEmail: string
  orderDate: string
  productDescription: string
  // Add all other form fields as needed
  [key: string]: any
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  try {
    console.log('Edge function started')
    console.log('RESEND_API_KEY available:', !!RESEND_API_KEY)
    
    if (!RESEND_API_KEY) {
      console.error('RESEND_API_KEY is not configured')
      return new Response(
        JSON.stringify({ error: 'Email service not configured' }), 
        { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      )
    }

    const requestBody = await req.json()
    console.log('Request received, parsing order data...')
    
    const { orderData } = requestBody
    if (!orderData) {
      return new Response(
        JSON.stringify({ error: 'Missing order data' }), 
        { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      )
    }

    if (!orderData.customerEmail) {
      return new Response(
        JSON.stringify({ error: 'Customer email is required' }), 
        { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      )
    }

    console.log('Sending test email to:', orderData.customerEmail)

    // Simple test email first
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Production Orders <onboarding@resend.dev>',
        to: [orderData.customerEmail],
        subject: `Test Order - ${orderData.orderNumber || 'TEST'}`,
        html: '<h1>Test Email</h1><p>Your order form submission was received.</p>',
      }),
    })

    const result = await response.json()
    console.log('Resend response:', { status: response.status, result })

    if (!response.ok) {
      console.error('Resend API error:', result)
      return new Response(
        JSON.stringify({ error: 'Failed to send email', details: result }), 
        { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      )
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Test email sent successfully',
        result 
      }),
      { 
        status: 200,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      }
    )

  } catch (error) {
    console.error('Error sending emails:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to send order emails' }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      }
    )
  }
})
