// Invoice Email Service
// Uses user's custom SMTP or default SMTP configuration

import nodemailer from "nodemailer"
import { getUserSMTP } from "./actions/smtp"

interface InvoiceData {
  id: string
  invoiceNumber: string
  clientName: string
  clientEmail: string
  amount: number
  currency?: string
  dueDate: Date
  createdAt: Date
  notes?: string | null
  lineItems?: Array<{
    description: string
    quantity: number
    rate: number
    amount: number
  }>
  taxRate?: number | null
  discount?: number | null
  shipping?: number | null
}

interface SendInvoiceEmailParams {
  invoice: InvoiceData
  invoiceViewUrl: string
  pdfBuffer?: Buffer
}

/**
 * Calculate invoice total from line items, tax, discount, and shipping
 */
function calculateInvoiceTotal(invoice: InvoiceData): number {
  let total = invoice.amount || 0

  if (invoice.lineItems && invoice.lineItems.length > 0) {
    const subtotal = invoice.lineItems.reduce((sum, item) => sum + item.amount, 0)
    const taxRate = invoice.taxRate || 0
    const taxAmount = (subtotal * taxRate) / 100
    const discount = invoice.discount || 0
    const shipping = invoice.shipping || 0
    total = subtotal + taxAmount + shipping - discount
  }

  return total
}

/**
 * Format currency amount
 */
function formatCurrency(amount: number, currency: string = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
  }).format(amount)
}

/**
 * Generate professional HTML email template for invoice
 */
