import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { google } from 'googleapis';
// Don't use dotenv/config in Next.js - it uses its own .env handling
// import 'dotenv/config';

// Get values from environment variables with fallbacks
const EMAIL_FROM = process.env.EMAIL_FROM || 'birthday.party.rsvp@example.com';
const EMAIL_ADMIN = process.env.EMAIL_ADMIN || 'organizer@example.com';
const EVENT_DETAILS = {
  date: process.env.EVENT_DATE || 'Sunday, April 15, 2024',
  time: process.env.EVENT_TIME || '12:00 Noon',
  venue: process.env.EVENT_VENUE || 'Yellow Chilling Restaurant',
  attireMale: process.env.EVENT_ATTIRE_MALE || 'Native Attire with Cap',
  attireFemale: process.env.EVENT_ATTIRE_FEMALE || 'Rich Aunty Attire',
  location: process.env.EVENT_LOCATION || 'Yellow Chilling Restaurant',
  mapLink: process.env.EVENT_MAP_LINK || 'https://maps.google.com/?q=Yellow+Chilling+Restaurant',
};

// SMTP configuration from environment variables
const SMTP_CONFIG = {
  host: process.env.SMTP_HOST || 'smtp.example.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER || 'username@example.com',
    pass: process.env.SMTP_PASS || 'password',
  },
};

// Google Sheets configuration (optional)
const GOOGLE_SHEETS_ID = process.env.GOOGLE_SHEETS_ID;

export async function POST(request: NextRequest) {
  try {
    // Parse the request body with proper error handling
    let data;
    try {
      data = await request.json();
      console.log("Received data:", data);
    } catch (jsonError) {
      console.error('Error parsing JSON:', jsonError);
      return NextResponse.json(
        { error: 'Invalid request format' },
        { status: 400 }
      );
    }
    
    // Check if data exists and has required properties
    if (!data || typeof data.attending !== 'string') {
      return NextResponse.json(
        { error: 'Empty request body or missing attending field' },
        { status: 400 }
      );
    }
    
    const { attending, fullName, email, gender } = data;
    
    // Only process if attending is 'yes'
    if (attending !== 'yes') {
      return NextResponse.json({ 
        message: 'RSVP received. Thank you for your response!',
        success: true
      });
    }
    
    // Validate required fields
    if (!fullName || !email || !gender) {
      return NextResponse.json(
        { error: 'Full name, email, and gender are required' },
        { status: 400 }
      );
    }

    // Create a submission timestamp
    const submissionDate = new Date().toISOString();
    
    // Immediately respond successfully to make the form faster
    // Process emails in the background
    const emailPromises = [
      sendConfirmationEmail(fullName, email, gender),
      sendAdminNotification(fullName, email, gender)
    ];
    
    // Don't wait for the emails to be sent before returning
    Promise.all(emailPromises)
      .then(([guestEmailSent, adminEmailSent]) => {
        console.log(`Emails sent: Guest: ${guestEmailSent}, Admin: ${adminEmailSent}`);
        
        // Also log submission for backup
        console.log(`RSVP SUBMISSION: ${fullName}, ${email}, ${gender}, ${submissionDate}`);
      })
      .catch(error => {
        console.error('Error sending emails:', error);
      });
    
    // Return immediately for better UX
    return NextResponse.json({ 
      message: 'RSVP received successfully!',
      success: true
    });
    
  } catch (error) {
    console.error('Error processing RSVP:', error);
    return NextResponse.json(
      { error: 'Failed to process your RSVP' },
      { status: 500 }
    );
  }
}

/**
 * Send a confirmation email to the guest
 */
