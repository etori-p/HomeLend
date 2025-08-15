import { NextResponse } from 'next/server';
import sgMail from '@sendgrid/mail'; 

// Set SendGrid API Key
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export async function POST(request) {
  try {
    const { name, email, phone, message } = await request.json();

    if (!name || !email || !message) {
      return NextResponse.json({ message: 'Name, email, and message are required.' }, { status: 400 });
    }

    const msg = {
      to: process.env.SENDGRID_TO_EMAIL || 'cody26946@gmail.com', 
      from: process.env.SENDGRID_FROM_EMAIL, 
      subject: `New Contact Form Submission from ${name} (Homelend Website)`,
      html: `
        <p>You have received a new message from your website contact form.</p>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone || 'N/A'}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    };

    await sgMail.send(msg);

    return NextResponse.json({ message: 'Your message has been sent successfully! We will get back to you soon.' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'There was an error sending your message. Please try again.' }, { status: 500 });
  }
}
