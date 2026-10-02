# SLUG Event & Certificate Automation Platform

A complete, production-ready web application designed for the **SAPTHAGIRI LIBRE-SOFTWARE USERS GROUP (SLUG)**. This platform handles Event Management, Certificate Generation, Email Automation, Certificate Verification, and Announcements.

## Features
- **Public Portal:** View events, verify certificates via QR/ID, view gallery, and register for upcoming events.
- **Admin Dashboard:** Fully secured private dashboard for managing events, participants, and certificates.
- **Certificate Editor:** Upload templates, drag & drop dynamic fields, and generate PDFs.
- **Email Automation:** Send bulk certificates with automated tracking and retry functionality.
- **QR Code Verification:** Every generated certificate receives a globally unique ID and QR code.
- **Excel/CSV Imports:** Map excel columns directly to certificate variables.

## Tech Stack
- **Framework:** Next.js 15 (App Router) + React + TypeScript
- **Database:** PostgreSQL (Neon) + Prisma ORM
- **Authentication:** NextAuth (Auth.js) with strict server-side security
- **Styling:** Tailwind CSS + Framer Motion
- **Storage:** Cloudinary (for templates, generated PDFs, and gallery items)
- **Email:** Nodemailer (SMTP)
- **PDF Generation:** PDF-Lib
- **Background Jobs:** External Cron (GitHub Actions) / Custom Queue Architecture

## Email Queue & Background Jobs (Vercel Hobby Tier)
Vercel Hobby only supports 1 cron job per day, which delays bulk certificate emails. To fix this, this project removes `vercel.json` and uses an external trigger to process the email queue every 5 minutes while maintaining security (via `CRON_SECRET`).

**To set up the external cron:**
1. If deploying via GitHub, the included `.github/workflows/email-cron.yml` will automatically run every 5 minutes.
2. Go to your GitHub repository **Settings > Secrets and variables > Actions**.
3. Add a repository secret named `APP_URL` with your production URL (e.g., `https://your-domain.vercel.app`).
4. Add another secret named `CRON_SECRET` with the exact same secure token you used in your Vercel environment variables.
*(Alternatively, you can use a free service like cron-job.org to send a GET request to `https://your-domain.vercel.app/api/cron/process-email-queue` with the header `Authorization: Bearer YOUR_CRON_SECRET` every 5 minutes).*

## Setup Instructions
1. Ensure your PostgreSQL connection string is in `.env.local`
2. Run `npm install`
3. Run `npx prisma db push` (or `npx prisma migrate dev`) to push the schema
4. Start the dev server: `npm run dev`
# certificate_gen