async function sendConfirmationEmail(fullName: string, email: string, gender: string) {
  try {
    const transporter = nodemailer.createTransport(SMTP_CONFIG);
    
    const { date, time, location, mapLink, venue, attireMale, attireFemale } = EVENT_DETAILS;
    
    // Select the correct attire based on gender
    const attire = gender === 'male' ? attireMale : attireFemale;
    
    // HTML email template with styling
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            color: #1f2937;
            line-height: 1.6;
            margin: 0;
            padding: 0;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 0;
            background-color: #f9fafb;
          }
          .header {
            background-color: #1f2937;
            padding: 30px 20px;
            text-align: center;
            color: white;
          }
          .content {
            padding: 30px 20px;
            background-color: #ffffff;
            border: 1px solid #e5e7eb;
          }
          .footer {
            text-align: center;
            padding: 20px;
            background-color: #f3f4f6;
            color: #6b7280;
            font-size: 0.8em;
          }
          .button {
            display: inline-block;
            background-color: #1f2937;
            color: white;
            text-decoration: none;
            padding: 12px 24px;
            border-radius: 6px;
            margin-top: 20px;
            font-weight: bold;
          }
          .details {
            background-color: #f9fafb;
            padding: 20px;
            border-radius: 6px;
            margin: 20px 0;
            border: 1px solid #e5e7eb;
          }
          h1 {
            margin: 0;
            font-size: 24px;
            color: #ffffff;
          }
          h2 {
            color: #1f2937;
            font-size: 20px;
            margin-top: 0;
          }
          p {
            margin: 10px 0;
            color: #4b5563;
          }
          .venue {
            font-weight: bold;
            color: #1f2937;
          }
          .highlight {
            font-weight: bold;
            color: #1f2937;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Your RSVP is Confirmed!</h1>
          </div>
          <div class="content">
            <p>Dear ${fullName},</p>
            <p>Thank you for confirming your attendance to Tayo's Birthday Lunch! We're excited to have you join us for this special celebration.</p>
            
            <div class="details">
              <h2>Event Details</h2>
              <p><span class="highlight">Date:</span> ${date}</p>
              <p><span class="highlight">Time:</span> ${time}</p>
              <p><span class="highlight">Venue:</span> ${venue}</p>
              <p><span class="highlight">Attire:</span> ${attire}</p>
              <p><span class="highlight">Location:</span> <span class="venue">${location}</span></p>
            </div>
            
            <p><strong>Important:</strong> This is a <strong>surprise party</strong>, so please keep this information confidential.</p>
            
            <div style="text-align: center;">
              <a href="${mapLink}" class="button">View Map Location</a>
            </div>
            
            <p>If you have any questions or need to update your RSVP, please reply to this email.</p>
            
            <p>We look forward to seeing you!</p>
          </div>
          <div class="footer">
            <p>This is an automated confirmation email.<br>Please do not reply to this message.</p>
          </div>
        </div>
      </body>
      </html>
    `;
    
    await transporter.sendMail({
      from: EMAIL_FROM,
      to: email,
      subject: 'Your Birthday Dinner RSVP Confirmation',
      html: htmlContent,
    });
    
    return true;
  } catch (error) {
    console.error('Error sending confirmation email:', error);
    return false;
  }
}

/**
 * Send a notification email to the admin
 */
async function sendAdminNotification(fullName: string, email: string, gender: string) {
  try {
    const transporter = nodemailer.createTransport(SMTP_CONFIG);
    
    const { date, time, location, venue, attireMale, attireFemale } = EVENT_DETAILS;
    
    // Select the correct attire based on gender
    const attire = gender === 'male' ? attireMale : attireFemale;
    
    await transporter.sendMail({
      from: EMAIL_FROM,
      to: EMAIL_ADMIN,
      subject: 'New Birthday Lunch RSVP Received',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
          <h2 style="color: #333; text-align: center;">New RSVP Received</h2>
          <p><strong>Name:</strong> ${fullName}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Gender:</strong> ${gender}</p>
          <p><strong>Attire Assigned:</strong> ${attire}</p>
          <p><strong>Time Submitted:</strong> ${new Date().toLocaleString()}</p>
          <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 20px 0;">
          <p style="font-size: 12px; color: #777; text-align: center;">
            This is an automated notification from your Birthday RSVP system.
          </p>
        </div>
      `,
    });
    
    return true;
  } catch (error) {
    console.error('Error sending admin notification:', error);
    return false;
  }
}

/**
 * Store RSVP data in Google Sheets
 */
async function storeInSpreadsheet(fullName: string, email: string, gender: string, date: string) {
  try {
    if (!GOOGLE_SHEETS_ID) {
      console.log('Google Sheets ID not configured. Skipping Google Sheets integration.');
      return false;
    }

    // Set up auth
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    // Format the data
    const values = [[fullName, email, gender, date]];

    // Append to the sheet
    await sheets.spreadsheets.values.append({
      spreadsheetId: GOOGLE_SHEETS_ID,
      range: 'A1', // Will append at the end
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values,
      },
    });

    return true;
  } catch (error) {
    console.error('Error storing data in Google Sheets:', error);
    return false;
  }
} 