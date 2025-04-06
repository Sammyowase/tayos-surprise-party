# Birthday Dinner RSVP Application

A modern, animated web application for collecting RSVPs for a surprise birthday dinner party. The application features a beautiful UI with animations, email notifications, and data storage capabilities.

## Features

- **Interactive RSVP Form** - Elegantly designed form with smooth animations
- **Email Confirmations** - Professional, styled confirmation emails sent to guests
- **Admin Notifications** - Email notifications sent to the organizer for each RSVP
- **Data Storage** - Optional Google Sheets integration for tracking responses
- **Mobile Responsive** - Looks great on all devices
- **Animated UI** - Engaging animations and confetti effect on submission

## Tech Stack

- **Frontend**: Next.js, React, Tailwind CSS, Framer Motion
- **Backend**: Next.js API Routes
- **Email Service**: Nodemailer
- **Data Storage**: Google Sheets API (optional implementation)

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn

### Installation

1. Clone this repository
```bash
git clone <repository-url>
cd birthday-rsvp
```

2. Install dependencies
```bash
npm install
# or
yarn
```

3. Set up environment variables
Create a `.env.local` file in the root directory and add:
```
# Email Configuration
EMAIL_FROM=your-email@example.com
EMAIL_ADMIN=organizer@example.com
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=username
SMTP_PASS=password

# Party Details
EVENT_DATE="Saturday, June 15, 2024"
EVENT_TIME="7:00 PM"
EVENT_LOCATION="123 Party Avenue, Celebration City"
EVENT_MAP_LINK="https://maps.google.com/?q=123+Party+Avenue,+Celebration+City"

# Optional: Google Sheets (if implementing spreadsheet storage)
GOOGLE_SHEETS_ID=your-sheet-id
```

4. Run the development server
```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application

## Customization

### Email Templates

Email templates can be modified in the `src/app/api/submit-rsvp/route.ts` file. Look for the `sendConfirmationEmail` and `sendAdminNotification` functions.

### Form & UI

The RSVP form component is located at `src/app/components/RSVPForm.tsx`. You can modify the form fields, styling, and animations here.

### Styling

Global styles are in `src/app/globals.css`, and component-specific styles are defined using Tailwind CSS classes.

## Deployment

This application can be deployed on Vercel, Netlify, or any other hosting platform that supports Next.js applications.

```bash
# Build the application
npm run build

# Start the production server
npm start
```

## Google Sheets Integration (Optional)

To enable Google Sheets integration:

1. Set up a Google Cloud project
2. Enable the Google Sheets API
3. Create a service account and download the credentials JSON file
4. Share your Google Sheet with the service account email
5. Uncomment the related code in `src/app/api/submit-rsvp/route.ts`

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [Next.js](https://nextjs.org/) - The React Framework
- [Tailwind CSS](https://tailwindcss.com/) - For styling
- [Framer Motion](https://www.framer.com/motion/) - For animations
- [React Confetti](https://www.npmjs.com/package/react-confetti) - For the celebration effect
- [React Hook Form](https://react-hook-form.com/) - For form handling
- [Nodemailer](https://nodemailer.com/) - For sending emails
- [Google Sheets API](https://developers.google.com/sheets/api) - For data storage
