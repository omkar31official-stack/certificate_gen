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
- **Background Jobs:** Vercel Cron Jobs / Custom Queue Architecture

## Setup Instructions
1. Ensure your PostgreSQL connection string is in `.env.local`
2. Run `npm install`
3. Run `npx prisma db push` (or `npx prisma migrate dev`) to push the schema
4. Start the dev server: `npm run dev`
# certificate_gen
