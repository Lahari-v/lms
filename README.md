# Edemy - Full-Stack Learning Management System

Edemy is a full-featured Learning Management System (LMS) that enables users to browse, enroll in, and complete online courses. Built with a modern tech stack, it supports real-time progress tracking, secure authentication, dynamic course structures, lecture previews, payments via Stripe, and role-based dashboards for students and educators.

## Features

- **Course Discovery**: Browse available courses with ratings, discounts, durations, and lesson previews.
- **Educator Dashboard**: Create and manage courses, chapters, lectures, and monitor enrolled students.
- **Student Dashboard**: Enroll in courses, track progress, view completed lectures, and download certificates.
- **Authentication**: Secure user login/signup with [Clerk](https://clerk.dev) and JWT-based protected routes.
- **Stripe Integration**: Handle payments, discounts, and enrollments with Stripe Checkout and webhook support.
- **Progress Tracking**: Real-time lecture completion status with progress bars and persistent database state.
- **Lecture Previews**: Students can preview selected lectures before enrolling.
- **Cloud Deployed**: Fully deployed to cloud (e.g., Vercel or Render) for public access.

## Tech Stack

### Frontend
- React.js with Tailwind CSS
- React Router DOM 
- Clerk for Authentication
- Context API for global state management

### Backend
- Node.js with Express.js
- MongoDB with Mongoose
- Stripe Payments
- JWT-based route protection
- RESTful API architecture
  
## Live Demo

Try it out here: [edemy.vercel.app](https://lms-frontend-five-azure.vercel.app/)