function generateInvoiceEmailHTML(params: SendInvoiceEmailParams): string {
  const { invoice, invoiceViewUrl } = params
  const total = calculateInvoiceTotal(invoice)
  const formattedAmount = formatCurrency(total, invoice.currency || "USD")
  const dueDate = new Date(invoice.dueDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  // Format line items table if available
  let lineItemsHTML = ""
  if (invoice.lineItems && invoice.lineItems.length > 0) {
    lineItemsHTML = `
      <div style="margin: 30px 0;">
        <table style="width: 100%; border-collapse: collapse; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <thead>
            <tr style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
              <th style="padding: 16px; text-align: left; color: #ffffff; font-weight: 600; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">Description</th>
              <th style="padding: 16px; text-align: center; color: #ffffff; font-weight: 600; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">Qty</th>
              <th style="padding: 16px; text-align: right; color: #ffffff; font-weight: 600; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">Rate</th>
              <th style="padding: 16px; text-align: right; color: #ffffff; font-weight: 600; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">Amount</th>
            </tr>
          </thead>
          <tbody>
            ${invoice.lineItems
              .map(
                (item, index) => `
              <tr style="${index % 2 === 0 ? 'background: #f8f9fa;' : 'background: #ffffff;'}">
                <td style="padding: 16px; border-bottom: 1px solid #e9ecef; color: #333; font-size: 14px;">${item.description}</td>
                <td style="padding: 16px; text-align: center; border-bottom: 1px solid #e9ecef; color: #666; font-size: 14px;">${item.quantity}</td>
                <td style="padding: 16px; text-align: right; border-bottom: 1px solid #e9ecef; color: #666; font-size: 14px;">${formatCurrency(item.rate, invoice.currency || "USD")}</td>
                <td style="padding: 16px; text-align: right; border-bottom: 1px solid #e9ecef; color: #333; font-weight: 600; font-size: 14px;">${formatCurrency(item.amount, invoice.currency || "USD")}</td>
              </tr>
            `
              )
              .join("")}
          </tbody>
        </table>
      </div>
    `
  }

  // Calculate tax and totals if line items exist
  let totalsHTML = ""
  if (invoice.lineItems && invoice.lineItems.length > 0) {
    const subtotal = invoice.lineItems.reduce((sum, item) => sum + item.amount, 0)
    const taxRate = invoice.taxRate || 0
    const taxAmount = (subtotal * taxRate) / 100
    const discount = invoice.discount || 0
    const shipping = invoice.shipping || 0

    totalsHTML = `
      <div style="margin: 30px 0; background: #f8f9fa; padding: 24px; border-radius: 8px;">
        <table style="width: 100%;">
          <tr>
            <td style="padding: 8px 0; text-align: right; color: #666; font-size: 14px;">Subtotal:</td>
            <td style="padding: 8px 0; text-align: right; font-weight: 600; font-size: 14px; width: 150px;">${formatCurrency(subtotal, invoice.currency || "USD")}</td>
          </tr>
          ${taxRate > 0 ? `
          <tr>
            <td style="padding: 8px 0; text-align: right; color: #666; font-size: 14px;">Tax (${taxRate}%):</td>
            <td style="padding: 8px 0; text-align: right; font-weight: 600; font-size: 14px;">${formatCurrency(taxAmount, invoice.currency || "USD")}</td>
          </tr>
          ` : ""}
          ${shipping > 0 ? `
          <tr>
            <td style="padding: 8px 0; text-align: right; color: #666; font-size: 14px;">Shipping:</td>
            <td style="padding: 8px 0; text-align: right; font-weight: 600; font-size: 14px;">${formatCurrency(shipping, invoice.currency || "USD")}</td>
          </tr>
          ` : ""}
          ${discount > 0 ? `
          <tr>
            <td style="padding: 8px 0; text-align: right; color: #666; font-size: 14px;">Discount:</td>
            <td style="padding: 8px 0; text-align: right; font-weight: 600; font-size: 14px; color: #dc3545;">-${formatCurrency(discount, invoice.currency || "USD")}</td>
          </tr>
          ` : ""}
          <tr style="border-top: 2px solid #667eea; margin-top: 12px;">
            <td style="padding: 16px 0 0 0; text-align: right; font-weight: 700; font-size: 20px; color: #333;">Total:</td>
            <td style="padding: 16px 0 0 0; text-align: right; font-weight: 700; font-size: 20px; color: #667eea;">${formattedAmount}</td>
          </tr>
        </table>
      </div>
    `
  }

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Invoice ${invoice.invoiceNumber}</title>
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 700px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
        <div style="background-color: white; border-radius: 12px; padding: 40px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <!-- Header -->
          <div style="text-align: center; margin-bottom: 40px; padding-bottom: 30px; border-bottom: 3px solid #667eea;">
            <h1 style="color: #667eea; margin: 0; font-size: 32px; font-weight: 700;">PayTrack</h1>
            <p style="color: #6c757d; margin: 8px 0 0 0; font-size: 16px;">Invoice Notification</p>
          </div>

          <!-- Greeting -->
          <p style="font-size: 18px; margin-bottom: 24px; color: #333;">
            Hello <strong style="color: #667eea;">${invoice.clientName}</strong>,
          </p>

          <!-- Message -->
          <p style="font-size: 16px; margin-bottom: 30px; color: #555;">
            Please find your invoice details below. You can view the full invoice online or download the PDF attachment.
          </p>

          <!-- Invoice Details Card -->
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 12px; padding: 30px; margin: 30px 0; color: white;">
            <table style="width: 100%; color: white;">
              <tr>
                <td style="padding: 8px 0; font-weight: 600; font-size: 14px; opacity: 0.9;">Invoice Number:</td>
                <td style="padding: 8px 0; font-weight: 700; font-size: 16px;">${invoice.invoiceNumber}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: 600; font-size: 14px; opacity: 0.9;">Amount Due:</td>
                <td style="padding: 8px 0; font-weight: 700; font-size: 24px;">${formattedAmount}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: 600; font-size: 14px; opacity: 0.9;">Due Date:</td>
                <td style="padding: 8px 0; font-weight: 700; font-size: 16px;">${dueDate}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: 600; font-size: 14px; opacity: 0.9;">Date Issued:</td>
                <td style="padding: 8px 0; font-size: 14px; opacity: 0.95;">${new Date(invoice.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}</td>
              </tr>
            </table>
          </div>

          <!-- Line Items -->
          ${lineItemsHTML}

          <!-- Totals -->
          ${totalsHTML}

          <!-- Notes -->
          ${invoice.notes ? `
            <div style="margin: 30px 0; padding: 20px; background-color: #fff3cd; border-left: 4px solid #ffc107; border-radius: 6px;">
              <strong style="color: #856404; font-size: 14px;">Notes:</strong>
              <p style="margin: 8px 0 0 0; color: #856404; white-space: pre-wrap; font-size: 14px; line-height: 1.6;">${invoice.notes}</p>
            </div>
          ` : ""}

          <!-- Call to Action -->
          <div style="text-align: center; margin: 40px 0;">
            <a href="${invoiceViewUrl}" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 16px 40px; text-decoration: none; border-radius: 8px; font-weight: 700; font-size: 16px; box-shadow: 0 4px 6px rgba(102, 126, 234, 0.3);">
              View Invoice Online
            </a>
          </div>

          <!-- Footer -->
          <div style="margin-top: 40px; padding-top: 30px; border-top: 1px solid #e9ecef; text-align: center; color: #6c757d; font-size: 13px;">
            <p style="margin: 5px 0;">
              This is an automated email from PayTrack Invoice Management System.
            </p>
            <p style="margin: 5px 0;">
              If you have any questions, please contact the sender.
            </p>
          </div>
        </div>
      </body>
    </html>
  `
}

/**
 * Generate plain text version of invoice email
 */
function generateInvoiceEmailText(params: SendInvoiceEmailParams): string {
  const { invoice, invoiceViewUrl } = params
  const total = calculateInvoiceTotal(invoice)
  const formattedAmount = formatCurrency(total, invoice.currency || "USD")
  const dueDate = new Date(invoice.dueDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return `
Hello ${invoice.clientName},

Please find your invoice details below. You can view the full invoice online or download the PDF attachment.

Invoice Number: ${invoice.invoiceNumber}
Amount Due: ${formattedAmount}
Due Date: ${dueDate}
Date Issued: ${new Date(invoice.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })}

View Invoice Online: ${invoiceViewUrl}

${invoice.notes ? `Notes:\n${invoice.notes}\n` : ""}

---
This is an automated email from PayTrack Invoice Management System.
If you have any questions, please contact the sender.
  `.trim()
}

/**
 * Create SMTP transporter using user's custom SMTP or default SMTP
 */
async function createSMTPTransporter(userId: string) {
  // Try to get user's custom SMTP
  let userSMTP = null
  try {
    userSMTP = await getUserSMTP()
  } catch (error) {
    // If getUserSMTP fails (e.g., model not available), continue with default
    console.warn("Could not fetch user SMTP, using default:", error)
  }
  
  let smtpHost: string
  let smtpPort: number
  let smtpUser: string
  let smtpPassword: string
  let fromEmail: string
  let fromName: string

  if (userSMTP && userSMTP.useCustom) {
    // Use user's custom SMTP
    smtpHost = userSMTP.host
    smtpPort = userSMTP.port
    smtpUser = userSMTP.username
    smtpPassword = userSMTP.password
    fromEmail = userSMTP.fromEmail
    fromName = userSMTP.fromName || "PayTrack"
  } else {
    // Use default SMTP from environment
    smtpHost = process.env.SMTP_HOST || "smtp.resend.com"
    smtpPort = parseInt(process.env.SMTP_PORT || "465", 10)
    smtpUser = process.env.SMTP_USER || process.env.SMTP_USERNAME || "resend"
    smtpPassword = process.env.SMTP_PASSWORD || process.env.SMTP_PASS || ""
    fromEmail = process.env.SMTP_FROM_EMAIL || "send@brnnd.com"
    fromName = process.env.SMTP_FROM_NAME || "brnnd"
  }

  if (!smtpUser || !smtpPassword) {
    const errorMsg = "SMTP credentials not configured. Please set SMTP_USER and SMTP_PASSWORD environment variables or configure custom SMTP in settings."
    console.error("SMTP Configuration Error:", {
      hasUser: !!smtpUser,
      hasPassword: !!smtpPassword,
      usingCustom: userSMTP?.useCustom || false,
    })
    throw new Error(errorMsg)
  }

  console.log("SMTP Configuration:", {
    host: smtpHost,
    port: smtpPort,
    user: smtpUser,
    fromEmail,
    fromName,
    usingCustom: userSMTP?.useCustom || false,
  })

  return {
    transporter: nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: {
        user: smtpUser,
        pass: smtpPassword,
      },
    }),
    from: `${fromName} <${fromEmail}>`,
  }
}

/**
 * Send invoice email via SMTP
 */
export async function sendInvoiceEmail(
  params: SendInvoiceEmailParams,
  userId: string
): Promise<{ success: boolean; message: string; error?: string }> {
  try {
    console.log("Starting email send process...")
    const { transporter, from } = await createSMTPTransporter(userId)
    console.log("SMTP transporter created, from:", from)
    
    const html = generateInvoiceEmailHTML(params)
    const text = generateInvoiceEmailText(params)

    const mailOptions: any = {
      from,
      to: params.invoice.clientEmail,
      subject: `Invoice ${params.invoice.invoiceNumber} from PayTrack`,
      html,
      text,
    }

    // Add PDF attachment if provided
    if (params.pdfBuffer) {
      mailOptions.attachments = [
        {
          filename: `invoice-${params.invoice.invoiceNumber}.pdf`,
          content: params.pdfBuffer,
          contentType: "application/pdf",
        },
      ]
    }

    console.log("Sending email to:", params.invoice.clientEmail)
    const result = await transporter.sendMail(mailOptions)
    console.log("Email sent successfully:", result.messageId)

    return {
      success: true,
      message: "Invoice email sent successfully",
    }
  } catch (error: any) {
    console.error("Error sending invoice email:", error)
    console.error("Error details:", {
      message: error.message,
      code: error.code,
      command: error.command,
      response: error.response,
      responseCode: error.responseCode,
    })
    return {
      success: false,
      message: "Failed to send invoice email",
      error: error.message || error.response || "Unknown error occurred",
    }
  }
}
