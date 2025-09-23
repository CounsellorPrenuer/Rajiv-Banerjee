# KarmaPath Career Coaching Website

## Overview

KarmaPath is a professional career coaching and mentoring platform developed for Rajiv Banerjee, featuring 20+ years of corporate experience at IBM. The application is a comprehensive full-stack website built to showcase career guidance services, agile coaching, corporate workshops, and enterprise mentoring. The platform includes contact management, payment processing with Razorpay, blog functionality, testimonials, and a modern responsive design using React and TypeScript.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript and Vite for build tooling
- **Routing**: Wouter for client-side routing (lightweight alternative to React Router)
- **UI Framework**: Shadcn/ui components built on Radix UI primitives with Tailwind CSS
- **State Management**: TanStack Query (React Query) v5 for server state management
- **Forms**: React Hook Form with Zod validation for type-safe form handling
- **Styling**: Tailwind CSS with custom design tokens and CSS variables for theming
- **File Upload**: Uppy integration for file handling with cloud storage support

### Backend Architecture
- **Runtime**: Node.js with Express.js framework using TypeScript
- **Database ORM**: Drizzle ORM with PostgreSQL dialect
- **API Design**: RESTful APIs with structured error handling and request logging
- **Data Storage**: In-memory storage implementation with interface for easy database migration
- **File Handling**: Integration with Google Cloud Storage for asset management

### Database Schema Design
- **Users**: Authentication and user management
- **Contacts**: Lead capture and contact form submissions
- **Payments**: Razorpay payment processing with order tracking
- **Blog Posts**: Content management with categories and publishing status
- **Testimonials**: Client feedback with featured testimonial support
- **Schema Management**: Drizzle migrations in `./migrations` directory

### Payment Processing
- **Provider**: Razorpay integration for Indian market payments
- **Service Pricing**: Tiered pricing model for different coaching services
- **Order Management**: Complete payment lifecycle tracking from creation to completion
- **Security**: Secure payment handling with proper validation and error management

### Authentication & Security
- **Session Management**: Cookie-based authentication with credential handling
- **Input Validation**: Zod schemas for runtime type checking and validation
- **CORS Configuration**: Proper cross-origin resource sharing setup
- **Error Handling**: Centralized error handling with structured responses

### Development Experience
- **Build System**: Vite with hot module replacement and fast builds
- **Type Safety**: Full TypeScript coverage across frontend, backend, and shared schemas
- **Code Quality**: ESLint and TypeScript compiler checks
- **Development Tools**: Replit-specific plugins for enhanced development experience

### Responsive Design
- **Mobile-First**: Responsive design with mobile breakpoint handling
- **Component Library**: Comprehensive UI component system with consistent theming
- **Accessibility**: ARIA-compliant components with keyboard navigation support
- **Performance**: Optimized bundle splitting and lazy loading strategies

## External Dependencies

### Core Technologies
- **Database**: PostgreSQL via Neon Database serverless platform
- **Payment Gateway**: Razorpay for payment processing (Indian market focus)
- **Cloud Storage**: Google Cloud Storage for file and asset management
- **Build Tools**: Vite for frontend bundling, ESBuild for backend compilation

### Frontend Libraries
- **UI Components**: Radix UI primitives for accessible component foundations
- **Styling**: Tailwind CSS with PostCSS for utility-first styling
- **Forms & Validation**: React Hook Form with Hookform Resolvers and Zod
- **Data Fetching**: TanStack Query for server state management
- **File Upload**: Uppy ecosystem (Core, Dashboard, AWS S3 integration)
- **Date Handling**: date-fns for date manipulation and formatting

### Backend Services
- **Database Driver**: Neon Database serverless driver for PostgreSQL
- **Schema Management**: Drizzle Kit for database migrations and schema updates
- **Development Runtime**: tsx for TypeScript execution in development
- **HTTP Framework**: Express.js with middleware for logging and error handling

### Development & Deployment
- **Package Manager**: npm with lockfile for dependency management
- **Type Checking**: TypeScript compiler with strict configuration
- **Module Resolution**: ESModule support with proper import/export handling
- **Environment**: Node.js with cross-platform compatibility