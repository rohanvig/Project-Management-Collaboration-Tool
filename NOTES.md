# Architecture & Infrastructure Notes

As per the assignment optional deliverables, here is a brief overview of the project's technical decisions:

## Architecture Decisions
- **MERN Stack**: We chose MongoDB, Express, React, and Node.js for a cohesive JavaScript/JSON pipeline from database to frontend.
- **RESTful API**: Standardized endpoints (`/api/projects`, `/api/tasks`) with proper HTTP methods (`GET`, `POST`, `PUT`, `DELETE`).
- **Context API for State**: Instead of over-engineering with Redux Toolkit for a simple app, React's native Context API (`AuthContext`) perfectly handles session management and JWT persistence.
- **Global Error Handling**: Express middleware intercepts all errors to ensure a consistent JSON response format for the frontend.

## Caching Strategy
- **Client-Side Storage**: JWT Access and Refresh tokens are cached securely in `localStorage` to persist user sessions across reloads.
- **Optimistic UI Updates**: The Kanban board (via `@hello-pangea/dnd`) updates the React state immediately upon dragging a task, creating a seamless user experience, while the API call resolves silently in the background.

## Background Job Approach
- While not explicitly required for the core MVP, if scaling, we would implement **BullMQ** or **Agenda** in the Node.js backend.
- Background jobs would be used for:
  - Cleaning up expired refresh tokens from the database.
  - Sending email notifications asynchronously when a user is invited to a project or assigned a task, ensuring the main thread is never blocked.
