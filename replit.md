# CropSight - Crop Yield Prediction Platform

## Overview

CropSight is a modern web-based agricultural platform that leverages satellite data and machine learning to forecast maize yields. The application provides farmers, cooperatives, and policymakers with real-time crop health monitoring, rainfall integration, and early warning systems through an intuitive dashboard interface.

The platform combines geospatial data analysis with predictive modeling to help users make informed farming decisions, monitor field conditions, and optimize crop yields. It features interactive maps, weather monitoring, yield predictions, and alert systems designed specifically for agricultural stakeholders.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript using Vite as the build tool
- **UI Library**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom agricultural-themed color palette (green-focused design system)
- **State Management**: TanStack Query for server state management and caching
- **Routing**: Wouter for lightweight client-side routing
- **Form Handling**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Design**: RESTful API with structured route handlers
- **Authentication**: OpenID Connect (OIDC) integration with Replit Auth using Passport.js
- **Session Management**: Express sessions with PostgreSQL session store
- **Database ORM**: Drizzle ORM for type-safe database operations

### Data Storage Solutions
- **Primary Database**: PostgreSQL (configured for Neon serverless)
- **Schema Design**: Comprehensive agricultural data model including:
  - User management (farmers, cooperatives, policymakers)
  - Field management with geospatial coordinates
  - Satellite data storage (NDVI, EVI, SARVI indices)
  - Weather data integration
  - Yield prediction storage
  - Alert and notification system
- **Session Storage**: PostgreSQL-backed session storage for authentication

### Authentication and Authorization
- **Authentication Method**: Replit OIDC integration
- **Session Management**: Server-side sessions with secure HTTP-only cookies
- **Authorization**: Role-based access control with user types (farmer, cooperative, policymaker)
- **Security**: CSRF protection, secure session configuration

### Key Features Architecture
- **Geospatial Data**: Field location tracking with latitude/longitude coordinates
- **Satellite Data Integration**: Storage and processing of vegetation indices (NDVI, EVI, SARVI)
- **Weather Monitoring**: Real-time weather data integration for field-specific conditions
- **Predictive Analytics**: Machine learning model integration for yield predictions
- **Alert System**: Configurable notification system for crop health, weather, and yield alerts
- **Interactive Mapping**: Client-side map integration with Leaflet for field visualization

## External Dependencies

### Core Infrastructure
- **Database**: Neon PostgreSQL serverless database
- **Authentication**: Replit OIDC service
- **WebSocket Support**: ws library for Neon database connections

### Frontend Libraries
- **UI Components**: Radix UI component primitives
- **Mapping**: Leaflet for interactive maps and geospatial visualization
- **Charts**: Chart.js for analytics and data visualization
- **Styling**: Tailwind CSS with PostCSS processing

### Development Tools
- **Build System**: Vite with React plugin
- **TypeScript**: Full TypeScript support with strict configuration
- **Database Management**: Drizzle Kit for migrations and schema management
- **Development Environment**: Replit-specific tooling and error handling

### Third-Party Integrations
- **Satellite Data**: Infrastructure prepared for satellite imagery and vegetation index APIs
- **Weather Services**: Backend support for weather data API integration
- **Machine Learning**: Architecture prepared for yield prediction model integration