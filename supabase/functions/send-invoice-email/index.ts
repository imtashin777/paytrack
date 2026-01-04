// Supabase Edge Function for sending invoice emails
// Uses Resend API directly (more reliable than SMTP)

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Get Resend API key from environment (should be set in Supabase secrets)
    const resendApiKey = Deno.env.get('RESEND_API_KEY')
    
    if (!resendApiKey) {
      return new Response(
        JSON.stringify({ 
          error: 'RESEND_API_KEY is not configured. Please set it in Supabase Edge Function secrets.' 
        }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    // Parse request body
    const { to, subject, html, text, invoice } = await req.json()

    if (!to || !subject || !html) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: to, subject, html' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    // Get sender email from environment or use default
    // This should match your Supabase SMTP sender email (send@brnnd.com)
    // Note: Cannot use SUPABASE_ prefix (reserved by Supabase)
    const fromEmail = Deno.env.get('FROM_EMAIL') || Deno.env.get('RESEND_FROM_EMAIL') || 'send@brnnd.com'
    const fromName = Deno.env.get('FROM_NAME') || 'PayTrack'

    // Prepare email payload for Resend API
    const emailPayload: any = {
      from: fromName ? `${fromName} <${fromEmail}>` : fromEmail,
      to: [to],
      subject,
      html,
      text,
    }

    // Add PDF attachment if provided
    if (invoice && invoice.pdfAttachment) {
      emailPayload.attachments = [
        {
          filename: `invoice-${invoice.invoiceNumber}.pdf`,
          content: invoice.pdfAttachment, // Base64 encoded PDF
        },
      ]
    }

    // Send email via Resend API
    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify(emailPayload),
    })

    const resendData = await resendResponse.json()

    if (!resendResponse.ok) {
      console.error('Resend API error:', resendData)
      return new Response(
        JSON.stringify({ 
          error: resendData.message || 'Failed to send email via Resend',
          details: resendData 
        }),
        {
          status: resendResponse.status,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    // Success
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Invoice email sent successfully',
        emailId: resendData.id 
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )

  } catch (error: any) {
    console.error('Edge function error:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Internal server error',
        details: error.stack 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})

