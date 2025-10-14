import nodemailer from 'nodemailer';
import type { IServiceRequest } from '../models/ServiceRequest';
import type { IQuoteRequest } from '../models/QuoteRequest';
import type { IContactInquiry } from '../models/ContactInquiry';

const emailPort = parseInt(process.env.EMAIL_PORT || '587');
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: emailPort,
  secure: emailPort === 465, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const NOTIFICATION_EMAIL = process.env.NOTIFICATION_EMAIL || 'service@paytonplacedevelopment.com';
const EMAIL_FROM = process.env.EMAIL_FROM || 'noreply@paytonplace.com';
const ADMIN_URL = process.env.ADMIN_URL || 'https://payton-place.mbartonportfolio.space/admin';

export const sendServiceRequestNotification = async (request: IServiceRequest & { serviceId: { name: string; category: string } }) => {
  try {
    const mailOptions = {
      from: EMAIL_FROM,
      to: NOTIFICATION_EMAIL,
      subject: `New Service Request - ${request.name}`,
      html: `
        <h2>New Service Request Received</h2>
        <p>A new service request has been submitted through the website.</p>

        <h3>Contact Information:</h3>
        <ul>
          <li><strong>Name:</strong> ${request.name}</li>
          <li><strong>Email:</strong> <a href="mailto:${request.email}">${request.email}</a></li>
          <li><strong>Phone:</strong> <a href="tel:${request.phone}">${request.phone}</a></li>
          <li><strong>Preferred Contact:</strong> ${request.preferredContactMethod}</li>
        </ul>

        <h3>Service Details:</h3>
        <ul>
          <li><strong>Service:</strong> ${request.serviceId.name}</li>
          <li><strong>Category:</strong> ${request.serviceId.category}</li>
        </ul>

        <h3>Message:</h3>
        <p>${request.message.replace(/\n/g, '<br>')}</p>

        <hr>
        <p><strong>Submitted:</strong> ${new Date(request.createdAt).toLocaleString()}</p>
        <p><a href="${ADMIN_URL}/service-requests">View in Admin Panel</a></p>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Service request email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('❌ Error sending service request email:', error);
    throw error;
  }
};

export const sendQuoteRequestNotification = async (request: IQuoteRequest) => {
  try {
    const mailOptions = {
      from: EMAIL_FROM,
      to: NOTIFICATION_EMAIL,
      subject: `New Quote Request - ${request.name}`,
      html: `
        <h2>New Quote Request Received</h2>
        <p>A new quote request has been submitted through the website.</p>

        <h3>Contact Information:</h3>
        <ul>
          <li><strong>Name:</strong> ${request.name}</li>
          <li><strong>Email:</strong> <a href="mailto:${request.email}">${request.email}</a></li>
          <li><strong>Phone:</strong> <a href="tel:${request.phone}">${request.phone}</a></li>
        </ul>

        <h3>Project Details:</h3>
        <ul>
          <li><strong>Project Type:</strong> ${request.projectType}</li>
          <li><strong>Budget Range:</strong> ${request.budgetRange}</li>
          <li><strong>Timeline:</strong> ${request.timeline}</li>
        </ul>

        <h3>Description:</h3>
        <p>${request.description.replace(/\n/g, '<br>')}</p>

        <hr>
        <p><strong>Submitted:</strong> ${new Date(request.createdAt).toLocaleString()}</p>
        <p><a href="${ADMIN_URL}/quotes">View in Admin Panel</a></p>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Quote request email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('❌ Error sending quote request email:', error);
    throw error;
  }
};

export const sendContactInquiryNotification = async (inquiry: IContactInquiry) => {
  try {
    const projectTypeText = inquiry.projectType ? ` (${inquiry.projectType})` : '';

    const mailOptions = {
      from: EMAIL_FROM,
      to: NOTIFICATION_EMAIL,
      subject: `New Contact Inquiry - ${inquiry.name}${projectTypeText}`,
      html: `
        <h2>New Contact Inquiry Received</h2>
        <p>A new contact inquiry has been submitted through the website.</p>

        <h3>Contact Information:</h3>
        <ul>
          <li><strong>Name:</strong> ${inquiry.name}</li>
          <li><strong>Email:</strong> <a href="mailto:${inquiry.email}">${inquiry.email}</a></li>
          ${inquiry.projectType ? `<li><strong>Project Type:</strong> ${inquiry.projectType}</li>` : ''}
        </ul>

        <h3>Message:</h3>
        <p>${inquiry.message.replace(/\n/g, '<br>')}</p>

        <hr>
        <p><strong>Submitted:</strong> ${new Date(inquiry.createdAt).toLocaleString()}</p>
        <p><a href="${ADMIN_URL}/inquiries">View in Admin Panel</a></p>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Contact inquiry email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('❌ Error sending contact inquiry email:', error);
    throw error;
  }
};

// Verify Cloudflare Turnstile token
export const verifyTurnstileToken = async (token: string): Promise<boolean> => {
  try {
    const secretKey = process.env.TURNSTILE_SECRET_KEY;

    if (!secretKey) {
      console.warn('⚠️ TURNSTILE_SECRET_KEY not configured - skipping verification');
      return true; // Allow submissions if not configured (for development)
    }

    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        secret: secretKey,
        response: token,
      }),
    });

    const data = await response.json() as { success: boolean; 'error-codes'?: string[] };

    if (data.success) {
      console.log('✅ Turnstile verification successful');
      return true;
    } else {
      console.warn('⚠️ Turnstile verification failed:', data['error-codes']);
      return false;
    }
  } catch (error) {
    console.error('❌ Error verifying Turnstile token:', error);
    return false;
  }
};
