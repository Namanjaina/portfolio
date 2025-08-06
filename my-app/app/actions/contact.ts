"use server"

import { z } from "zod"

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
})

export async function sendContactEmail(formData: FormData) {
  try {
    // Validate form data
    const validatedFields = contactSchema.safeParse({
      name: formData.get("name"),
      email: formData.get("email"),
      subject: formData.get("subject"),
      message: formData.get("message"),
    })

    if (!validatedFields.success) {
      return {
        success: false,
        message: "Please check your form data and try again.",
        errors: validatedFields.error.flatten().fieldErrors,
      }
    }

    const { name, email, subject, message } = validatedFields.data

    // Email content
    const emailContent = `
      New Contact Form Submission from Portfolio
      
      Name: ${name}
      Email: ${email}
      Subject: ${subject}
      
      Message:
      ${message}
      
      ---
      Sent from Naman Bagrecha Portfolio Contact Form
      Time: ${new Date().toLocaleString()}
    `

    // Using a simple email service (you can replace this with your preferred service)
    // For now, we'll simulate the email sending
    console.log("Email would be sent to: Namanbagrecha007@gmail.com")
    console.log("Email content:", emailContent)

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // In a real implementation, you would use a service like:
    // - Nodemailer with SMTP
    // - SendGrid
    // - Resend
    // - EmailJS

    // Example with fetch to an email service:
    /*
    const response = await fetch('https://api.emailservice.com/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.EMAIL_API_KEY}`,
      },
      body: JSON.stringify({
        to: 'Namanbagrecha007@gmail.com',
        from: 'noreply@namanbagrecha.com',
        subject: `Portfolio Contact: ${subject}`,
        text: emailContent,
        html: emailContent.replace(/\n/g, '<br>'),
      }),
    })

    if (!response.ok) {
      throw new Error('Failed to send email')
    }
    */

    return {
      success: true,
      message: "Thank you for your message! I'll get back to you soon.",
    }
  } catch (error) {
    console.error("Error sending email:", error)
    return {
      success: false,
      message: "Sorry, there was an error sending your message. Please try again later.",
    }
  }
}
