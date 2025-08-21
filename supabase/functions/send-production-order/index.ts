
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
    console.log('RESEND_API_KEY available:', !!RESEND_API_KEY)
    
    const { orderData }: { orderData: OrderData } = await req.json()
    console.log('Received order data:', { 
      orderNumber: orderData.orderNumber, 
      customerEmail: orderData.customerEmail 
    })

    if (!orderData.customerEmail) {
      return new Response(
        JSON.stringify({ error: 'Customer email is required' }), 
        { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      )
    }

    if (!RESEND_API_KEY) {
      console.error('RESEND_API_KEY is not configured')
      return new Response(
        JSON.stringify({ error: 'Email service not configured' }), 
        { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      )
    }

    console.log('Starting email process for order:', orderData.orderNumber)

    // Format order data for email
    const formatOrderData = (data: OrderData) => {
      return `
        <h2>Production Order Specification</h2>
        <p><strong>Order Number:</strong> ${data.orderNumber}</p>
        <p><strong>Submitted:</strong> ${new Date(data.submittedAt).toLocaleString()}</p>
        
        <h3>Customer Information</h3>
        <p><strong>Company:</strong> ${data.customerNumber}</p>
        <p><strong>Contact:</strong> ${data.customerFirstName} ${data.customerLastName}</p>
        <p><strong>Email:</strong> ${data.customerEmail}</p>
        <p><strong>Order Date:</strong> ${data.orderDate}</p>
        
        <h3>Product Information</h3>
        <p><strong>Product Description:</strong> ${data.productDescription}</p>
        <p><strong>Article Number:</strong> ${data.articleNumber || 'N/A'}</p>
        <p><strong>Can Layout Number:</strong> ${data.decorationNumber || 'N/A'}</p>
        
        <h3>Specifications</h3>
        <p><strong>Can Size:</strong> ${data.canSize || 'N/A'}</p>
        <p><strong>Packaging Type:</strong> ${data.packagingType || 'N/A'}</p>
        <p><strong>Packaging Variant:</strong> ${data.packagingVariant || 'N/A'}</p>
        <p><strong>Special Filling:</strong> ${data.specialFilling?.join(', ') || 'None'}</p>
        
        ${data.abvPercentage ? `<p><strong>ABV:</strong> ${data.abvPercentage}%</p>` : ''}
        
        <h3>Technical Details</h3>
        <p><strong>Top Variant:</strong> ${data.topVariant || 'N/A'}</p>
        <p><strong>Recipe Number:</strong> ${data.recipeNumber || 'N/A'}</p>
        <p><strong>Pasteurization:</strong> ${data.pasteurization || 'N/A'}</p>
        <p><strong>Flash Pasteurization:</strong> ${data.flashPasteurization || 'N/A'}</p>
        <p><strong>Contains Allergens:</strong> ${data.containsAllergens || 'N/A'}</p>
        
        ${data.additionalInfo ? `<h3>Additional Information</h3><p>${data.additionalInfo}</p>` : ''}
      `
    }

    const emailContent = formatOrderData(orderData)
    console.log('Email content prepared, making requests to Resend API')

    const emailRequests = [
      // Email to Starzinger
      fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'Production Orders <onboarding@resend.dev>',
          to: ['pl@starzinger.com'],
          subject: `New Production Order Specification - ${orderData.orderNumber}`,
          html: emailContent,
        }),
      }),
      
      // Email to customer
      fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'Production Orders <onboarding@resend.dev>',
          to: [orderData.customerEmail],
          subject: `Production Order Confirmation - ${orderData.orderNumber}`,
          html: `
            <h2>Thank you for your order!</h2>
            <p>Dear ${orderData.customerFirstName} ${orderData.customerLastName},</p>
            <p>We have received your production order specification. Here are the details:</p>
            ${emailContent}
            <p>We will process your order and get back to you soon.</p>
            <p>Best regards,<br>Starzinger Team</p>
          `,
        }),
      }),
    ]

    console.log('Sending emails to Resend API...')
    const responses = await Promise.all(emailRequests)
    
    // Check if both emails were sent successfully
    const results = await Promise.all(responses.map(async (r) => {
      const result = await r.json()
      console.log('Email response:', { status: r.status, result })
      return { status: r.status, result }
    }))
    
    // Check for any failed requests
    const failedRequests = results.filter(r => r.status !== 200)
    if (failedRequests.length > 0) {
      console.error('Failed email requests:', failedRequests)
      return new Response(
        JSON.stringify({ 
          error: 'Some emails failed to send', 
          details: failedRequests 
        }),
        { 
          status: 500,
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        }
      )
    }
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Order sent successfully to both recipients',
        results: results.map(r => r.result)
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
