import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

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
  articleNumber?: string
  decorationNumber?: string
  canSize?: string
  packagingType?: string
  packagingVariant?: string
  specialFilling?: string[]
  abvPercentage?: string
  topVariant?: string
  recipeNumber?: string
  pasteurization?: string
  flashPasteurization?: string
  containsAllergens?: string
  additionalInfo?: string
  [key: string]: any
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405, headers: corsHeaders })
  }

  try {
    console.log('Function started')
    
    const requestBody = await req.json()
    const { orderData }: { orderData: OrderData } = requestBody
    
    if (!orderData || !orderData.customerEmail) {
      return new Response(
        JSON.stringify({ error: 'Missing required data' }),
        { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      )
    }

    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
    if (!RESEND_API_KEY) {
      return new Response(
        JSON.stringify({ error: 'API key not configured' }),
        { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      )
    }

    console.log('Sending emails for order:', orderData.orderNumber)

    // Format order details for email
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

    // Send customer confirmation email
    console.log('Sending customer email to:', orderData.customerEmail)
    const customerResponse = await fetch('https://api.resend.com/emails', {
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
    })

    const customerResult = await customerResponse.json()
    console.log('Customer email response:', { 
      status: customerResponse.status, 
      statusText: customerResponse.statusText,
      result: customerResult 
    })

    if (!customerResponse.ok) {
      console.error('Customer email failed:', customerResult)
      return new Response(
        JSON.stringify({ 
          error: 'Failed to send customer email',
          details: customerResult
        }),
        { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      )
    }

    // Send company notification email
    console.log('Sending company email to: pl@starzinger.com')
    const companyResponse = await fetch('https://api.resend.com/emails', {
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
    })

    const companyResult = await companyResponse.json()
    console.log('Company email response:', { 
      status: companyResponse.status, 
      statusText: companyResponse.statusText,
      result: companyResult 
    })

    if (!companyResponse.ok) {
      console.error('Company email failed:', companyResult)
      return new Response(
        JSON.stringify({ 
          error: 'Failed to send company email',
          details: companyResult
        }),
        { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      )
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Order sent successfully to both recipients'
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