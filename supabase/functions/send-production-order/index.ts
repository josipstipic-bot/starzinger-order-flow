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
    console.log('Function started - processing order')
    
    const body = await req.json()
    const { orderData } = body
    
    if (!orderData?.customerEmail) {
      return new Response(
        JSON.stringify({ error: 'Customer email required' }),
        { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      )
    }

    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
    if (!RESEND_API_KEY) {
      return new Response(
        JSON.stringify({ error: 'Email service not configured' }),
        { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      )
    }

    console.log('Attempting to send email to:', orderData.customerEmail)
    console.log('Order number:', orderData.orderNumber)

    // Send a simple test email first
    const emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Production Orders <onboarding@resend.dev>',
        to: [orderData.customerEmail],
        subject: `Order Confirmation - ${orderData.orderNumber}`,
        html: `
          <h1>Thank you for your order!</h1>
          <p>Dear ${orderData.customerFirstName} ${orderData.customerLastName},</p>
          <p>We have received your production order for: <strong>${orderData.productDescription}</strong></p>
          <p>Order Number: <strong>${orderData.orderNumber}</strong></p>
          <p>We will process your order and get back to you soon.</p>
          <p>Best regards,<br>Starzinger Team</p>
        `,
      }),
    })

    const emailResult = await emailResponse.json()
    
    console.log('Resend API Response:')
    console.log('Status:', emailResponse.status)
    console.log('Response:', JSON.stringify(emailResult, null, 2))

    if (!emailResponse.ok) {
      console.error('Resend API Error:', emailResult)
      return new Response(
        JSON.stringify({ 
          error: 'Email service error',
          details: emailResult,
          status: emailResponse.status
        }),
        { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      )
    }

    // Also send to company email
    const companyResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Production Orders <onboarding@resend.dev>',
        to: ['pl@starzinger.com'],
        subject: `New Order - ${orderData.orderNumber}`,
        html: `
          <h1>New Production Order</h1>
          <p><strong>Customer:</strong> ${orderData.customerFirstName} ${orderData.customerLastName}</p>
          <p><strong>Email:</strong> ${orderData.customerEmail}</p>
          <p><strong>Company:</strong> ${orderData.customerNumber}</p>
          <p><strong>Product:</strong> ${orderData.productDescription}</p>
          <p><strong>Order Number:</strong> ${orderData.orderNumber}</p>
        `,
      }),
    })

    const companyResult = await companyResponse.json()
    console.log('Company email result:', companyResult)

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Emails sent successfully',
        emailIds: {
          customer: emailResult.id,
          company: companyResult.id
        }
      }),
      { status: 200, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    )

  } catch (error) {
    console.error('Function error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    )
  }
})